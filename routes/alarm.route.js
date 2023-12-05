import express from 'express';
import validate from 'express-validation';
import { alarmCtrl } from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')
    .get(alarmCtrl.list)//알림 리스트출력
    .post(alarmCtrl.create)//알림 추가
router
    .route('/:id')
    .get(alarmCtrl.get)//알림 단일출력
    .put(alarmCtrl.update)//알림 수정
    .delete(alarmCtrl.remove)//알림 삭제

export default router;
