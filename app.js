var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var config = require('./config/main');
var User = require('./app/models/user');
var jwt = require('jsonwebtoken');
var port = process.env.PORT || 3001;

// POST req para uso de la API
//TODO porque false o true?
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//log req a la consola
app.use(morgan('dev'));

// iniciar passport
app.use(passport.initialize());

// COnectar DB
mongoose.connect(config.database);

// Estrategia passport
require('./config/passport')(passport);

//Rutas de la api
var apiRoutes = express.Router();

app.get('/', function(req, res){
  res.json({welcome: "Bienvenido al API Energía. Encontrara las rutas en /api/<ruta>"});
});

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

apiRoutes.get('/users', passport.authenticate('jwt', {session: false}), function(req, res){
  User.find(function(err, users){
    if(err)
      res.send(err);

    res.json(users);
  });
});

apiRoutes.route('/users/:user_id')

  .get(passport.authenticate('jwt', {session: false}), function(req, res){
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })

  .put(function(req, res){

    User.findById(req.params.user_id, function(err, user){
      if(err)
        res.send(err);

      user.email = req.body.email;

      user.save(function(err){
        if (err)
          res.send(err);

        res.json({ message: 'Datos de usuario actualizados!'});
      });
    });
  })

  .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Usuario borrado.' });
        });
    });

app.use('/api', apiRoutes);

app.listen(port, function(){
  console.log("Escuchando en el puerto 3001!");
});
