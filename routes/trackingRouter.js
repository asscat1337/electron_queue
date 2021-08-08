const {Router} = require('express');
const router = Router()

router.get('/:id',async(req,res)=>{
    console.log(req.params.id)
    res.json('test')
})


module.exports = router