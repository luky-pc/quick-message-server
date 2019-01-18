/**
 * @author: create by eleven
 * @version: v1.0
 * @description:
 * @date:2019/1/11
 **/
function inputCheck(reg,inputStr){
    return reg.test(inputStr);
}
let checkRuleManager={
    checkNickName: (nickName) => {
        let reg = /^[a-zA-Z][a-zA-Z0-9\-_+=@#$]{0,15}$/;//允许输入包含字母，数字及特殊符号-_+=@#$共计最长16个字符，且必须以字符串开头
        if (inputCheck(reg, nickName)) {
            return {
                success: true,
                message: "输入合法。"
            };
        } else {
            return {
                success: false,
                message: "输入不合法；允许输入包含字母，数字及特殊符号-_+=@#$共计最长16个字符，且必须以字符串开头。"
            }
        }
    },
    checkPhoneNumber:(phoneNumber)=>{
        let reg=/^[1][34578][0-9]{9}$/;
        if (inputCheck(reg, phoneNumber)) {
            return {
                success: true,
                message: "输入合法。"
            };
        } else {
            return {
                success: false,
                message: "手机号码异常，请检测是否输入正确的手机号。"
            }
        }
    },
    checkPassword: (password) => {
        let reg = /^[a-zA-Z0-9\-_+=@#$]{0,16}$/;//允许输入包含字母，数字及特殊符号-_+=@#$共计最长16个字符
        if (inputCheck(reg, password)) {
            return {
                success: true,
                message: "输入合法。"
            };
        } else {
            return {
                success: false,
                message: "输入不合法；允许输入包含字母，数字及特殊符号-_+=@#$共计最长16个字符"
            }
        }
    }
};

export default checkRuleManager;