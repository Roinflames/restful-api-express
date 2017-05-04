import express from 'express';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';
import User from '../models/user';
import Device from '../models/device';

class UserController {

  //get
  getAll(req, res) {
    User.find({})
      .then( users => {
        return res.status(200).json(users)
      })
      .catch( err => {
        return res.status(500).json({ message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
      })
  }
  //get
  getById(req, res) {
    User.findById({_id: req.params.idUser})
      .then( user => {
        return res.status(200).json(user)
      })
      .catch( err => {
        return res.status(500).json({ message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
      })
  }
  //post
  create(req, res) {
    if (validator.isEmail(req.body.email+'')) {
      if(!req.body.email || !req.body.password) {
        res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
      }
      else{
        User.create({
          email: req.body.email,
          password: req.body.password })
          .then( user => {
            return res.status(201).json({ message: 'Usuario registrado con éxito.', user: user });
          })
          .catch( err => {
            return res.status(422).json({ message: 'El correo ya está siendo utilizado.' });
          })
      }
    }
    else{
      res.status(422).json({ message: 'Por favor ingrese email válido.' });
    }
  }
  //put
  update(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
    }
    else {
      User.findById({_id: req.params.idUser})
      .then( user => {
        user.email = req.body.email;
        user.password = req.body.password;

        user.save((err) => {
          if (err)
            res.send(err);
        })
        return res.status(200).json('Usuario actualizado con éxito' + user )
      })
      .catch( err => {
        return res.status(500).json({  message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
      })
    }
  }
  //delete
  delete(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
    }
    else {
      User.findByIdAndRemove({_id: req.params.idUser})
        .then( user => {
          if (user==null) {
            return res.status(400).json('Usuario no encontrado.')
          }
          else {
            return res.status(200).json('Usuario eliminado: ' + user)
          }

        })

        .catch( err => {
          return res.status(500).json({ message: 'No existe usuario. Lo sentimos, Hubo un problema en responder tu solicitud.' });
        })
      }
    }
/*
  getAllDev(req, res) {
    //'id' : mail
    Device.find({ idUser: req.params.idUser })
      .then( devices => {
        return res.json(devices)
      })
      .catch( err => {
        return res.status(500).json({
          success: false,
          message: 'Lo sentimos, Hubo un problema en responder tu solicitud.',
        });
      })
  }
  */
  getAllDev(req, res) {
    Device.find({user: req.user})
      .then( devices => {
        User.populate(devices, {path: "user"})
          res.status(200).json(devices)
      })
      .catch( err => {
        return res.status(500).json({  message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
      })
  }

  getByIdDev(req, res) {
    Device.findById({_id: req.params.idDevice})
      .then( device => {
        return res.status(200).json(device)
      })
      .catch( err => {
        return res.status(500).json({ message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
      })
  }

  createDev(req, res) {
    if (validator.isEmail(req.body.email+'')) {
      if(!req.body.email || !req.body.password) {
        res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
      }
      else{
          Device.create({
          idUser: req.params.idUser,
          name : req.body.name,
          })
          .then( device => {
            return res.status(201).json({  message: 'Dispositivo registrado con éxito.', device: device });
          })
          .catch( err => {
            console.log(err);
            return res.status(422).json({  message: 'Dispositivo no se ha registrado con éxito.' });
          })
      }
    }
    else{
      res.status(422).json({ message: 'Por favor ingrese email válido.' });
    }
  }

  updateDev(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
    }
    else {
      Device.findById({_id: req.params.idDevice})
      .then( device => {
        device.email = req.body.email;
        device.password = req.body.password;

        device.save((err) => {
          if (err)
            res.send(err);
        })
        return res.status(200).json('Dispositivo actualizado con éxito: ' + device )
      })
      .catch( err => {
        return res.status(500).json({ message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
      })
    }
  }

  deleteDev(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
    }
    else {
      Device.findByIdAndRemove({_id: req.params.idDevice})
        .then( device => {
          if (device==null) {
            return res.status(400).json('Dispositivo no encontrado.')
          }
          else {
            return res.status(200).json('Dispositivo eliminado: ' + device.idUser + ', ' + device.name)
          }
        })

        .catch( err => {
          return res.status(500).json({  message: 'No existe dispositivo. Lo sentimos, Hubo un problema en responder tu solicitud.' });
        })
      }
    }
}

export default UserController
