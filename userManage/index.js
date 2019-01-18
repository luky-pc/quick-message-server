/**
 * @author: create by eleven
 * @version: v1.0
 * @description:
 * @date:2019/1/11
 **/
import checkRuleManager from "../checkRuleManage";
import {actionTypes} from "../util/actionTypes";
import {createApiResult,clone} from "../util/commonFunctions";

let userList=[{id:10,phoneNumber:"18180874439",nickName:"十一",password:"123"}];//临时用户数据存放，后续考虑使用数据库存放
let id=0;
let userManager={
    registerUserByPhoneNumber:(phoneNumber,password,nickName)=>{//通过手机号注册用户
        let actionType=actionTypes.REGISTER_USER,
            newUser={phoneNumber,password,nickName,id:id++},
            validatePhoneNumber = checkRuleManager.checkPhoneNumber(phoneNumber),
            validatePassword = checkRuleManager.checkPassword(password);
        if(validatePassword.success&&validatePhoneNumber.success){
            userList.push(newUser);/**TODO:记录用户信息到数据库**/
            return createApiResult(actionType,true,"注册成功",{user:newUser});
        }else if(!validatePhoneNumber.success){
            return createApiResult(actionType,false,validatePhoneNumber.message);
        }else{
            return createApiResult(actionType,false,validatePassword.message);
        }
    },
    login:(phoneNumber,password)=>{//登录操作
        let actionType = "login",
            user = userManager.findUserByPhoneNumber(phoneNumber);
        if (!user) {
            return createApiResult(actionType, false, "当前用户不存在，请重新输入账号或注册。");
        } else if (user.password !== password) {
            return createApiResult(actionType, false, "用户名或密码错误请重试。");
        } else {
            return createApiResult(actionType, true, "登陆成功。", {user});
        }
    },
    findUserByPhoneNumber:(phoneNumber)=>{//通过手机号查找用户,返回联系人列表
        return userList.find((user)=>{
            return user.phoneNumber===phoneNumber;
        });
    },
    getUserBasicInfo:(user)=>{//只获取基本信息，不返回联系人列表等
        let {phoneNumber,id,nickName}=user;
        return {phoneNumber,id,nickName};
    },
    addContact:(sponsorPhoneNumber,contactPhoneNumber)=>{//通过手机号，添加用户的好友关系
        let sponsor=userManager.findUserByPhoneNumber(sponsorPhoneNumber),
            contact=userManager.findUserByPhoneNumber(contactPhoneNumber),
            sponsorCopy=userManager.getUserBasicInfo(sponsor),
            contactCopy=userManager.getUserBasicInfo(contact);
        if(contact&&!(sponsor.contactList&&sponsor.contactList.find((item)=>{return item.id===contact.id}))){
            sponsor.contactList?sponsor.contactList.push(contactCopy):(sponsor.contactList=[contactCopy]);
            contact.contactList?contact.contactList.push(sponsorCopy):(contact.contactList=[sponsorCopy]);
            return createApiResult(actionTypes.ADD_CONTACT,true,"已添加 "+contact.nickName+" 为好友",{contact});
        }else{
            return createApiResult(actionTypes.ADD_CONTACT,false,"未能添加 "+contactPhoneNumber+" 为好友",{contact});
        }
    }
};
export default userManager;