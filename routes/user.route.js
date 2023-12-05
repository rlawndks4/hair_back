import express from 'express';
import validate from 'express-validation';
import { userCtrl } from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')
    .get(userCtrl.list)//회원 목록출력
    .post(userCtrl.create)//회원 추가
router
    .route('/:id')
    .get(userCtrl.get)//회원 단일출력
    .put(userCtrl.update)//회원 수정
    .delete(userCtrl.remove)//회원 삭제
router
    .route('/change-pw/:id')
    .put(userCtrl.changePassword)//회원 비밀번호변경
router
    .route('/change-status/:id')
    .put(userCtrl.changeStatus)//회원 상태변경 

export default router;
