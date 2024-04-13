const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/auth',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true,
        })
    );

    app.use(
        '/RecEngine',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true,
        })
    );
};