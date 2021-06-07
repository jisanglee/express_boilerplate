const { createProxyMiddleware } = require('http-proxy-middleware');

//cors 이슈 대응 위해 필요한 proxy 설정
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};