const checkAdminAuth=(req,res,next)=>{
    if(req.session.adminAuth){
        next()
    }else{
        res.redirect('/login')
    }
}
module.exports={checkAdminAuth}