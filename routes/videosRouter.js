const express = require('express');
const videosController = require('../controller/videoController');
const upload = require('../midlleware/upload');
const videosRouter = express.Router();

videosRouter.use('/',videosController.video);
videosRouter.post('/upload',upload.single('filename'),(req,res)=>{
    console.log(req.body)
});
module.exports = videosRouter;
