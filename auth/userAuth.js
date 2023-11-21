const Users = require("../Model/collections/userModel");


const verifyuser = async (req, res, next) => {
  try {
    if (req.session.logged) {
        next();
    }else{
      res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const userExist = async (req, res, next) => {
  try {
    if (req.session.logged) {
      //commed added
      res.redirect("/home");
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};
const checkUserAuthentication=async(req,res,next)=>{
  if(req.session.logged){
    let userData=await Users.findOne({email:req.session.email})
    if(userData.access){
      next()
    }else{
      res.render('login',{errmessage:"Your Permission Denied by admin"})
    }
  }else{
    res.redirect("/login")
  }
}
module.exports = {
  userExist,
  verifyuser,
  checkUserAuthentication
};
