var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('./config/main');
var User = require('./app/models/user');
import users from './routes/user';
import register from './routes/register';
import auth from './routes/authenticate';

var port = process.env.PORT || 3001;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// POST req para uso de la API
//TODO porque false o true?
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//log req a la consola
app.use(morgan('dev'));

// iniciar passport
app.use(passport.initialize());
// Estrategia passport
require('./config/passport')(passport);

// COnectar DB
mongoose.connect(config.url);

//Rutas de la api
var apiRoutes = express.Router();
/*
app.get('/', function(req, res){
  res.json({welcome: "Bienvenido al API Energía. Encontrara las rutas en /api/<ruta>"});
});
*/
apiRoutes.use('/user', users);
apiRoutes.use('/register', register);
apiRoutes.use('/auth', auth);

 app.get('/', (req, res) => {
  res.json({welcome: "Bienvenido al API Energía. Encontrara las rutas en /api/<ruta>"});
 });

app.get('/api', (req, res) => {
  res.json({apiInfo: "Rutas disponibles: /register, /authenticate, /dashboard, /users, /users/:user_id. Recuerde utilizar /api"});
});

app.use('/api', apiRoutes);

app.listen(port, function(){
  console.log("Escuchando en el puerto 3001!");
});
