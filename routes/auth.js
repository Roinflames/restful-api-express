import express from 'express'
import passport from 'passport'
import AuthController from '../controllers/auth'

const router = express.Router()
const auth = new AuthController();

router.get('/', (req, res) => res.send("get auth"));
router.post('/signin', (req, res) => auth.signin(req, res));
router.post('/signup', (req, res) => auth.signup(req, res));
router.post('/device/', (req, res) => auth.deviceSignin(req, res));
router.get('/signout', (req, res) => auth.signout(req, res));
router.post('/existEmail', (req, res) => auth.existEmail(req, res))

//Social Login Google API
router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.get('/google/close', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => { auth.google(req,res)  }
);

//Social Login Google Native
router.post('/googlenative', (req, res) => auth.googleNative(req, res));

export default router;
