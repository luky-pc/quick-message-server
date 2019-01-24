/**
 * @author: create by eleven
 * @version: v1.0
 * @description:
 * @date:2019/1/22
 **/
import userManager from "./index";
import {createApiResult} from "../util/commonFunctions";
import {actionTypes} from "../util/actionTypes";
import {clone} from "../util/commonFunctions";

let defaultObj = {
    id: undefined,
    phoneNumber: "",
    nickName: "",
    password: "",
    online: false,
    conn: undefined,
    contactList:[],
    unsent: []//待发送信息，因用户未登录或其他原因导致未发送的信息
};

class User {
    constructor(basic = defaultObj) {
        let obj=clone(defaultObj);
        for (let x in basic) {
            obj[x] = basic[x];
        }
        for (let x in obj) {
            this[x] = obj[x];
        }
        console.log([]+"unsent"+obj.unsent)
    }

    getUserBasicInfo() {//只获取基本信息，不返回联系人列表等
        let {phoneNumber, id, nickName} = this;
        return {phoneNumber, id, nickName};
    }

    getContactList() {//获取联系人列表
        return this.contactList;
    }
    addContact(contactPhoneNumber) {//通过手机号，添加用户的好友关系
        let sponsor = this,
            contact = userManager.findUserByPhoneNumber(contactPhoneNumber),
            sponsorCopy = this.getUserBasicInfo(),
            contactCopy = contact.getUserBasicInfo();
        if (contact && !(sponsor.contactList && sponsor.contactList.find((item) => {
                return item.id === contact.id
            }))) {
            sponsor.contactList ? sponsor.contactList.push(contactCopy) : (sponsor.contactList = [contactCopy]);
            contact.contactList ? contact.contactList.push(sponsorCopy) : (contact.contactList = [sponsorCopy]);
            return createApiResult(actionTypes.ADD_CONTACT, true, "已添加 " + contact.nickName + " 为好友", {contact});
        } else {
            return createApiResult(actionTypes.ADD_CONTACT, false, "未能添加 " + contactPhoneNumber + " 为好友", {contact});
        }
    }

    sendMessage(messageStr) {
        try {
            this.conn.send(messageStr);
        } catch (e) {
            this.conn = undefined;
            this.online = false;
            this.addToUnsentMessage(messageStr);
        }
    }

    dealWithUnsentMessage(){
        for(let index=this.unsent.length-1;index>=0;index--){
            this.sendMessage(this.unsent[index]);
            this.unsent.splice(index,1);
        }
    }

    addToUnsentMessage(messageStr) {
        this.unsent.push(messageStr);
    }

    reconnect(conn) {
        this.conn = conn;
        this.online = false;
        this.dealWithUnsentMessage();
    }

    updateUserConn(conn) {
        this.conn = conn;
        this.online = true;
        this.dealWithUnsentMessage();
    }
}

export default User;