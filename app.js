//instructions on how these headers and the response string were made can be found in proxy.js
var express = require('express');
var app = express();
var http = require('http');
var httpProxy = require('http-proxy');
const fs = require('fs');

//set view engine
app.set('view engine', 'ejs');

//endpoint for setting delay
app.get('/delay', (req, res) => {
    console.log("Delay UI rendering triggered")
    res.render('ui');
});

//endpoint for submitting delay
app.get('/submit_delay', (req, res) => {
    console.log("Delay post triggered");
    const delayMS = req.query.delayms;
    if (!delayMS || delayMS == "undefined" || isNaN(delayMS)) {
        console.log("Invalid delay input");
        res.status(404).send("Forbidden input");
        return;
    }
    const obj = {
        delay: delayMS
    }
    fs.writeFile("./config/delay.json", JSON.stringify(obj), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved with delay of " + delayMS + "mS");
        res.status(200).send("Delay time succesfully overwritten to: " + delayMS / 1000);
    });
});


//endpoint for getting current delay value
app.get('/get_delay', (req, res) => {
    console.log("Get delay triggered");
    var timeJob = getDelayFromFile().then(function (delayTimeMs) {
        const delayInS = delayTimeMs / 1000;
        console.log("Get delay response: " + delayInS + "s");
        res.send(delayInS.toString());
    })
});

app.listen(80, () => {
    console.log("Server running on port " + 80);
});

app.post('/ocsp', async (req, res) => {
    console.log("OCSP Post received");
    getDelayFromFile().then(function (delayTime) {
        getStubResponse(delayTime).then(function (response) {
            res.set('Content-Type', 'application/ocsp-response');
            res.set('connection', 'close');
            res.set('content-length', '1744');
            res.set('server', 'Apache');
            res.set('date', new Date().toUTCString());
            var buffer = new Buffer(response, 'base64');
            res.send(buffer);
            console.log("OCSP response sent!")
        })
    })

});

var base64String = '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';

//function (with optional delay) for getting ocsp response
async function getStubResponse(delayTime) {
    const response = await getResponseBodyAfterTime(delayTime);
    return response;
}

function getResponseBodyAfterTime(delayTime) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(base64String)
        }, delayTime)
    });
}

//read delay from its original file
function getDelayFromFile() {
    return new Promise(function (resolve, reject) {
        fs.readFile('config/delay.json', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            }
            dataJson = JSON.parse(data);
            console.log("Response Delay: " + dataJson.delay + "ms");
            resolve(dataJson.delay);
        });
    })
}

