import express from 'express'
import passport from 'passport'
import AccuController from '../controllers/accu'

const router = express.Router()
const accu = new AccuController();

//Primero se verifica el token por passport y se pasa el usuario encontrado al middleware de Autorizacion de Roles
router.use(passport.authenticate('jwt', {session: false}));
//router.use(AuthorizationRole)

router.post('/', (req, res) => accu.getInfo(req, res));

export default router;
