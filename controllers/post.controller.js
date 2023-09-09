'use strict';
import { pool } from "../config/db.js";
import { checkIsManagerUrl } from "../utils.js/function.js";
import { deleteQuery, getSelectQuery, insertQuery, selectQuerySimple, updateQuery } from "../utils.js/query-util.js";
import { checkDns, checkLevel, response, settingFiles } from "../utils.js/util.js";
import 'dotenv/config';

const table_name = 'posts';
const post_category_list = [
    '후기',
    '공지사항',
    '업장정보소개'
]
const postCtrl = {
    list: async (req, res, next) => {
        try {
            let is_manager = await checkIsManagerUrl(req);
            const decode_user = checkLevel(req.cookies.token, 0);
            const { type, is_mine, shop_id } = req.query;
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
            if(type){
                sql += ` AND ${table_name}.type=${type} `;
            }
            if(is_mine){
                sql += ` AND ${table_name}.user_id=${decode_user?.id} `;
            }
            if(shop_id){
                sql += ` AND ${table_name}.shop_id=${shop_id} `;
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
            let data = await pool.query(`SELECT * FROM ${table_name} WHERE id=${id}`)
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
            const {
                title,
                note,
                shop_id,
                type='0',
            } = req.body;
            let files = settingFiles(req.files);
            let obj = {
                title,
                note,
                shop_id,
                type,
                user_id: decode_user?.id
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
            
            const {
                title,
                note,
                shop_id,
                type='0',
                id,
            } = req.body;
            let files = settingFiles(req.files);
            let obj = {
                title,
                note,
                shop_id,
                type,
                user_id: decode_user?.id
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

export default postCtrl;
