# ocspProxyMock
1. Clone repo
2. From command line: 
`npm install`
3. When installation of packages has finished run:
`node app.js`

The server really has 1 endpoint for TARA server which is http://<server-url>/ocsp
App will run by default on `port 80`.

Delay value is kept in milliseconds in `config/delay.json`
To change the delay value either edit the file or while the server is running go to: `http://<server-url>:port/delay` in your browser and change its value there.

In order to tell the TARA-SERVER to make querries to this URL change ocsp.serviceUrl in application.properties in the TARA-SERVER to point to the IP of the server.

IF at some point the response from this server should no longer work go into proxy.js file and run it
to see what the new response would have to be. If needed remove the .setHeader lines and replace them with the necessary ones.
