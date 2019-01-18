import userManager from "./userManage";
import {createApiResult} from "./util/commonFunctions";
import {actionTypes} from "./util/actionTypes";

var WebSocketServer = require("ws").Server;

var currentUser, //当前用户
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
                currentUser = userManager.findUserById(message.from);
                contactUser = userManager.findUserById(message.to);

                if (contactUser&&contactUser.online) {//信息接收用户已登录 转发聊天消息
                    console.log("转发消息到用户："+contactUser.nickName+contactUser.online+contactUser.conn);
                    contactUser.conn.send(JSON.stringify(createApiResult(actionTypes.SEND_MESSAGE,true,"",{message})));
                } else {
                    currentUser.conn.send(JSON.stringify({
                        success:true,
                        actionType:message.actionType,
                        from: contactUser.id,
                        to: currentUser.id,
                        isRead: false,
                        content: "当前用户未登录，请稍后重试！",
                        time: (new Date()).getTime()
                    }));
                }
                break;
            case actionTypes.LOGIN:
                actionResult=userManager.login(message.phoneNumber,message.password,conn);
                conn.send(JSON.stringify(actionResult));
                break;
            case actionTypes.REGISTER_USER:
                actionResult=userManager.registerUserByPhoneNumber(message.phoneNumber,message.password,message.nickName,conn);
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
                currentUser=userManager.findUserByPhoneNumber(message.userPhoneNumber);
                actionResult=userManager.addContact(message.userPhoneNumber,message.phoneNumber);
                console.log("发起用户："+currentUser.nickName+currentUser.conn);
                currentUser.conn.send(JSON.stringify(actionResult));
                if(actionResult.success){//添加好友成功后，尝试通知被添加人
                    contactUser = userManager.findUserByPhoneNumber(message.phoneNumber);
                    if (contactUser.online) {//信息接收用户已登录 发送登录消息
                        currentUser=userManager.getUserBasicInfo(currentUser);
                        actionResult=createApiResult(actionTypes.ADD_CONTACT, true, currentUser.nickName +"已添加您为好友", {contact: currentUser});
                        contactUser.conn.send(JSON.stringify(actionResult));
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