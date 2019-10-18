var express = require('express');
var router = express.Router();
var articleModel = require('../db/articleModel');
var multiparty = require('multiparty');
var  fs = require('fs');

//写文章
router.post('/write', function(req, res, next) {
  let {title,content,id,author} = req.body;
  let createTime = Date.now();
  if(id){
    //修改
    id = new Object(id);
    articleModel.updateOne({_id:id},{createTime,content,title,author}).then((data) =>{
      res.redirect('/')
      console.log(data)
    }).catch(err =>{
      res.redirect('/write')
    })

  }else{ 
     //插入数据库
     articleModel.insertMany({title,content,createTime,author}).then((data) => {
    res.redirect('/')
    // res.send('文章发表成功')
  }).catch((err) =>{
    res.redirect('/write')
    // res.send('文章发表失败')
  })
  }
  
  
});

router.post("/upload",(req, res, next) =>{
  //只要有img就生成form 对象
  var form = new multiparty.Form()
  form.parse(req,(err, field, files) =>{
    if(err) {
      console.log('文件上传失败')
    }else{
      var file = files.filedata[0];
       //读取流
       var read= fs.createReadStream(file.path);
       //写入流
       var write = fs.createWriteStream('./public/imgs/'+file.originaFilename)
       //管道流，图片写入指定路径
      read.pipe(write)
      write.on('close',()=> {
         res.send({err:0,msg:'/imgs/'+file.originaFilename})
      }) 
       console.log(file)
    }

  })
})

//删除文章
router.get('/delete',(req, res, next) =>{
  let id = req.query.id;
  id = new Object(id);
  articleModel.deleteOne({_id:id}).then(data =>{
    res.redirect('/')
  }).catch(err=>{
    res.redirect('/')
  })
})
module.exports = router;