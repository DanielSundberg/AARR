const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(
        '/reader', 
        createProxyMiddleware({
            target: "https://theoldreader.com",
            changeOrigin: true
        })
    );
    app.use(
        '/api', 
        createProxyMiddleware({
            target: "http://localhost:5000",
            changeOrigin: true
        })
    );
}