import express from 'express'
import passport from 'passport'
import DeviceController from '../controllers/device'
import MeasurementController from '../controllers/measurement'

const router = express.Router()
const measurement = new MeasurementController()
const device = new DeviceController()

router.use(passport.authenticate('jwt', {session: false}))

router.get('/', (req, res) => device.getAllDev(req, res));
router.get('/:idDevice', (req, res) => device.getByIdDev(req, res));
router.post('/', (req, res) => device.createDev(req, res));
router.put('/:idDevice', (req, res) => device.updateDev(req, res));
router.delete('/:idDevice', (req, res) => device.deleteDev(req, res));

router.get('/:idDevice/measurement/', (req, res) => measurement.getAllMsm(req, res));
router.get('/:idDevice/measurement/:idMeasurement', (req, res) => measurement.getByIdMsm(req, res));
router.post('/:idDevice/measurement/', (req, res) => measurement.createMsm(req, res));
router.put('/:idDevice/measurement/:idMeasurement', (req, res) => measurement.updateMsm(req, res));
router.delete('/:idDevice/measurement/:idMeasurement', (req, res) => measurement.deleteMsm(req, res));

export default router;
