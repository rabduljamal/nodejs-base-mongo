var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var AccessControl = require('express-ip-access-control');
var cors = require('cors');
var mongoose = require('mongoose');

require('dotenv').config();
process.env.TZ = 'Asia/Jakarta'

const optsLogs = {
  errorEventName:'error',
      logDirectory:'logs', // NOTE: folder must exist and be writable...
      fileNamePattern:'roll-<DATE>.log',
      dateFormat:'YYYY.MM.DD'
};

const optionsAccessControl = {
	mode: 'allow',
	allows: [
    '127.0.0.1', 
    '::1', 
    '10.42.1.0/16'
  ],
	forceConnectionAddress: false,
	log: function(clientIp, access) {
		console.log(clientIp + (access ? ' accessed.' : ' denied.'));
	},
	statusCode: 200,
	redirectTo: '',
	message: 'Unauthorized'
};

const optsCors = {
  origin: [process.env.APP_CLIENT],
  credentials: true,
  methods: [
    'GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'
  ],
  allowedHeaders: [
    'Origin', 'Content-Type', 'Accept', 'Authorization', 'X-Requested-With', 'Origin'
  ],
  preflightContinue: true,
}

global.app = express();
global.moment = require('moment');
global.appDir = path.resolve(__dirname);
global.log = require('simple-node-logger').createRollingFileLogger( optsLogs );

//encrypt
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET);
global.encrypt = (obj) => {
  const encryptedString = cryptr.encrypt(obj);
  return encryptedString
}

global.decrypt = (obj) => {
  const decryptedString = cryptr.decrypt(obj);
  return decryptedString
}

global.UUID = (obj) => {
  return obj+"-"+moment().format('YYMMDDHH-mmssSSSS')
}

app.use(AccessControl(optionsAccessControl));
app.use(cors(optsCors));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', "Origin, Content-Type, Accept, Authorization, X-Requested-With, Origin");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({limit: '20mb', extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


global.Responser = require(appDir+'/app/lib/LibResponser');
global.s3minio = require(appDir+'/app/lib/s3minio');

// Init MongoDB
const mongo = require(appDir+'/db/mongo')
mongo.init({
  onConnect() {
    console.log('Connected to MongoDB')
    if (process.env.NODE_ENV === 'test') {
      app.emit('mongoConnected')
    }
  },
  onError() {
    console.log('MongoDB connection error')
  },
  onDisconnect() {
    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB disconnected')
    }
  }
})


require(appDir+'/config/routes/index')();
require(appDir+'/app/cron/index')();




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    'status': 'error',
    'messages': 'Not Found',
    'result': ''
  })
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({
    'status': 'error',
    'messages': res.locals.message,
    'result': res.locals.error
  })
});

module.exports = app;

var mongoose = require('mongoose');


