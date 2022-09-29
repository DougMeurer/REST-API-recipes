const UserModel = require("../models/User.model");

async function attCurrentUser(req, res, next) {
  try {
    const loggedUser = req.auth; // req.auth comes from isAuth MidWare

    const user = await UserModel.findOne(
      { _id: loggedUser._id },
      { passwordHash: 0 }
    );

    if (!user.emailConfirmed) {
      return res
        .status(400)
        .json({ message: "Error, user account not activated!" });
    }

    req.currentUser = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

module.exports = attCurrentUser;
