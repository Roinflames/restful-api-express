import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const MeasurementSchema = new mongoose.Schema({
  idDevice: {
    type: String,
    required:true,
  },
  intensity: {
    type:  String,
  },
  voltage: {
    type: String,
  }
},{ timestamps: true });

//Quita los atributos de las consultas

MeasurementSchema.method('toJSON', function() {
  let measurement = this.toObject();
  delete measurement.salt;
  delete measurement.hash;
  delete measurement.__v;
  return measurement;
});

export default mongoose.model('Measurement', MeasurementSchema)
