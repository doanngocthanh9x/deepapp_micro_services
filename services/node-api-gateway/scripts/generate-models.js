#!/usr/bin/env node
/*
  generate-models.js

  - Try to connect to the database using the project's Sequelize config.
  - If successful, introspect tables and columns and generate Sequelize model files
  - If DB is not reachable, fall back to parsing the DDL SQL file at shared/database_ddl/mysql/script01.sql

  Generated model files will be placed in `./models` and will follow the style
  used by existing model files (singular PascalCase model name, `tableName` set,
  and common column options).

  Run: `node scripts/generate-models.js` or `npm run generate-models`
*/

const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const sequelize = require('../config/database');
const queryInterface = sequelize.getQueryInterface();

const ROOT = path.join(__dirname, '..');
const MODELS_DIR = path.join(ROOT, 'models');
const DDL_PATH = path.join(ROOT, '..', '..', 'shared', 'database_ddl', 'mysql', 'script01.sql');

function pascalCase(str) {
  return str
    .replace(/(^|[_-])[a-z]/g, (m) => m.toUpperCase())
    .replace(/[_-]/g, '');
}

function mapColumnType(columnType) {
  if (!columnType) return 'DataTypes.STRING';
  const t = columnType.toLowerCase();
  if (/int\b/.test(t)) return 'DataTypes.INTEGER';
  if (/tinyint\(1\)/.test(t) || /boolean/.test(t)) return 'DataTypes.BOOLEAN';
  if (/varchar\((\d+)\)/.test(t)) {
    const m = t.match(/varchar\((\d+)\)/);
    return `DataTypes.STRING(${m[1]})`;
  }
  if (/char\((\d+)\)/.test(t)) {
    const m = t.match(/char\((\d+)\)/);
    return `DataTypes.CHAR(${m[1]})`;
  }
  if (/text/.test(t)) return 'DataTypes.TEXT';
  if (/date\b|datetime|timestamp/.test(t)) return 'DataTypes.DATE';
  if (/decimal\(/.test(t)) return 'DataTypes.DECIMAL';
  if (/double/.test(t)) return 'DataTypes.DOUBLE';
  if (/float/.test(t)) return 'DataTypes.FLOAT';
  if (/enum\(/.test(t)) {
    const vals = t.match(/enum\((.*)\)/)[1]
      .split(/\s*,\s*/)
      .map(v => v.replace(/^'/, '').replace(/'$/, ''))
      .map(v => `'${v}'`)
      .join(', ');
    return `DataTypes.ENUM(${vals})`;
  }
  return 'DataTypes.STRING';
}

function generateFieldSnippet(name, column) {
  const lines = [];
  const type = mapColumnType(column.type || column);
  lines.push(`${name}: {`);
  lines.push(`    type: ${type},`);
  if (column.primaryKey || column.primary_key) lines.push('    primaryKey: true,');
  if (column.autoIncrement || column.extra === 'auto_increment') lines.push('    autoIncrement: true,');
  if (column.allowNull === false || /not null/i.test(column.allowNull || column)) lines.push('    allowNull: false,');
  if ((column.defaultValue !== undefined && column.defaultValue !== null) || (column.default !== undefined && column.default !== null)) {
    const dv = column.defaultValue !== undefined ? column.defaultValue : column.default;
    // Represent booleans and numbers literally, strings quoted
    if (typeof dv === 'number' || /^\d+$/.test(String(dv))) lines.push(`    defaultValue: ${dv},`);
    else if (typeof dv === 'boolean') lines.push(`    defaultValue: ${dv},`);
    else lines.push(`    defaultValue: ${JSON.stringify(dv)},`);
  }
  lines.push('  },');
  return lines.join('\n');
}

async function generateModelFile(tableName, columns) {
  const modelName = pascalCase(tableName.replace(/s$/i, ''));
  const fileName = path.join(MODELS_DIR, `${modelName}.js`);

  const fields = Object.keys(columns).map((col) => generateFieldSnippet(col, columns[col])).join('\n\n');

  const hasCreated = !!columns.created_at;
  const hasUpdated = !!columns.updated_at;
  const timestamps = hasCreated && hasUpdated;

  const content = `const { DataTypes } = require('sequelize');\nconst sequelize = require('../config/database');\n\nconst ${modelName} = sequelize.define('${modelName}', {\n${fields}\n}, {\n  tableName: '${tableName}',\n  timestamps: ${timestamps},\n${timestamps ? "  createdAt: 'created_at',\n  updatedAt: 'updated_at',\n" : ''}  // indexes can be added manually\n});\n\nmodule.exports = ${modelName};\n`;

  await writeFile(fileName, content, 'utf8');
  console.log(`Wrote model: ${fileName}`);
}

async function parseDDLAndGenerate(ddlPath) {
  const sql = await readFile(ddlPath, 'utf8');
  const createTableRegex = /CREATE\s+TABLE\s+`?([^\s`(]+)`?\s*\(([\s\S]*?)\)\s*;?/gi;
  let m;
  const tasks = [];
  while ((m = createTableRegex.exec(sql)) !== null) {
    const table = m[1];
    const body = m[2];
    const lines = body.split(/,\n/).map(l => l.trim());
    const columns = {};
    for (let line of lines) {
      // stop at constraints/keys
      if (/^(PRIMARY|KEY|UNIQUE|CONSTRAINT|INDEX)\b/i.test(line)) continue;
      const colMatch = line.match(/^`?([a-zA-Z0-9_]+)`?\s+([^,]+)/i);
      if (!colMatch) continue;
      const colName = colMatch[1];
      const rest = colMatch[2].trim();
      const col = { type: rest };
      if (/not null/i.test(rest)) col.allowNull = false;
      if (/auto_increment/i.test(rest)) col.autoIncrement = true;
      const pk = /primary key/i.test(rest);
      if (pk) col.primaryKey = true;
      const defMatch = rest.match(/default\s+([^\s]+)/i);
      if (defMatch) col.default = defMatch[1].replace(/,$/, '').replace(/^'/, '').replace(/'$/, '');
      columns[colName] = col;
    }
    tasks.push(generateModelFile(table, columns));
  }
  await Promise.all(tasks);
}

async function introspectAndGenerate() {
  try {
    await sequelize.authenticate();
    console.log('Database reachable — introspecting tables...');
    const tables = await queryInterface.showAllTables();
    for (const t of tables) {
      const tableName = typeof t === 'object' && t.tableName ? t.tableName : t;
      const columns = await queryInterface.describeTable(tableName);
      await generateModelFile(tableName, columns);
    }
  } catch (err) {
    console.warn('DB introspection failed, falling back to DDL parser:', err.message);
    if (!fs.existsSync(DDL_PATH)) {
      console.error('DDL file not found at', DDL_PATH);
      process.exitCode = 2;
      return;
    }
    await parseDDLAndGenerate(DDL_PATH);
  }
}

async function ensureModelsDir() {
  if (!fs.existsSync(MODELS_DIR)) await mkdir(MODELS_DIR, { recursive: true });
}

(async () => {
  try {
    await ensureModelsDir();
    await introspectAndGenerate();
    console.log('Model generation complete. You can run `npm run generate-models` again when schema changes.');
  } catch (err) {
    console.error('Error generating models:', err);
    process.exitCode = 1;
  } finally {
    try { await sequelize.close(); } catch(e){}
  }
})();
