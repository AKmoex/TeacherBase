const Router = require('express-promise-router')
const db = require('../db')
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router

router.post('/login',async(req,res)=>{
    
    const {username,password}=req.body

    const { rows } = await db.select('SELECT * FROM teacher where t_id=$1 and password=$2',[username,password])
        console.log(rows);
        if(rows.length>0){
            // admin用户
            if(rows[0].t_id=='0000000000'){
                res.send({
                    status: 'ok',
                    type:'account',
                    currentAuthority: 'admin',
                    tid:rows[0].t_id
                });
            }
            // user 普通用户
            else{
                res.send({
                    status: 'ok',
                    type:'account',
                    currentAuthority: 'user',
                    tid:rows[0].t_id
                });
            }
        }
        else{
            res.send({
                status: 'error',
                type:'account',
                currentAuthority: 'guest',
            });
        }
    
   

})

router.get('/currentUser',async(req,res)=>{
    console.log(req.query);
    const tid=req.query.tid;
    if(tid==""){
            res.status(401).send({
              data: {
                isLogin: false,
              },
              errorCode: '401',
              errorMessage: '请先登录！',
              success: true,
            });
        return;
    }
    const { rows } = await db.select('SELECT * FROM teacher where t_id=$1',[tid])
        console.log(rows);
        if(rows.length>0){
            // admin用户
            if(rows[0].t_id=='0000000000'){
                res.send({
                    success: true,
                    data: {
                      name: 'Serati Ma',
                      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                      userid: '00000001',
                      email: 'antdesign@alipay.com',
                      access: 'admin',
                    },
                  });
            }
            // user 普通用户
            else{
                res.send({
                    success: true,
                    data: {
                      name: 'Serati Ma',
                      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                      userid: '00000001',
                      email: 'antdesign@alipay.com',
                      access: 'user',
                    },
                });
            }
        }
        else{
            res.status(401).send({
                data: {
                  isLogin: false,
                },
                errorCode: '401',
                errorMessage: '请先登录！',
                success: true,
              });
        }
})

