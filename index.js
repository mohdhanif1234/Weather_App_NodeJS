const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

let temperature = ""
const replaceVal = (tempVal, orgVal) => {

    temperature = tempVal.replace("{%tempval%}", orgVal.main.temp)
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min)
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max)
    temperature = temperature.replace("{%location%}", "Mumbai")
    temperature = temperature.replace("{%country%}", "India")
}
const server = http.createServer((req, res) => {
    if (req.url === "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=3ae76e714b169928da117f0c7e039364')
            .on('data', (chunk) => {
                const obj = JSON.parse(chunk)
                const arrData = [obj];
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join(" ")
                res.write(temperature)
                res.end()
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);

                console.log('end');
            });
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("listening");
});

