import express from 'express'
import passport from 'passport'
import UserController from '../controllers/user'

const router = express.Router()
const user = new UserController();

//Middleware comprobacion de Rol usuario
const AuthorizationRole = (req, res, next) => {
  //console.log(req.user.role);
  next();
}

//Primero se verifica el token por passport y se pasa el usuario encontrado al middleware de Autorizacion de Roles
router.use(passport.authenticate('jwt', {session: false}));
router.use(AuthorizationRole)

router.get('/', (req, res) => user.getAll(req, res));
router.get('/:idUser', (req, res) => user.getById(req, res));
router.post('/', (req, res) => user.create(req, res));
router.put('/:idUser', (req, res) => user.update(req, res));
router.delete('/:idUser', (req, res) => user.delete(req, res));

router.get('/:idUser/device', (req, res) => user.getAllDev(req, res));
router.get('/:idUser/device/:idDevice', (req, res) => user.getByIdDev(req, res));
router.post('/:idUser/device', (req, res) => user.createDev(req, res));
router.put('/:idUser/device/:idDevice', (req, res) => user.updateDev(req, res));
router.delete('/:idUser/device/:idDevice', (req, res) => user.deleteDev(req, res));

export default router;
