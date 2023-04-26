var config = require("./config.json")
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');
let pack = fs.readFileSync("./growtopia/server_data.php")
const {
  exec
} = require('child_process');
const blockedUserAgents = ['BadUserAgent', 'EvilUserAgent'];
const express = require('express');
var pk = fs.readFileSync('./file/server.key');
var pc = fs.readFileSync('./file/server.crt');
const app = express();
var optss = { key: pk, cert: pc };
let requestCounter = 0;
const maxRequestPerWindow = 5;
const windowMs = 60000;
var blacklist = new Map();
const port = process.argv[2] || 443;
require('events').EventEmitter.prototype._maxListeners = 100;

var packet = `server|${config.ip}\nport|${config.port}\ntype|1\n#maint|Server is currently initializing or re-syncing with sub servers. Please try again in a minute.\n\n\nbeta_server|127.0.0.1\nbeta_port|17091\nbeta_type|1\nbeta2_server|127.0.0.1\nbeta2_port|17099\nbeta2_type|1\nmeta|${config.meta}\nRTENDMARKERBS1001`;

//Blocker DDOS Req L7
const ipBlocker = function(req, res, ip) {
  if (config.Firewall == true && config.linux == false){
    exec(`netsh advfirewall firewall add rule name="${ip}" dir=in action=block remoteip="${ip}"`, (error, stdout, stderr, spawn) => {
      if (error) {
        return console.log("Please Run as Administrator...")
      } else {
        console.log(`Success Block The IP [Windows]`)
        return
      }
    });
  }
  else if (config.Firewall == true && config.linux == true){
    exec(`sudo ufw deny from ${ip} to any`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    console.log(`Success Block The IP [Linux]`);
  });
}
  }

var server = https.createServer(optss, function (req, res) {
  const parsedUrl = url.parse(req.url);
  let pathname = `.${parsedUrl.pathname}`;
  const ext = path.parse(pathname).ext;
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") {
  ip = ip.substr(7)
  }
  console.log(`Server Connection: ${ip} Request Url: ${req.url} Request Method: ${req.method}`);
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
  };
  if(req.url == ":443"){
  console.log(`443 Ip Protection [${ip}]`);
  }
  const allowedMethodServer = ['POST'];
  const allowedMethodCustom = ['GET'];
  const method = req.method.toUpperCase();
  const userAgent = req.headers['user-agent'];

  if (blockedUserAgents.includes(userAgent)) {
    res.writeHead(301, { 'Location': `https://nasa.gov/` });
      res.end();
      ipBlocker(req, res, ip); 
      console.log(`Bad User Agents Detect [${ip}]`);
  } else {
  if(req.url === "/growtopia/server_data.php")
  {
    if(allowedMethodServer.includes(method)){
    res.write(packet, function (err) {
      if (err)
          console.log(err);
  });
  res.end();
  }else{
  res.writeHead(301, { 'Location': `https://nasa.gov/` });
  res.end();
  ipBlocker(req, res, ip);
  console.log(`GT+ Protection [${ip}]`);
  }
  }else
  {
    if(allowedMethodCustom.includes(method)){
    if( req.url.indexOf("/cache") !== -1)
    {
      console.log(`Connection from: ${ip}\nDownloading:${req.url}`);
  fs.exists(pathname, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 301;
      res.writeHead(301, {
        Location: `https://ubistatic-a.akamaihd.net/${config.cdn}${req.url}`
      }).end();
            return;
    }

    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 404;
        res.end(`error from loading`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });    

    }
    else
    {
      res.writeHead(301, { 'Location': `https://nasa.gov/` });
      res.end();
      ipBlocker(req, res, ip); 
      console.log(`GT+ Protection [${ip}]`);
    }
  }else
  {
    res.writeHead(301, { 'Location': `https://nasa.gov/` });
    res.end();
    ipBlocker(req, res, ip); 
    console.log(`GT+ Protection [${ip}]`);
  }
  }
}
});

server.listen(parseInt(port));


server.on("listening", function () { return console.log(`GT+ HTTPS Listen To TCP ${port} && UDP ${config.port}`); });
console.clear();
console.log(`GT+ Protection [METHOD HANDLE]`);
console.log(``);
console.log(`GrowtopiaPlus-> Blocked Method By Vert/Moccha`);