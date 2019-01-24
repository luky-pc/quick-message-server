/**
 * @author: create by eleven
 * @version: v1.0
 * @description:
 * @date:2019/1/11
 **/
import checkRuleManager from "../checkRuleManage";
import {actionTypes} from "../util/actionTypes";
import {createApiResult,clone} from "../util/commonFunctions";
import User from "./user";

let userList=[new User({id:10,phoneNumber:"18180874439",nickName:"十一",password:"123",online:false})];//临时用户数据存放，后续考虑使用数据库存放
let id=0;
let userManager={
    registerUserByPhoneNumber:(phoneNumber,password,nickName,conn)=>{//通过手机号注册用户,注册成功时，记录当前用户连接
        let actionType=actionTypes.REGISTER_USER,
            newUser,
            validatePhoneNumber = checkRuleManager.checkPhoneNumber(phoneNumber),
            validatePassword = checkRuleManager.checkPassword(password),
            repeated=userList.find((user)=>{return user.phoneNumber===phoneNumber;});
        if(validatePassword.success&&validatePhoneNumber.success&&!repeated){
            newUser=new User({phoneNumber,password,nickName,id:id++,conn,online:true});
            userList.push(newUser);/**TODO:记录用户信息到数据库**/
            return createApiResult(actionType,true,"注册成功",{user:newUser.getUserBasicInfo()});
        }else if(repeated) {
            return createApiResult(actionType,false,"手机号已被注册。");
        }else if(!validatePhoneNumber.success){
            return createApiResult(actionType,false,validatePhoneNumber.message);
        }else{
            return createApiResult(actionType,false,validatePassword.message);
        }
    },
    login:(phoneNumber,password,conn)=>{//登录操作,登录成功时记录当前用户连接
        let actionType = "login",
            user = userManager.findUserByPhoneNumber(phoneNumber);
        if (!user) {
            return createApiResult(actionType, false, "当前用户不存在，请重新输入账号或注册。");
        } else if (user.password !== password) {
            return createApiResult(actionType, false, "用户名或密码错误请重试。");
        } else {
            user.reconnect(conn);
            return createApiResult(actionType, true, "登陆成功。", {user:user.getUserBasicInfo()});
        }
    },
    findUserById:(id)=>{//通过用户id 查找用户，返回用户联系人信息
        return userList.find((user)=>{
            return user.id===id;
        });
    },
    findUserByPhoneNumber:(phoneNumber)=>{//通过手机号查找用户,返回联系人列表
        return userList.find((user)=>{
            return user.phoneNumber===phoneNumber;
        });
    }
};
export default userManager;