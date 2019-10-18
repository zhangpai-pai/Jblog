var express = require('express');
var router = express.Router();
var articleModel = require('../db/articleModel');
var moment = require('moment')

/* GET home page. */
router.get('/', function (req, res, next) {
  let { page, size } = req.query;
  page = parseInt(req.query.page || 1);
  size = parseInt(req.query.size || 2);
  // res.send({page,size})
  let username = req.session.username
  //第一步：查询文章总数
  articleModel.find().count().then(total => {
    var pages =Math.ceil(total/size)
    // 第二步：分页查询 
    articleModel.find().sort({createTime:-1}).limit(size).skip((page - 1) * size).then((data) => {
      //对数据中的时间进行处理
      var arr = data.slice()
      for (let i = 0; i < data.length; i++) {
        arr[i].createTimeZH = moment(arr[i].createTime).format('YYYY-MM-DD HH:mm:ss')
      }
      res.render('index',{data:{ list: arr, total: pages,author:username }});
    }).catch((err) => {
      res.redirect('/')
    })
  }).catch((err) => {
    res.redirect('/')
  })
})


// 注册页面的路由
router.get('/regist', function (req, res, next) {
  res.render('regist', { title: '注册页面' });
})

// 登录页面的路由
router.get('/login', function (req, res, next) {
  res.render('login', { title: '登录页面' });
})

// 写文章路由
router.get('/write', function (req, res, next) {
  var id =req.query.id;
  if(id){
    //修改
    id= new Object(id)
    articleModel.findById(id).then((doc)=>{
      res.render('write',{doc:doc})
    }).catch(err =>{
      res.redirect('/');
    })
  }else{
    //新增
    var doc = {
      _id:'',
      username:req.session.username,
      title:'',
      content:''

    }
    res.render('write', { doc:doc})
  }
 
})

//详情页路由
router.get('/detail',function(req, res, next) {
  var id = new Object(req.query.id)
  // var time = parseInt(req.query.id)
  console.log(id)
 //用_id查询
 articleModel.findById(id).then(data =>{
   data.createTimeZH = moment(data.createTime).format('YYYY-MM-DD HH:mm:ss');
   res.render('detail',{data:data});
  }).catch(err =>{
    console.log("文章详情查询失败");
    res.send(err)
  })


  //用时间戳查询当前文件详情
  // articleModel.find({"createTime": time}).then((data) =>{
  //   res.send(data);
  // }).catch(err =>{
  //   console.log("文章详情查询失败");
  //   // res.redirect("/")
  //   res.send(err)
  // })

  // res.render('detail',{title:'详情页'})
})

module.exports = router;
