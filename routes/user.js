import express from 'express';
var passport = require('passport');
require('../config/passport')(passport);

let apiRoutes = express.Router();
let user = 'rorritow';

apiRoutes.get('/', (req, res) => {
  res.json({ user: user });
});

apiRoutes.get('/device', (req,res) => {
  res.send({id: '1', equipo: 'raspi', sensores: ['1', '2', '3']});
});

apiRoutes.get('/users', passport.authenticate('jwt', {session: false}), function(req, res){
  User.find(function(err, users){
    if(err)
      res.send(err);

    res.json(users);
  });
});

apiRoutes.route('/users/:user_id')

  .get(passport.authenticate('jwt', {session: false}), (req, res) => {
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

export default apiRoutes;
