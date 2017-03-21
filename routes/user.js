import express from 'express';
let passport = require('passport');
require('../config/passport')(passport);
let mongoose = require('mongoose');
let User = require('../app/models/user');

let apiRoutes = express.Router();
let user = 'rorritow';

apiRoutes.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  User.find((err, users) => {
    if(err)
      res.send(err);

    res.json(users);
  });
});

apiRoutes.route('/:user_id')

  .get(passport.authenticate('jwt', {session: false}), (req, res) => {
        User.findById(req.params.user_id, (err, user) => {
            if (err)
                res.send(err);
            res.json(user);
        });
    })

  .put((err, user) => {

    User.findById(req.params.user_id, (err, user) => {
      if(err)
        res.send(err);

      user.email = req.body.email;

      user.save((err) => {
        if (err)
          res.send(err);

        res.json({ message: 'Datos de usuario actualizados!'});
      });
    });
  })

  .delete((err, user) =>  {
        User.remove({
            _id: req.params.user_id
        }, (err, user) =>  {
            if (err)
                res.send(err);

            res.json({ message: 'Usuario borrado.' });
        });
    });

export default apiRoutes;
