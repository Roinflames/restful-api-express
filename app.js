import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import config from './config/main';
import User from './app/models/user';
import users from './routes/user';
import auth from './routes/auth';

let app = express();

let port = process.env.PORT || 3001;

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

app.use('/api', apiRoutes);
apiRoutes.use('/user', users);
apiRoutes.use('/auth', auth);

app.get('/', (req, res) => {
  res.json({welcome: "Bienvenido al API Energía. Encontrara las rutas en /api/<ruta>. ruta: /auth/signup /auth/signin /user"});
});

app.listen(port, () => {
  console.log("Escuchando en el puerto", port);
});
