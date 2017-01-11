var express = require('express'),
    restful = require('node-restful'),
    mongoose = restful.mongoose;

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

mongoose.connect('mongodb://localhost/energia');

var UserSchema = mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  createdat: String,
  updatedat: String,
  enabled: Boolean
});

var DatalogSchema = mongoose.Schema({
  intensity: Number,
  voltage: Number,
  createdat: String,
  updatedat: String
});

var RaspberrySchema = mongoose.Schema({
  name: String,
  iduser: String,
  location: String,
  ip: String,
  batery: Number,
  rangebatery1: Number,
  rangebatery2: Number,
  createdat: String,
  updatedat: String,
  enabled: Boolean
});

var Users = restful.model('users', UserSchema);
Users.methods(['get', 'put', 'post', 'delete']);
Users.register(app, '/api/users');

var Datalogs = restful.model('datalogs', DatalogSchema);
Datalogs.methods(['get', 'put', 'post', 'delete']);
Datalogs.register(app, '/api/datalogs');

var Raspberrys = restful.model('raspberrys', RaspberrySchema);
Raspberrys.methods(['get', 'put', 'post', 'delete']);
Raspberrys.register(app, '/api/raspberrys');

app.listen(3000);
console.log('Sirviendo en puerto 3000');
