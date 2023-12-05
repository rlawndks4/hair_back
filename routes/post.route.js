import express from 'express';
import validate from 'express-validation';
import { postCtrl } from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')
    .get(postCtrl.list)//게시물 목록출력
    .post(postCtrl.create)//게시물 추가
router
    .route('/:id')
    .get(postCtrl.get)//게시물 단일출력
    .put(postCtrl.update)//게시물 수정
    .delete(postCtrl.remove)//게시물 삭제


export default router;
