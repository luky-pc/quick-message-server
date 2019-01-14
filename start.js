/**
 * @author: create by eleven
 * @version: v1.0
 * @description:
 * @date:2019/1/14
 **/
require('babel-register') ({
    presets: [ 'env' ]
})

module.exports = require('./server.js')