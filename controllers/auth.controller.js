'use strict';
import axios from "axios";
import { pool } from "../config/db.js";
import { checkIsManagerUrl, returnMoment } from "../utils.js/function.js";
import { insertQuery, updateQuery } from "../utils.js/query-util.js";
import { createHashedPassword, checkLevel, makeUserToken, response, checkDns, lowLevelException, settingFiles } from "../utils.js/util.js";
import 'dotenv/config';

const authCtrl = {
    signIn: async (req, res, next) => {
        try {
            let is_manager = await checkIsManagerUrl(req);
            const decode_user = checkLevel(req.cookies.token, 0);

            let { user_name, user_pw } = req.body;

            let user = await pool.query(`SELECT * FROM users WHERE user_name=? AND is_delete=0 LIMIT 1`, user_name);
            user = user?.result[0];
            if (!user) {
                return response(req, res, -100, "가입되지 않은 회원입니다.", {})
            }
            if (is_manager && user.level < 10) {
                return response(req, res, -100, "가입되지 않은 회원입니다.", {})
            }
            if (user?.status == 1) {
                return response(req, res, -100, "승인 대기중입니다.", {})
            }
            if (user?.status == 2) {
                return response(req, res, -100, "로그인 불가 회원입니다.", {})
            }
            user_pw = (await createHashedPassword(user_pw, user.user_salt)).hashedPassword;
            if (user_pw != user.user_pw) {
                return response(req, res, -100, "가입되지 않은 회원입니다.", {})
            }
            const token = makeUserToken({
                id: user.id,
                user_name: user.user_name,
                nickname: user.nickname,
                level: user.level,
                phone_num: user.phone_num,
                profile_img: user.profile_img,
            })
            await res.cookie("token", token, {
                httpOnly: true,
                maxAge: (60 * 60 * 1000) * 3,
                //sameSite: 'none', 
                //secure: true 
            });
            let check_last_login_time = await updateQuery('users', {
                last_login_time: returnMoment()
            }, user.id)

            return response(req, res, 100, "success", user)
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
    signUp: async (req, res, next) => {
        try {
            let is_manager = await checkIsManagerUrl(req);
            const decode_user = checkLevel(req.cookies.token, 0);
            let {
                user_name,
                user_pw,
                nickname,
                level = 0,
                phone_num,
                profile_img,
            } = req.body;
            if (!user_pw) {
                return response(req, res, -100, "비밀번호를 입력해 주세요.", {});
            }
            let is_exist_user = await pool.query(`SELECT * FROM users WHERE user_name=? `, [user_name]);
            if (is_exist_user?.result.length > 0) {
                return response(req, res, -100, "유저아이디가 이미 존재합니다.", false)
            }
            let is_user_student = await axios.post('https://univcert.com/api/v1/certify', {
                key: '4e5978db-a6d4-4b7f-ae95-6b12d10a5ca5',
                email: user_name,
                univName: '서울과학기술대학교',
                univ_check: true,
            });
            if(!is_user_student?.data?.success){
                return response(req, res, -100, "학교인증중 에러", {})
            }
            console.log(is_user_student?.data);
            return;
            let pw_data = await createHashedPassword(user_pw);
            if (!is_manager) {
                if (level > 0) {
                    return lowLevelException(req, res);
                }
            }
            user_pw = pw_data.hashedPassword;
            let user_salt = pw_data.salt;
            let obj = {
                user_name,
                user_pw,
                nickname,
                level,
                phone_num,
                profile_img,
                user_salt
            }
            let result = await insertQuery('users', obj);
            return response(req, res, 100, "success", {})
        } catch (err) {
            console.log(err?.response?.data?.message)
            return response(req, res, -200, err?.response?.data?.message || err?.message || "서버 에러 발생", false)
        } finally {

        }
    },
    signOut: async (req, res, next) => {
        try {
            let is_manager = await checkIsManagerUrl(req);
            const decode_user = checkLevel(req.cookies.token, 0);

            res.clearCookie('token');
            return response(req, res, 100, "success", {})
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
    checkSign: async (req, res, next) => {
        try {
            let is_manager = await checkIsManagerUrl(req);
            const decode_user = checkLevel(req.cookies.token, 0);

            return response(req, res, 100, "success", decode_user)
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
    updateMyInfo: async (req, res, next) => {
        try {
            let is_manager = await checkIsManagerUrl(req);
            const decode_user = checkLevel(req.cookies.token, is_manager ? 1 : 0);
            const {
                nickname, phone_num, profile_img
            } = req.body;
            let files = settingFiles(req.files);
            let obj = {
                nickname, phone_num, profile_img
            };
            obj = { ...obj, ...files };
            let result = await updateQuery(`users`, obj, decode_user?.id);
            await res.clearCookie('token');
            let user = await pool.query(`SELECT * FROM users WHERE id=? `, [decode_user?.id]);
            user = user?.result[0];
            const token = makeUserToken({
                id: user.id,
                user_name: user.user_name,
                nickname: user.nickname,
                level: user.level,
                phone_num: user.phone_num,
                profile_img: user.profile_img,
            })
            await res.cookie("token", token, {
                httpOnly: true,
                maxAge: (60 * 60 * 1000) * 3,
                //sameSite: 'none', 
                //secure: true 
            });
            console.log(123)
            return response(req, res, 100, "success", {})
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
};

export default authCtrl;