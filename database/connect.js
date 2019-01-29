/**
 * @author: create by eleven
 * @version: v1.0
 * @description:
 * @date:2019/1/28
 **/
import mysql from 'mysql';
import dbConfig from "./config";
var connection = mysql.createConnection(dbConfig);
connection.connect();

let dbManage={
    queryUsers:(params,callback)=>{
        let conditions=[], queryStr='select * from users';
        for(let key in params){
            conditions.push(key+"="+params[key]);
        }
        conditions.length&&(queryStr+=' where '+conditions.join(" and "));
        connection.query(queryStr, function (err, results, fields) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            console.log('The nickName is: ', results[0].nickName);
            callback&&callback(results,fields);
        });
    },
    addUser:(params,callback)=>{
        let keys=[],
            values=[],
            placeholder=[],
            sqlStr;
        for(let key in params){
            keys.push(key);
            values.push(params[key]);
            placeholder.push("?");
        };
        sqlStr="insert into users("+keys.join(",")+") values ("+placeholder.join(",")+")";
        connection.query(sqlStr, values, function (err, results, fields) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            callback&&callback(results,fields);
        });
    }
};
export default dbManage;