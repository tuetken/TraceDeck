// traceDeckLogger — passive Express middleware for TraceDeck observability.
// Intercepts every request/response cycle and fires log payloads to the
// TraceDeck ingest endpoint without touching the request lifecycle.

export function traceDeckLogger(config) {
  // Fail at setup time so misconfiguration surfaces immediately at startup,
  // not silently per-request hours later.
  if (!config?.ingestUrl || !config?.projectId) {
    throw new Error('traceDeckLogger: ingestUrl and projectId are required');
  }

  return function (req, res, next) {
    const startTime = Date.now();

    // Register before calling next() to avoid a race where a synchronous
    // handler flushes the response before the listener is attached.
    res.on('finish', () => {
      const responseTimeMs = Date.now() - startTime;

      // req.baseUrl + req.path gives the full route path without the query
      // string, regardless of where this middleware is mounted in the router tree.
      const payload = {
        projectId: config.projectId,
        path: req.baseUrl + req.path,
        method: req.method,
        statusCode: res.statusCode,
        responseTimeMs,
        ipAddress: req.ip ?? undefined,
        userAgent: req.headers['user-agent'] ?? undefined,
      };

      // Fire-and-forget — never await. The .catch() prevents an unhandled
      // promise rejection from surfacing if the ingest endpoint is unreachable.
      fetch(config.ingestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => {
        if (config.logErrors) {
          console.error('[tracedeck] ingest failed:', err.message);
        }
      });
    });

    next();
  };
}
