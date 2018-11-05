var WebSocketServer = require("ws").Server;

var userlist = [], //用户列表
    currentUser, //当前用户
    contactUser, //信息接收用户
    messge,
wss=new WebSocketServer({port:8001}); //消息体
console.log("开始建立连接...")
wss.on("connection",function(conn){
    conn.on("message", function (str) {
        console.log("收到的信息为:"+str)
        message=JSON.parse(str);

        currentUser=userlist.find((user)=>{
            return user.id==message.from;
        })
        contactUser=userlist.find((user)=>{
            return user.id==message.to;
        });
        if(!currentUser&&message.from){//无当前用户,记录当前用户登录状态
            currentUser={
                id:message.from,
                ready:true,
                conn:conn
            }
            userlist.push(currentUser);
        }
       if(contactUser){//信息接收用户已登录 发送登录消息
           contactUser.conn.send(str);
       }else{
           console.log(new Date()+":+"+currentUser)
           currentUser&&currentUser.conn.send(JSON.stringify({from: "17298566363", to:"666546", isRead: false, content: "当前用户未登录，请稍后重试！", time: (new Date()).getTime()}));
       }
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
});
console.log("WebSocket建立完毕")