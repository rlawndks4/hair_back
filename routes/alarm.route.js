import express from 'express';
import validate from 'express-validation';
import { alarmCtrl } from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')
    .get(alarmCtrl.list)
    .post(alarmCtrl.create)
router
    .route('/:id')
    .get(alarmCtrl.get)
    .put(alarmCtrl.update)
    .delete(alarmCtrl.remove)

export default router;
