import express from 'express';
import validate from 'express-validation';
import { reservationCtrl } from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')
    .get(reservationCtrl.list)
    .post(reservationCtrl.create)
router
    .route('/:id')
    .get(reservationCtrl.get)
    .put(reservationCtrl.update)
    .delete(reservationCtrl.remove)


export default router;
