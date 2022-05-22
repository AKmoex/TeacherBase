const Router = require('express-promise-router')
const db = require('../db')
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router

router.post('/login',async(req,res)=>{
    console.log(req.body);
   
    const { rows } = await db.select('SELECT * FROM test')
    console.log(rows);
    res.send(rows[0])
})