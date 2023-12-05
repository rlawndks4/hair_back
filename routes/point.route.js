import express from 'express';
import validate from 'express-validation';
import { pointCtrl } from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')
    .get(pointCtrl.list)//포인트 목록출력
    .post(pointCtrl.create)//포인트 추가
router
    .route('/:id')
    .get(pointCtrl.get)//포인트 단일출력
    .put(pointCtrl.update)//포인트 수정
    .delete(pointCtrl.remove)//포인트 삭제


export default router;
