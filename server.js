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
        currentUser = userManager.findUserByPhoneNumber(message.currentUserPhoneNumber);
        currentUser&&currentUser.updateUserConn(conn);
        if(!actionTypes.checkAction(message.actionType)){
            conn.send(JSON.stringify(createApiResult(message.actionType,false,"不支持的操作")));
            return false;
        }
        if(message.actionType!==actionTypes.LOGIN&&message.actionType!==actionTypes.REGISTER_USER&&(!currentUser||!currentUser.online)){
            conn.send(JSON.stringify(createApiResult(actionTypes.OFFLINE,true,"用户未登录")));
        }
        switch (message.actionType) {
            case actionTypes.SEND_MESSAGE:
                contactUser = userManager.findUserById(message.to);
                if (contactUser&&contactUser.online) {//信息接收用户已登录 转发聊天消息
                    console.log("转发消息到用户：" + contactUser.nickName + contactUser.online + contactUser.conn);
                    contactUser.sendMessage(JSON.stringify(createApiResult(actionTypes.SEND_MESSAGE, true, "", {message})));
                } else if(contactUser){
                    currentUser.sendMessage(JSON.stringify(createApiResult(actionTypes.SEND_MESSAGE,true,"",{
                        from: contactUser.id,
                        to: currentUser.id,
                        isRead: false,
                        content: "当前用户未登录，请稍后重试！",
                        time: (new Date()).getTime()
                    })));
                } else{
                    console.log("未找到id为"+message.to+"的用户");
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
                actionResult = currentUser.addContact(message.phoneNumber);
                console.log("发起用户：" + currentUser.nickName + currentUser.conn);
                currentUser.sendMessage(JSON.stringify(actionResult));
                if (actionResult.success) {//添加好友成功后，尝试通知被添加人
                    contactUser = userManager.findUserByPhoneNumber(message.phoneNumber);
                    currentUser = currentUser.getUserBasicInfo();
                    actionResult = createApiResult(actionTypes.ADD_CONTACT, true, currentUser.nickName + "已添加您为好友", {contact: currentUser});
                    if (contactUser.online && contactUser.conn) {//信息接收用户已登录 发送登录消息
                        contactUser.sendMessage(JSON.stringify(actionResult));
                    }else{
                        contactUser.addToUnsentMessage(JSON.stringify(actionResult));
                    }
                }
                break;
            case actionTypes.REQUEST_CONTACT_LIST://返回用户联系人列表
                currentUser.sendMessage(createApiResult(message.actionType, true,"",{contactList:currentUser.getContactList()}));
                console.log("返回联系人列表： "+JSON.stringify(createApiResult(message.actionType, true,"",{contactList:currentUser.getContactList()})));
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