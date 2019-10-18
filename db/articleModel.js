var mongoose = require('mongoose')

var articleSchema= mongoose.Schema({
    title:String,
    content:String,
    author:String,
    createTime:Number
})

var articleModel = mongoose.model('articles',articleSchema)

module.exports = articleModel;