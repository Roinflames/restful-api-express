import express from 'express'
import bodyParser from 'body-parser'
import logger from 'morgan'
import mongoose from 'mongoose'
import passport from 'passport'
import { mongo } from './config/config'
import routesBinder from './libs/Route'
const app = express()

const database  = process.env.MONGO_URL || mongo.uri

mongoose.Promise = global.Promise; //mongoose uso de promesas es6
mongoose.connect(database);

//Middlewares

  //bodyParser json y form
app.use(logger('dev'))
app.use(passport.initialize())
require('./config/passport')(passport);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api', (req,res) => {
  res.send('NeoSolar API REST');
})

routesBinder(app)

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'El Recurso no existe'
  });
})

export default app;
