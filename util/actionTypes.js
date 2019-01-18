let actionTypes={
    SEND_MESSAGE:"sendMessage",
    RECEIVE_MESSAGE:"receiveMessage",
    SET_USER: "setUser",
    GET_CONTACT_LIST:"getContactList",//获取联系人列表
    GET_MESSAGE_LIST:"getMessageList",//获取未读信息列表
    REGISTER_USER: "register",//注册新用户
    RECEIVE_REGISTER_RESULT: "receiveRegisterResult",//获取用户注册结果
    LOGIN:"login",//用户登录
    SEARCH_USER:"searchUser",//查找用户
    PING:"ping",
    ADD_CONTACT:"addContact",//添加联系人
    checkAction:(actionType)=>{//检测是否合法操作
        for(let x in actionTypes){
            if(actionTypes[x]===actionType){
                return true;
            }
        }
        return false;
    }
};

export {actionTypes};