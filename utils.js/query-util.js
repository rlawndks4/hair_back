import { pool } from '../config/db.js';
import 'dotenv/config';
import when from 'when';

export const insertQuery = async (table, obj) => {
    let keys = Object.keys(obj);
    if (keys.length == 0) {
        return false;
    }
    let question_list = keys.map(key => {
        return '?'
    });
    let values = keys.map(key => {
        return obj[key]
    });
    let result = await pool.query(`INSERT INTO ${table} (${keys.join()}) VALUES (${question_list.join()})`, values);
    return result;
}
export const insertQueryMultiRow = async (table, list) => {// 개발예정
    let keys = Object.keys(obj);
    if (keys.length == 0) {
        return false;
    }
    let question_list = keys.map(item => {
        return '?'
    });
    let values = keys.map(key => {
        return obj[key]
    });
    let result = await pool.query(`INSERT INTO ${table} (${keys.join()}) VALUES (${question_list.join()})`, values);
    return result;
}
export const deleteQuery = async (table, where_obj) => {
    let keys = Object.keys(where_obj);
    let where_list = [];
    for (var i = 0; i < keys.length; i++) {
        where_list.push(` ${keys[i]}=${where_obj[keys[i]]} `);
    }
    let result = await pool.query(`UPDATE ${table} SET is_delete=1 WHERE ${where_list.join('AND')} `);
    return result;
}
export const updateQuery = async (table, obj, id) => {
    let keys = Object.keys(obj);
    if (keys.length == 0) {
        return false;
    }
    let question_list = keys.map(key => {
        return `${key}=?`
    });
    let values = keys.map(key => {
        return obj[key]
    });
    let result = await pool.query(`UPDATE ${table} SET ${question_list.join()} WHERE id=${id}`, values);
    return result;
}
export const selectQuerySimple = async (table, id) => {
    let result = await pool.query(`SELECT * FROM ${table} WHERE id=${id}`);
    return result;
}
export const getTableNameBySelectQuery = (sql) => {// select query 가지고 불러올 메인 table명 불러오기 select * from user as asd
    let sql_split_list = sql.split(' FROM ')[1].split(' ');
    let table = '';
    for (var i = 0; i < sql_split_list.length; i++) {
        if (sql_split_list[i]) {
            table = sql_split_list[i];
            break;
        }
    }
    return table;
}
export const getSelectQuery = async (sql_, columns, query, add_sql_list = []) => {
    const { page = 1, page_size = 100000, is_asc = false, order = 'id' } = query;
    let sql = sql_;
    let table = getTableNameBySelectQuery(sql);

    sql = settingSelectQueryWhere(sql, query, table);
    for (var i = 0; i < add_sql_list.length; i++) {
        add_sql_list[i].sql = settingSelectQueryWhere(add_sql_list[i].sql, query, table);
    }
    let content_sql = sql.replaceAll(process.env.SELECT_COLUMN_SECRET, columns.join());
    content_sql += ` ORDER BY ${table}.${order} ${is_asc ? 'ASC' : 'DESC'} `;
    content_sql += ` LIMIT ${(page - 1) * page_size}, ${page_size} `;
    let total_sql = sql.replaceAll(process.env.SELECT_COLUMN_SECRET, 'COUNT(*) as total');

    let result_list = [];
    let sql_list = [
        { table: 'total', sql: total_sql },
        { table: 'content', sql: content_sql },
        ...add_sql_list
    ]

    for (var i = 0; i < sql_list.length; i++) {
        result_list.push({
            table: sql_list[i].table,
            content: (await pool.query(sql_list[i].sql))
        });
    }

    for (var i = 0; i < result_list.length; i++) {
        await result_list[i];
    }
    let result = (await when(result_list));
    let obj = {
        page,
        page_size,
    }
    for (var i = 0; i < result.length; i++) {
        obj[result[i].table] = result[i]?.content?.result
    }
    return settingSelectQueryObj(obj);
}
const settingSelectQueryWhere = (sql_, query, table) => {
    let sql = sql_;
    const { s_dt, e_dt, search } = query;
    sql += ` ${sql.includes('WHERE') ? 'AND' : 'WHERE'} ${table}.is_delete=0 `;
    if (s_dt) {
        sql += ` AND ${table}.created_at >= '${s_dt} 00:00:00' `;
    }
    if (e_dt) {
        sql += ` AND ${table}.created_at <= '${e_dt} 23:59:59' `;
    }
    if (search) {

    }
    return sql;
}
const settingSelectQueryObj = (obj_) => {
    let obj = obj_;
    if (obj?.total) {
        obj['total'] = obj?.total[0]?.total ?? 0
    }
    return obj;
}
export const getMultipleQueryByWhen = async (sql_list) => {
    let result_list = [];
    for (var i = 0; i < sql_list.length; i++) {
        result_list.push({
            table: sql_list[i].table,
            content: (await pool.query(sql_list[i].sql))
        });
    }
    for (var i = 0; i < result_list.length; i++) {
        await result_list[i];
    }
    let result = (await when(result_list));
    let data = {};
    for (var i = 0; i < result.length; i++) {
        data[result[i].table] = result[i]?.content?.result
    }
    return data;
}