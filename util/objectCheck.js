/**
 * @author: create by eleven
 * @version: v1.0
 * @description:
 * @date:2019/1/15
 **/
/**
 * 数据类型检查工具
 * @type {{isArray: (function(*=)), isObject: (function(*=)), isNull: (function(*=)), isUndefined: (function(*=)), isNumber: (function(*=)), isString: (function(*=)), isBoolean: (function(*=)), isFunction: (function(*=)), getType: (function(*=))}}
 */
let objectCheck = {
    isArray: (object) => {
        return Object.prototype.toString.apply(object) === "[object Array]";
    },
    isObject: (object) => {
        return Object.prototype.toString.apply(object) === "[object Object]";
    },
    isNull: (object) => {
        return Object.prototype.toString.apply(object) === "[object Null]";
    },
    isUndefined: (object) => {
        return Object.prototype.toString.apply(object) === "[object Undefined]";
    },
    isNumber: (object) => {
        return Object.prototype.toString.apply(object) === "[object Number]";
    },
    isString: (object) => {
        return Object.prototype.toString.apply(object) === "[object String]";
    },
    isBoolean: (object) => {
        return Object.prototype.toString.apply(object) === "[object Boolean]";
    },
    isFunction: (object) => {
        return Object.prototype.toString.apply(object) === "[object Function]";
    },
    getType: (object) => {
        let type = Object.prototype.toString.apply(object),
            arr = type.match(/\[object\s([\s\S]*)\]/);
        return arr[1];
    }
};
export default objectCheck;