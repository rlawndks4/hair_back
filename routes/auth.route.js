import express from 'express';
import validate from 'express-validation';
import { authCtrl } from '../controllers/index.js';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')
    .get(authCtrl.checkSign);//접속한 유저정보 출력
router
    .route('/sign-in')
    .post(authCtrl.signIn);//로그인
router
    .route('/sign-up')
    .post(authCtrl.signUp);//회원가입
router
    .route('/sign-out')
    .post(authCtrl.signOut);//로그아웃
router
    .route('/update')
    .post(authCtrl.updateMyInfo);//마이페이지수정

export default router;
