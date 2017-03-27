import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import User from '../app/models/user';
import config from '../config/main';

let apiRoutes = express.Router();

// ruta de registro de usuario para recibir jwt
apiRoutes.post('/signin', (req, res) => {
  console.log(req.body.email);
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    //console.log(user);
    if (err) throw (err);

    if(!user) {
      res.send({ success: false, message: 'Fallo en la autenticación. Usuario no registrado.'});
    } else {
      console.log("req.body.password");
      console.log(req.body.password);
      //**********************************
      //aqui ek error
      user.comparePassword(req.body.password, (err, isMatch) => {
        console.log(req.body.password);
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
