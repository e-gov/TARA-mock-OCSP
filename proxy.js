var express = require('express');
var app = express();
var http = require('http');
var httpProxy = require('http-proxy');
var asn1 = require("asn1-ber");

//Uncomment one block or the other for either header or body of the needed reponse
//Set TARA server ocsp on the url of this server and find out what the response is.


//FOR getting body data
// var proxy = httpProxy.createProxyServer({
//     target: 'http://demo.sk.ee/ocsp'
// })
//
// function requestHandler(req, res) {
//     var option = {
//         target: 'http://demo.sk.ee/ocsp',
//         selfHandleResponse: true
//     };
//     proxy.on('proxyRes', function (proxyRes, req, res) {
//         var body = new Buffer('', 'binary');
//         proxyRes.on('data', function (data) {
//             body = Buffer.concat([body, data]);
//         });
//         proxyRes.on('end', function () {
//             /*bufferArray = [];
//             for(var i=0; i<body.length; i++){
//                 bufferArray[i] = body[i].toString(256);
//             }*/
//
//             var reader = new asn1.BerReader(body);
//
//             /*for(var i = 0; i<30; i++){
//                 var string = reader.readString();
//                 console.log(string);
//             }*/
//
//             body = body.toString('base64');
//             console.log("res from proxied server:", body);
//             res.end("my response to cli");
//         });
//     });
//     proxy.web(req, res, option);
// };
// var proxyServer = http.createServer(requestHandler);
//
// proxyServer.listen(80, function () {
//     console.log("Proxy running on port 80");
// });

//FOR getting HEADERS data
// var httpProxy = require('http-proxy');
// // Error example
// //
// // Http Proxy Server with bad target
// //
// var proxy = httpProxy.createServer({
//         target: 'http://demo.sk.ee/ocsp',
// });
//
// proxy.listen(80);
//
// //
// // Listen for the `error` event on `proxy`.
// proxy.on('error', function (err, req, res) {
//     res.writeHead(500, {
//         'Content-Type': 'text/plain'
//     });
//
//     res.end('Something went wrong. And we are reporting a custom error message.');
// });
//
// //
// // Listen for the `proxyRes` event on `proxy`.
// //
// proxy.on('proxyRes', function (proxyRes, req, res) {
//     console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
// });