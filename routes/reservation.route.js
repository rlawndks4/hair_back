import express from 'express';
import validate from 'express-validation';
import { reservationCtrl } from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')
    .get(reservationCtrl.list)//예약 목록출력
    .post(reservationCtrl.create)//예약 추가
router
    .route('/:id')
    .get(reservationCtrl.get)//예약 단일출력
    .put(reservationCtrl.update)//예약 수정
    .delete(reservationCtrl.remove)//예약 삭제


export default router;
