const multer = require('multer');
const moment = require('moment')();
    const storage = multer.diskStorage({
        destination(req,file,cb){
            cb(null,'uploads')
        },
        filename(req,file,cb){
            cb(null,`${moment.format('MMM Do YYYY')}-${file.originalname}`)
        }
    })
    const fileFilter = (req,file,cb)=>{
        if(file.mimetype === 'video/mp4' || file.mimetype === 'video/mpeg'){
            cb(null,true)
        }else{
            cb(null,false)
        }
    }
    const limits = {
        fileSize:1024**1024*100
    };
    module.exports = multer({storage:storage,fileFilter:fileFilter,limits:limits});