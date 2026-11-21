
const http = require('http');
const { analyzeHeaders } = require('headergauge');

const stats = {
  totalRequests: 0,
  acceptedRequests: 0,
  rejectedRequests: 0,
  totalHeaderBytes: 0
};

const server = http.createServer((req, res) => {
  const analysis = analyzeHeaders(req.headers, {
    maxTotalBytes: 16384,
    maxHeaderBytes: 8192
  });

  stats.totalRequests++;
  stats.totalHeaderBytes += analysis.totalBytes;

  console.log(`\n${req.method} ${req.url}`);
  console.log('Header size:', analysis.totalBytes, 'bytes');

  if (!analysis.withinBudget || analysis.oversizedHeaders.length > 0) {
    stats.rejectedRequests++;

    res.writeHead(431, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Request headers too large',
      analysis
    }));
    return;
  }

  stats.acceptedRequests++;

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      application: 'Node.js API Monitoring Server',
      status: 'running',
      poweredBy: 'HeaderGauge',
      endpoints: {
        health: '/health',
        data: '/api/data',
        statistics: '/api/stats'
      }
    }, null, 2));
    return;
  }

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'Server is healthy' }));
    return;
  }

  if (req.url === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Data retrieved successfully',
      data: ['Node.js', 'Express', 'HeaderGauge']
    }));
    return;
  }

  if (req.url === '/api/stats' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats, null, 2));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`API Monitoring Server running on port ${PORT}`);
});
