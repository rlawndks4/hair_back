import express from 'express';
import validate from 'express-validation';
import { shopCtrl } from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')
    .get(shopCtrl.list)//미용실 목록출력
    .post(shopCtrl.create)//미용실 추가
router
    .route('/:id')
    .get(shopCtrl.get)//미용실 단일출력
    .put(shopCtrl.update)//미용실 수정
    .delete(shopCtrl.remove)//미용실 삭제


export default router;
