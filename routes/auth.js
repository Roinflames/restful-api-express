import express from 'express';
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let User = require('../app/models/user');
let config = require('../config/main');

let apiRoutes = express.Router();

apiRoutes.get('/', (req, res) => {
  res.render('authentication');
});

// ruta de registro de usuario para recibir jwt
apiRoutes.post('/signin', (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) throw (err);

    if(!user) {
      res.send({ success: false, message: 'Fallo en la autenticación. Usuario no registrado.'});
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          var token = jwt.sign(user, config.secret, {
            expiresIn: 10000 //segundos
          });
          res.json({ success: true, token: 'JWT '+ token, user: user.email});
        } else {
          res.send({ success: false, message: 'Fallo en la autenticación. La clave no coincide.'});
        }
      });
    }
  });
});

apiRoutes.post('/signup',  (req,res) => {
  if(!req.body.email || !req.body.password) {
    res.json({ success: false, message: 'Porfavor ingrese email y contraseña.'});
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password
    });
  //guardar usuario
  newUser.save( (err) => {
    if (err) {
      return res.json({success: false, message: 'El correo ya existe'});
    }
    res.json({ success: true, message: 'Usuario registrado con éxito.'});
  });
  }
});

apiRoutes.post('/signout', (req, res) => {
  res.json({state: 'signout'});
});

export default apiRoutes;
