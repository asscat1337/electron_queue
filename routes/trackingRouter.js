const {Router} = require('express');
const router = Router()

router.get('/:id',async(req,res)=>{
    res.json('test')
})


module.exports = router