import express from 'express';
import validate from 'express-validation';
import { shopCtrl } from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')
    .get(shopCtrl.list)
    .post(shopCtrl.create)
router
    .route('/:id')
    .get(shopCtrl.get)
    .put(shopCtrl.update)
    .delete(shopCtrl.remove)


export default router;
