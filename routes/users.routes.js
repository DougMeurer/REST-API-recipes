const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");
const RecipeModel = require("../models/Recipe.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const isAuth = require("../middlewares/isAuth");
const attCurrentUser = require("../middlewares/attCurrentUser");
const isAdmin = require("../middlewares/isAdmin");
const genToken = require("../config/jwt.config");

router.post("/sign-up", async (req, res) => {
  try {
    const { password } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/
      )
    ) {
      return res
        .status(400)
        .json({ messsage: "Please, provide a valid password." });
    }

    const salt = await bcrypt.genSalt(saltRounds);

    const hashdPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      ...req.body,
      passwordHash: hashdPassword,
    });

    delete newUser._doc.passwordHash; // _doc is a hidden key which carries an obj with the user's info

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ massage: "please provide a valid username or password" });
    }

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "user not found!" });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;
      const token = genToken(user);

      return res.status(200).json({
        user: user,
        token: token,
      });
    } else {
      return res
        .status(400)
        .json({ massage: "username or password incorrect." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//2º rota: Pegar todos os users

router.get("/users", isAuth, attCurrentUser, isAdmin, async (req, res) => {
  try {
    const allUsers = await UserModel.find({}, { passwordHash: 0 });
    return res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

//3º rota: Acessar um usuário pelo seu ID

router.get("/profile", isAuth, attCurrentUser, async (req, res) => {
  try {
    return res.status(200).json(req.currentUser);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

//4º Adicionar uma receita na array de favorites
router.post(
  "/addFavorite/:recipeId",
  isAuth,
  attCurrentUser,
  async (req, res) => {
    try {
      const { recipeId } = req.params;
      const userId = req.currentUser._id;

      const addFavorite = await UserModel.findByIdAndUpdate(
        userId,
        {
          $push: { favorites: recipeId },
        },
        { new: true }
      );

      await RecipeModel.findByIdAndUpdate(recipeId, { $inc: { likes: 1 } });
      delete addFavorite._doc.passwordHash;

      res.status(200).json(addFavorite);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);

//5º Adicionar uma receita na array de deslikes
router.post("/addDislike/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.currentUser._id;

    const addDislike = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: { dislikes: recipeId },
      },
      { new: true }
    );

    await RecipeModel.findByIdAndUpdate(recipeId, {
      $inc: { dislikes: 1 },
    });
    delete addDislike._doc.passwordHash;
    return res.status(200).json(addDislike);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

//6º Remover uma receita na array de favorite
router.put("/deleteFavorite/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.currentUser._id;

    const removeFavorite = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { favorites: recipeId },
      },
      { new: true }
    );

    await RecipeModel.findByIdAndUpdate(recipeId, {
      $inc: { likes: -1 },
    });
    delete removeFavorite._doc.passwordHash;
    return res.status(200).json(removeFavorite);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

//7º Remover uma receita na array de deslikes
router.put("/deleteDislike/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.currentUser._id;

    const removeDislike = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { dislikes: recipeId },
      },
      { new: true }
    );

    await RecipeModel.findByIdAndUpdate(recipeId, {
      $inc: { dislikes: -1 },
    });
    delete removeDislike._doc.passwordHash;
    return res.status(200).json(removeDislike);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
