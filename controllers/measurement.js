import express from 'express';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';
import Measurement from '../models/measurement';

class MeasurementController {
  //get
  getAllMsm(req, res) {
    Measurement.find({})
      .then( measurements => {
        return res.status(200).json(measurements)
      })
      .catch( err => {
        return res.status(500).json({ message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
      })
  }
  //get
  getByIdMsm(req, res) {
    Measurement.findById({_id: req.params.idMeasurement})
      .then( measurement => {
        return res.status(200).json(measurement)
      })
      .catch( err => {
        return res.status(500).json({ message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
      })
  }
  //post
  createMsm(req, res) {
    if (validator.isEmail(req.body.email+'')) {
      if(!req.body.email || !req.body.password) {
        res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
      }
      else {
        Measurement.create({
          //required
          idDevice: req.body.name,
          //not required
          voltage: req.body.voltage,
          intensity: req.body.intensity
          })
          .then( measurement => {
            return res.status(201).json({ message: 'Medición registrada con éxito.', measurement: measurement });
          })
          .catch( err => {
            return res.status(422).json({ message: 'La medición no se ha registrado.' });
          })
      }
    }
    else{
      res.status(422).json({ message: 'Por favor ingrese email válido.' });
    }
  }
  //put
  updateMsm(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
    }
    else {
      Measurement.findById({_id: req.params.idMeasurement})
      .then( measurement => {
        measurement.idDevice = req.params.idDevice;
        measurement.intensity = req.body.intensity;
        measurement.voltage = req.body.voltage;

        measurement.save((err) => {
          if (err)
            res.send(err);
        })
        //revisar 200
        return res.status(200).json('Dispositivo actualizado con éxito: ' + measurement )
      })
      .catch( err => {
        return res.status(500).json({ message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
      })
    }
  }

  deleteMsm(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
    }
    else {
      Measurement.findByIdAndRemove({_id: req.params.idMeasurement})
        .then( measurement => {
          if (measurement==null) {
            //rev 400
            return res.status(400).json('Medición no encontrada.')
          }
          else {
            //revisar 200
            return res.status(200).json('Medición eliminada:' + measurement)
          }

        })

        .catch( err => {
          return res.status(500).json({ message: 'No existe medición. Lo sentimos, Hubo un problema en responder tu solicitud.' });
        })
      }
    }

}

export default MeasurementController
