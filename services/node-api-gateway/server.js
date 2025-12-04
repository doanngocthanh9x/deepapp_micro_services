const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { sequelize } = require('./models');

const swaggerUi = require('swagger-ui-express');
const generateOpenApiSpec = require('./utils/generateSwaggerFromExpress');

const { exec } = require('child_process');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');

/**
 * Recursively register route files found under routesDir.
 * - files: /routes/foo.js -> /api/foo
 * - files: /routes/admin/users.js -> /api/admin/users
 * - index.js files map to their directory: /routes/admin/index.js -> /api/admin
 */
function registerRoutes(dir, baseRoute = '/api') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      registerRoutes(fullPath, baseRoute + '/' + entry.name);
      continue;
    }

    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name);
    if (!['.js', '.cjs', '.mjs'].includes(ext)) continue;

    const name = path.basename(entry.name, ext);
    if (name.startsWith('.')) continue;

    // index.js mounts at the directory route, otherwise use filename
    const mountPath = name === 'index' ? baseRoute : path.posix.join(baseRoute, name);

    try {
      const mod = require(fullPath);
      const router = mod && mod.default ? mod.default : mod;

      // basic check for an Express router (has stack array) or a middleware function
      const looksLikeRouter = (router && Array.isArray(router.stack)) || typeof router === 'function';

      if (!looksLikeRouter) {
        console.warn(`⚠ Skipping ${path.relative(__dirname, fullPath)} — not an Express router`);
        continue;
      }

      app.use(mountPath, router);
      console.log(`✓ Registered route ${mountPath} -> ${path.relative(__dirname, fullPath)}`);
    } catch (err) {
      console.warn(`⚠ Failed to register ${path.relative(__dirname, fullPath)}: ${err.message}`);
    }
  }
}

try {
  if (fs.existsSync(routesDir)) {
    registerRoutes(routesDir, '/api');
  } else {
    console.warn('⚠ Routes directory not found:', routesDir);
  }
} catch (err) {
  console.warn('⚠ Failed to auto-register routes:', err.message);
}

// Auto-generate and serve Swagger UI (will reflect registered routes)
try {
  const swaggerSpec = generateOpenApiSpec(app, {
    title: 'Job Portal API - Auto-generated',
    description: 'Auto-generated documentation from Express routes',
    version: '1.0.0',
  });
  if (swaggerSpec) {
    // Use relative server url so "Try it out" sends requests to the same origin/port
    try {
      swaggerSpec.servers = [{ url: '/' }];
    } catch (e) {
      // ignore if swaggerSpec not mutable
    }
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
    console.log('✓ Swagger UI available at /docs (auto-generated)');
  }
} catch (err) {
  console.warn('⚠ Failed to initialize Swagger UI:', err.message);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Gateway is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Sync database and start server
let PORT = parseInt(process.env.PORT) || 3000;
const MAX_PORT_ATTEMPTS = 5;
let portAttempts = 0;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection successful');
    
    // Sync database
    await sequelize.sync({ alter: false });
    console.log('✓ Database synchronized');
  } catch (err) {
    console.warn('⚠ Database connection failed:', err.message);
    console.warn('⚠ Server will run without database sync');
    console.warn('⚠ To fix: Ensure MySQL is running at', process.env.DB_HOST + ':' + process.env.DB_PORT);
  }

  // Start server regardless of database status
  const server = app.listen(PORT, () => {
    console.log(`✓ Server is running on port ${PORT}`);
    console.log(`✓ API Health Check: http://localhost:${PORT}/health`);
  });

  // Handle port in use error - try next port
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      portAttempts++;
      if (portAttempts >= MAX_PORT_ATTEMPTS) {
        console.error(`❌ Could not find available port after ${MAX_PORT_ATTEMPTS} attempts`);
        console.error('Please kill process using port 3000:');
        console.error('  pkill -9 node');
        process.exit(1);
      }
      const busyPort = PORT;
      PORT++;
      console.warn(`⚠ Port ${busyPort} is in use, trying port ${PORT}...`);
      // attempt to show which process holds the port (best-effort)
      try {
        exec(`lsof -i :${busyPort} -n -P`, (error, stdout, stderr) => {
          if (stdout) {
            console.warn(`Processes using port ${busyPort}:\n${stdout}`);
          } else if (stderr) {
            console.warn(`lsof stderr: ${stderr}`);
          } else if (error) {
            console.warn(`Could not run lsof: ${error.message}`);
          }
        });
      } catch (e) {
        // ignore
      }
      setTimeout(() => startServer(), 500);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

startServer();
