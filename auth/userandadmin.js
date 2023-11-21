// const Users = require("../Model/collections/userModel")


// const checkSession=async(req,res,next)=>{
//     if(req.session.adminAuth){
//         res.redirect('/admin/admin')
//     }else{
//         if(req.session.logged){
//             const userData=await Users.findOne({email:req.session.email})
//             if(userData.access){
//                 res.redirect('/home')
//             }
//         }else{
//             res.redirect('/login')
//         }
//     }
// }
// module.exports={checkSession}