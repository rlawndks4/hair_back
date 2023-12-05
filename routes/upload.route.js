import express from 'express';
import { uploadCtrl } from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/single')
    .post(uploadCtrl.single)//파일업로드 단일
router
    .route('/multiple')
    .post(uploadCtrl.muiltiple)//파일업로드 복수

export default router;
