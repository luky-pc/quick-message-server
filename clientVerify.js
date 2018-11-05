let util = require("util"),
    url = require("url"),
    clientVerify = (info) => {
        var ret = false;//拒绝
        var params = url.parse(info.req.url, true).query;
        if (params["id"] === "luoc83" && params["key"] === "123456") {
            ret = true;//通过
        }

        return ret;
    };

export {clientVerify};