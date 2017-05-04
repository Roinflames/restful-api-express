import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowecase: true,
    unique: true,
    required:true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Client', 'Manager', 'Admin'],
    default: 'Client',
  },
  google:{
    type: Object,
  },
},{ timestamps: true });

//Quita los atributos de las consultas

UserSchema.method('toJSON', function() {
  let user = this.toObject();
  delete user.salt;
  delete user.hash;
  delete user.__v;
  delete user.password;
  return user;
});

// Guardar pwd encriptado en la BD

UserSchema.pre('save', function(next){
  var user = this;
  if (this.isModified('password') || this.isNew){
    bcrypt.genSalt(10, function(err, salt){
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err,hash){
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});


// comparacion del pwd

UserSchema.methods.comparePassword = function(pw, cb){
  bcrypt.compare(pw, this.password, function(err, isMatch){
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

export default mongoose.model('User', UserSchema)
