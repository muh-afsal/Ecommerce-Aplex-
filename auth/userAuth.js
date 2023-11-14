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
      res.redirect("/home");
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  userExist,
  verifyuser,
};
