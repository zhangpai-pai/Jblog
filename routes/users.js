var express = require('express');
var router = express.Router();
var userModel = require('../db/userModel')

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  res.send('respond with a resource');
});
//注册
router.post('/regist',(req, res, next)=>{
  let {username,password,password2}=req.body;
  //检测用户是否已存在
  userModel.find({username}).then((docs)=>{
    if(docs.length>0) {
      res.send('用户名已存在')
    }else{
      //开始注册
      let createTime = Date.now()
      //操作数据库
      userModel.insertMany({username,password,createTime}).then((data)=>{
        // res.send('注册成功')
         res.redirect('/login')
      }).catch((err)=>{
        // res.send('注册失败')
        res.redirect('/regist')
      })
      // res.json({username,password,password2});
    }
    })
  })
//  登录
router.post('/login',(req, res, next)=>{
  let {username,password}=req.body;
  console.log(username,password)
  //操作数据库
  userModel.find({username,password}).then((data)=>{
    if(data.length > 0) {
     //登陆成功后,在服务端使用session记录用户信息
     req.session.username = username;
     req.session.islogin = true; 
      res.redirect('/')
      // res.send('登录成功')
    }else{
      res.redirect('/login')
      // res.send('用户不存在')
    }
  }).catch((err)=>{
    // res.send('登录失败')
    res.redirect('/login')
  })
})
//退出登录
router.get('/logout',(req, res, next) =>{
  req.session.username = null;
  req.session.isLogin = false;
  // req.session.destroy()
  res.redirect('/login')
})



module.exports = router;
