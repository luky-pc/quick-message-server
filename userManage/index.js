/**
 * @author: create by eleven
 * @version: v1.0
 * @description:
 * @date:2019/1/11
 **/
import checkRuleManager from "../checkRuleManage";
import {actionTypes} from "../util/actionTypes";
import {createApiResult} from "../util/commonFunctions";

let userList=[];//临时用户数据存放，后续考虑使用数据库存放
let id=0;
let userManager={
    registerUserByPhoneNumber:(phoneNumber,passWord,nickName)=>{
        let actionType=actionTypes.REGISTER_USER,
            newUser={phoneNumber,passWord,nickName,id:id++},
            validatePhoneNumber = checkRuleManager.checkPhoneNumber(phoneNumber),
            validatePassword = checkRuleManager.checkPassword(passWord);
        if(validatePassword.success&&validatePhoneNumber.success){
            userList.push(newUser);/**TODO:记录用户信息到数据库**/
            return createApiResult(actionType,true,"注册成功",{user:newUser});
        }else if(!validatePhoneNumber.success){
            return createApiResult(actionType,false,validatePhoneNumber.message);
        }else{
            return createApiResult(actionType,false,validatePassword.message);
        }
    },
    login:(phoneNumber,passWord)=>{
        let actionType = "login",
            user = userManager.findUserByPhoneNumber(phoneNumber);
        if (!user) {
            return createApiResult(actionType, false, "当前用户不存在，请重新输入账号或注册。");
        } else if (user.passWord !== passWord) {
            return createApiResult(actionType, false, "用户名或密码错误请重试。");
        } else {
            return createApiResult(actionType, true, "登陆成功。", {user});
        }
    },
    findUserByPhoneNumber:(phoneNumber)=>{
        return userList.find((user)=>{
            return user.phoneNumber===phoneNumber;
        });
    }
};
export default userManager;