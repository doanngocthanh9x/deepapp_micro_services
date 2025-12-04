/**
 * Minimal automatic OpenAPI generator for an Express app.
 * It inspects `app._router.stack` and produces basic paths/methods entries.
 * This is intentionally minimal: generated documentation provides endpoints, methods and a generic response schema.
 */
function normalizePath(path) {
  if (!path) return '/';
  // collapse double slashes
  let p = path.toString();
  p = p.replace(/\\/g, '/');
  p = p.replace(/\/+/g, '/');
  // ensure starts with /
  if (!p.startsWith('/')) p = '/' + p;
  // remove trailing slash (but keep root)
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

function generateOpenApiSpec(app, info = {}) {
  const paths = {};

  if (!app || !app._router) {
    return null;
  }

  const stacks = app._router.stack || [];

  stacks.forEach((layer) => {
    if (!layer) return;

    // route registered directly
    if (layer.route && layer.route.path) {
      const route = layer.route;
      const path = normalizePath(route.path || '');
      paths[path] = paths[path] || {};
      Object.keys(route.methods || {}).forEach((m) => {
        const method = m.toLowerCase();
        paths[path][method] = {
          summary: `Auto-generated ${method.toUpperCase()} ${path}`,
          tags: [path.split('/')[1] || 'default'],
          responses: {
            200: {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        };
      });
    }

    // route registered as a layer with regexp (express.Router)
    if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      // Try to extract a literal base path from the layer.regexp.source
      let base = '';
      if (layer.regexp && layer.regexp.source) {
        const src = layer.regexp.source;
        const re = /\\\/([A-Za-z0-9_-]+)/g;
        let m;
        const parts = [];
        while ((m = re.exec(src)) !== null) {
          parts.push('/' + m[1]);
        }
        base = parts.join('') || '';
      }

      layer.handle.stack.forEach((handler) => {
        if (!handler.route) return;
        const route = handler.route;
        const combined = normalizePath((base + (route.path || '')).replace(/\\/g, '/'));
        const fullPath = combined;
        paths[fullPath] = paths[fullPath] || {};
        Object.keys(route.methods || {}).forEach((m) => {
          const method = m.toLowerCase();
          paths[fullPath][method] = {
            summary: `Auto-generated ${method.toUpperCase()} ${fullPath}`,
            tags: [fullPath.split('/')[1] || 'default'],
            responses: {
              200: {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/ApiResponse' },
                  },
                },
              },
            },
          };
        });
      });
    }
  });

  const openapi = {
    openapi: '3.0.0',
    info: Object.assign({ title: 'Auto-generated API', version: '1.0.0' }, info),
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    paths,
    components: {
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            count: { type: 'integer' },
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
      },
    },
  };

  return openapi;
}

module.exports = generateOpenApiSpec;
