/**
 * @author: create by eleven
 * @version: v1.0
 * @description:
 * @date:2019/1/11
 **/
import checkRuleManager from "../checkRuleManage";
let userList=[];//临时用户数据存放，后续考虑使用数据库存放
let id=0;
let userManager={
    registerUserByPhoneNumber:(phoneNumber,passWord)=>{
        let actionType="register",
            newUser={phoneNumber,passWord,id:id++},
            validatePhoneNumber = checkRuleManager.checkPhoneNumber(phoneNumber),
            validatePassword = checkRuleManager.checkPassword(passWord);
        if(validatePassword.success&&validatePhoneNumber.success){
            userList.push(newUser);/**TODO:记录用户信息到数据库**/
            return {
                success:true,
                actionType,
                message:"注册成功"
            };
        }else if(!validatePhoneNumber.success){
            return validatePhoneNumber;
        }else{
            return validatePassword;
        }
    },
    login:(phoneNumber,passWord)=>{
        let actionType = "login",
            user = this.findUserByPhoneNumber(phoneNumber);
        if(!user){
            return {
                success:false,
                actionType,
                message:"当前用户不存在，请重新输入账号或注册。"
            }
        }else if(user.passWord!==passWord){
            return {
                success:false,
                actionType,
                message:"用户名或密码错误请重试。"
            }
        }else{
            return {
                success:true,
                actionType,
                message:"登录成功。"
            }
        }
    },
    findUserByPhoneNumber:(phoneNumber)=>{
        return userList.find((user)=>{
            return user.phoneNumber===phoneNumber;
        });
    }
};
export default userManager;