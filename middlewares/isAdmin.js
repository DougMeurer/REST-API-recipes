module.exports = (req, res, next) => {
  const loggedAdmin = req.currentUser;

  if (loggedAdmin.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "This area is destined to Admin use Only." });
  }

  next();
};
