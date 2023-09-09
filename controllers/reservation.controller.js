'use strict';
import { pool } from "../config/db.js";
import { checkIsManagerUrl } from "../utils.js/function.js";
import { deleteQuery, getSelectQuery, insertQuery, selectQuerySimple, updateQuery } from "../utils.js/query-util.js";
import { checkDns, checkLevel, isItemBrandIdSameDnsId, response, settingFiles } from "../utils.js/util.js";
import 'dotenv/config';

const table_name = 'reservations';

const reservationCtrl = {
    list: async (req, res, next) => {
        try {
            let is_manager = await checkIsManagerUrl(req);
            const decode_user = checkLevel(req.cookies.token, 0);
            
            const { is_mine, date } = req.query;
            console.log(req.query)
            let columns = [
                `${table_name}.*`,
                `users.user_name`,
                `users.nickname`,
                `shops.name AS shop_name`,
            ]
            let sql = `SELECT ${process.env.SELECT_COLUMN_SECRET} FROM ${table_name} `;
            sql += ` LEFT JOIN users ON ${table_name}.user_id=users.id `;
            sql += ` LEFT JOIN shops ON ${table_name}.shop_id=shops.id `;
            sql += ` WHERE 1=1 `
            if(decode_user.level < 40){
                sql += ` AND ${table_name}.user_id=${decode_user.id} `;
            }
            if(date){
                sql += ` AND ${table_name}.date=${date} `;
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
            let {
                date,
                time,
                user_name,
                shop_id,
                note,
            } = req.body;
            console.log(req.body)
            date = date.replaceAll('-','')
            
            let user = await pool.query(`SELECT * FROM users WHERE user_name=? `,[user_name]);
            user = user?.result[0];
            if(!user){
                return response(req, res, -100, "유저가 존재하지 않습니다.", false)
            }

            let is_exist_reservation = await pool.query(`SELECT * FROM ${table_name} WHERE date=? AND time=? AND shop_id=${shop_id}`,[date, time]);
            if(is_exist_reservation?.result.length > 0){
                return response(req, res, -100, "이미 예약된 시간입니다.", false)
            }
            let files = settingFiles(req.files);
            let obj = {
                date,
                time,
                shop_id,
                user_id: user?.id,
                note
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
            
            let {
                date,
                time,
                user_name,
                shop_id,
                note,
                id
            } = req.body;
            date = date.replaceAll('-','')
            if(is_manager){

            }
            let user = await pool.query(`SELECT * FROM users WHERE user_name=? `,[user_name]);
            user = user?.result[0];
            if(!user){
                return response(req, res, -100, "유저가 존재하지 않습니다.", false)
            }
            let is_exist_reservation = await pool.query(`SELECt * FROM ${table_name} WHERE date=? AND time=? AND user_id!=${user?.id} AND is_delete=0 `,[date, time]);
            if(is_exist_reservation?.result.length > 0){
                return response(req, res, -100, "이미 예약된 시간입니다.", false)
            }
            let files = settingFiles(req.files);
            let obj = {
                date,
                time,
                shop_id,
                user_id: user?.id,
                note
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
            if(decode_user.level < 40){
                if(data?.user_id != id){
                    return lowLevelException(req, res);
                }
            }
            const { id } = req.params;
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

export default reservationCtrl;
