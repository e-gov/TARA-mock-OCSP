//Set TARA server ocsp on the url of this server and find out what the response and request are.
var express = require('express');
var app = express();
var http = require('http');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({
    target: 'http://demo.sk.ee/ocsp',
    secure: false,
    changeOrigin: true
})

function requestHandler(req, res) {
    var option = {
        target: 'http://demo.sk.ee/ocsp',
        selfHandleResponse: true,
        secure: false,
        changeOrigin: true
    };

    proxy.on('proxyReq', function(proxyReq, req, res, options) {
        console.log("Request Path: " + proxyReq.path);
        console.log("Method: " + proxyReq.method);
        console.log("Request Headers: " + JSON.stringify(req.headers));
    });
    proxy.on('proxyRes', function (proxyRes, req, res) {
        console.log('RAW Response headers from the target', JSON.stringify(proxyRes.headers, true, 2));
        var body = new Buffer('', 'binary');
        proxyRes.on('data', function (data) {
            body = Buffer.concat([body, data]);
        });
        proxyRes.on('end', function () {
            var bodyString = body.toString('base64');
            console.log("Raw res body from proxied server:", bodyString);
            if(!res.finished) {
                //These are from the logs of this js file. Change them if needed.
                res.setHeader("date", new Date().toUTCString());
                res.setHeader("server", "Apache");
                res.setHeader("content-length", "1744");
                res.setHeader("connection", "close");
                res.setHeader("content-type", "application/ocsp-response");
                res.end(body);
            }
        });
    });
    proxy.web(req, res, option);
};
var proxyServer = http.createServer(requestHandler);

proxyServer.listen(80, function () {
    console.log("Proxy running on port 80");
});