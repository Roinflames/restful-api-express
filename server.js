var express = require('express'),
    restful = require('node-restful'),
    mongoose = restful.mongoose;
var jwt = require('jsonwebtoken');
var passport = require('passport');
var User = require('./app/models/user');
var config = require('./config/main');

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

app.use(passport.initialize());
require('./config/passport')(passport);

app.get('/', function(req, res){
  res.send("Aqui va la pagina de inicio.");
});
/*============================================================================*/
//Rutas de la api
var apiRoutes = express.Router();

apiRoutes.post('/register', function(req,res){
  if(!req.body.email || !req.body.password) {
    res.json({ success: false, message: 'Porfavor ingrese email y contraseña.'});
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password
    });
  //guardar usuario
  newUser.save(function(err){
    if (err) {
      return res.json({success: false, message: 'El correo ya existe'});
    }
    res.json({ success: true, message: 'Usuario registrado con éxito.'});
  });
  }
});

//proteger una zona con jwt
apiRoutes.get('/dashboard', passport.authenticate('jwt', {session: false}), function(req, res) {
  res.send('Resulto! User id: '+ req.user._id + '.');
});

app.use('/api', apiRoutes);

// ruta de registro de usuario para recibir jwt
apiRoutes.post('/authenticate', function(req, res){
  User.findOne({
    email: req.body.email
  }, function (err, user){
    if (err) throw (err);

    if(!user) {
      res.send({ success: false, message: 'Fallo en la autenticación. Usuario no registrado.'});
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.sign(user, config.secret, {
            expiresIn: 10000 //segundos
          });
          res.json({ success: true, token: 'JWT '+ token});
        } else {
          res.send({ success: false, message: 'Fallo en la autenticación. La clave no coincide.'});
        }
      });
    }
  });
});
/*============================================================================*/
//proteger una zona con jwt
app.get('/api/users', passport.authenticate('jwt', {session: false}), function(req, res) {
  res.send('Resulto! User id: '+ req.user._id + '.');
});

app.use('/api', apiRoutes);

//var Users = restful.model('users', UserSchema);
//Users.methods(['get', 'put', 'post', 'delete']);
//Users.register(app, '/api/users');

var Datalogs = restful.model('datalogs', DatalogSchema);
Datalogs.methods(['get', 'put', 'post', 'delete']);
Datalogs.register(app, '/api/datalogs');

var Raspberrys = restful.model('raspberrys', RaspberrySchema);
Raspberrys.methods(['get', 'put', 'post', 'delete']);
Raspberrys.register(app, '/api/raspberrys');

app.listen(3000);
console.log('Sirviendo en puerto 3000');
