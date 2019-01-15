/**
 * @author: create by eleven
 * @version: v1.0
 * @description:
 * @date:2019/1/15
 **/
import objectCheck from "./objectCheck";

/**
 * 对外暴露API返回数据，统一结构
 * @param actionType {String} 操作类型
 * @param success {Boolean} 操作是否成功
 * @param message {String} 操作结果说明
 * @param addition {Object} 除success/message外其他附加数据
 * @returns {{success: boolean, message: string}}
 */
let createApiResult=(actionType="",success=true,message="操作成功",addition={})=>{
    if(!objectCheck.isBoolean(success)||!objectCheck.isString(message)) {
        success = false;
        message = "参数错误，请检测接口调用处参数传递。";
    }
    return {
        success,
        message,
        ...addition
    }
};
export {createApiResult};