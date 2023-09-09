import express from 'express';
import { uploadCtrl } from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/single')
    .post(uploadCtrl.single)
router
    .route('/multiple')
    .post(uploadCtrl.muiltiple)
    
export default router;
