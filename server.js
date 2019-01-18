import userManager from "./userManage";
import {createApiResult} from "./util/commonFunctions";
import {actionTypes} from "./util/actionTypes";

var WebSocketServer = require("ws").Server;

var userlist = [], //用户列表
    currentUser, //当前用户
    contactUser, //信息接收用户
    message,
    wss=new WebSocketServer({port:8001}); //消息体
console.log("开始建立连接...");
wss.on("connection",function(conn){
    conn.on("message", function (str) {
        let actionResult,user;
        console.log("收到的信息为:"+str);
        message=JSON.parse(str);
        if(!actionTypes.checkAction(message.actionType)){
            console.log("不支持的操作。");
            conn.send(JSON.stringify(createApiResult(message.actionType,false,"不支持的操作")));
            return false;
        }
        switch (message.actionType) {
            case actionTypes.SEND_MESSAGE:
                currentUser = userlist.find((user) => {
                    return user.id == message.from;
                });
                contactUser = userlist.find((user) => {
                    return user.id == message.to;
                });
                if (!currentUser && message.from) {//无当前用户,记录当前用户登录状态
                    currentUser = {
                        id: message.from,
                        ready: true,
                        conn: conn
                    };
                    userlist.push(currentUser);
                }
                if (contactUser) {//信息接收用户已登录 发送登录消息
                    contactUser.conn.send(str);
                } else {
                    console.log(new Date() + ":+" + currentUser);
                    currentUser && currentUser.conn.send(JSON.stringify({
                        actionType:message.actionType,
                        from: "17298566363",
                        to: "666546",
                        isRead: false,
                        content: "当前用户未登录，请稍后重试！",
                        time: (new Date()).getTime()
                    }));
                }
                break;
            case actionTypes.LOGIN:
                actionResult=userManager.login(message.phoneNumber,message.password);
                if(actionResult.success){
                    let user=userManager.findUserByPhoneNumber(message.phoneNumber);
                    currentUser={
                        id:user.id,
                        phoneNumber:user.phoneNumber,
                        isRead:true,
                        conn
                    };
                    userlist.push(currentUser);
                    actionResult.user=user;
                }
                conn.send(JSON.stringify(actionResult));
                break;
            case actionTypes.REGISTER_USER:
                actionResult=userManager.registerUserByPhoneNumber(message.phoneNumber,message.password,message.nickName);
                if(actionResult.success){
                    let user = actionResult.user;
                    currentUser = {
                        id: user.id,
                        phoneNumber:user.phoneNumber,
                        isRead: true,
                        conn
                    };
                    userlist.push(currentUser);
                }
                conn.send(JSON.stringify(actionResult));
                break;
            case actionTypes.SEARCH_USER:
                user=userManager.findUserByPhoneNumber(message.phoneNumber);
                if(user) {
                    actionResult = createApiResult(message.actionType, true,"查找到已注册用户。", {userList:[user]});
                }else{
                    actionResult = createApiResult(message.actionType, true,"未能找到用户。",{userList:[]});
                }
                conn.send(JSON.stringify(actionResult));
                break;
            case actionTypes.ADD_CONTACT:
                actionResult=userManager.addContact(message.userPhoneNumber,message.phoneNumber);
                conn.send(JSON.stringify(actionResult));
                if(actionResult.success){//添加好友成功后，尝试通知被添加人
                    contactUser = userlist.find((user) => {
                        return user.phoneNumber === message.phoneNumber;
                    });
                    if (contactUser) {//信息接收用户已登录 发送登录消息
                        contactUser.conn.send(JSON.stringify(createApiResult(actionTypes.ADD_CONTACT, true, "已添加 " + contact.nickName + " 为好友", {contact: userManager.getUserBasicInfo(userManager.findUserByPhoneNumber(message.userPhoneNumber))})));
                    }
                }
                break;
        }
    });
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
});
console.log("WebSocket建立完毕")