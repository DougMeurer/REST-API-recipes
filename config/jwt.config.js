const jwt = require("jsonwebtoken");

const genToken = (user) => {
  const { _id, name, email, role } = user;

  const signature = process.env.TOKEN_SIGN_SECRET;
  const expTime = "1d";

  return jwt.sign({ _id, name, email, role }, signature, {
    expiresIn: expTime,
  });
};

module.exports = genToken;
