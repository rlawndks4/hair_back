'use strict';
import { pool } from "../config/db.js";
import { checkIsManagerUrl } from "../utils.js/function.js";
import { deleteQuery, getSelectQuery, insertQuery, selectQuerySimple, updateQuery } from "../utils.js/query-util.js";
import { checkDns, checkLevel, lowLevelException, response, settingFiles } from "../utils.js/util.js";
import 'dotenv/config';

const table_name = 'points';

const pointCtrl = {
    list: async (req, res, next) => {
        try {
            let is_manager = await checkIsManagerUrl(req);
            const decode_user = checkLevel(req.cookies.token, 0);
            
            const { } = req.query;

            let columns = [
                `${table_name}.*`,
                `users.user_name`,
                `users.nickname`,
                `giver.user_name AS giver_name`
            ]
            let sql = `SELECT ${process.env.SELECT_COLUMN_SECRET} FROM ${table_name} `;
            sql += ` LEFT JOIN users ON ${table_name}.user_id=users.id `;
            sql += ` LEFT JOIN users AS giver ON ${table_name}.giver_id=giver.id `;
            if(decode_user.level < 10){
                sql += ` WHERE ${table_name}.user_id=${decode_user.id} `;
            }
            let data = await getSelectQuery(sql, columns, req.query);

            return response(req, res, 100, "success", data);
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
    get: async (req, res, next) => {
        try {
            let is_manager = await checkIsManagerUrl(req);
            const decode_user = checkLevel(req.cookies.token, 0);
           
            const { id } = req.params;
            let sql = `SELECT ${table_name}.*, users.user_name FROM ${table_name} `;
            sql += ` LEFT JOIN users ON ${table_name}.user_id=users.id `;
            sql += ` WHERE ${table_name}.id=${id} `
            let data = await pool.query(sql);
            data = data?.result[0];
            return response(req, res, 100, "success", data)
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
    create: async (req, res, next) => {
        try {
            let is_manager = await checkIsManagerUrl(req);
            const decode_user = checkLevel(req.cookies.token, 0);
            if(decode_user.level < 10){
                return lowLevelException(req, res);
            }
            let type = undefined;
            if(decode_user.level==10){
                type = 1;
            }else if(decode_user.level==40 || decode_user.level==50){
                type = 0;
            }
            let giver_id = decode_user?.id;
            const {
                user_name="",
                price,
                note
            } = req.body;
            let user = await pool.query(`SELECT * FROM users WHERE user_name=? `,[user_name]);
            user = user?.result[0];
            if(!user){
                return response(req, res, -100, "유저가 존재하지 않습니다.", false)
            }
            let files = settingFiles(req.files);
            let obj = {
                price,
                note,
                type,
                user_id: user?.id,
                giver_id
            };
            obj = { ...obj, ...files };
            let result = await insertQuery(`${table_name}`, obj);

            return response(req, res, 100, "success", {})
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
    update: async (req, res, next) => {
        try {
            let is_manager = await checkIsManagerUrl(req);
            const decode_user = checkLevel(req.cookies.token, 0);
            if(decode_user.level < 10){
                return lowLevelException(req, res);
            }
            let type = undefined;
            if(decode_user.level==10){
                type = 1;
            }else if(decode_user.level==40 || decode_user.level==50){
                type = 0;
            }
            let giver_id = decode_user?.id;
            const {
                user_name="",
                price,
                note,
                id
            } = req.body;
            let user = await pool.query(`SELECT * FROM users WHERE user_name=? `,[user_name]);
            user = user?.result[0];
            if(!user){
                return response(req, res, -100, "유저가 존재하지 않습니다.", false)
            }
            let files = settingFiles(req.files);
            let obj = {
                price,
                note,
                type,
                user_id: user?.id,
                giver_id
            };
            obj = { ...obj, ...files };
            let result = await updateQuery(`${table_name}`, obj, id);

            return response(req, res, 100, "success", {})
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
    remove: async (req, res, next) => {
        try {
            let is_manager = await checkIsManagerUrl(req);
            const decode_user = checkLevel(req.cookies.token, 0);
            
            const { id } = req.params;
            let data = await pool.query(`SELECT * FROM ${table_name} WHERE id=${id}`)
            data = data?.result[0];
            if(decode_user.level < 40){
                if(data?.user_id != id){
                    return lowLevelException(req, res);
                }
            }
            let result = await deleteQuery(`${table_name}`, {
                id
            })
            return response(req, res, 100, "success", {})
        } catch (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", false)
        } finally {

        }
    },
};

export default pointCtrl;
