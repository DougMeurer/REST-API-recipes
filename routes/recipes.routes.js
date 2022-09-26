const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");
const RecipeModel = require("../models/Recipe.model");
const isAuth = require("../middlewares/isAuth");
const attCurrentUser = require("../middlewares/attCurrentUser");
const isAdmin = require("../middlewares/isAdmin");

//1º rota: Criar uma receita
router.post("/create", isAuth, attCurrentUser, isAdmin, async (req, res) => {
  try {
    const newRecipe = await RecipeModel.create({ ...req.body });
    return res.status(201).json(newRecipe);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

//2º rota: Acessar todas as receitas

router.get("/recipes", isAuth, attCurrentUser, async (req, res) => {
  try {
    const findAll = await RecipeModel.find();
    return res.status(200).json(findAll);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

//3º rota: Acessar uma única receita pelo seu ID

router.get("/recipes/:recipeId", isAuth, attCurrentUser, async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await RecipeModel.findById(recipeId);
    return res.status(200).json(recipe);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

//4º rota: Criar várias receitas de uma só vez

router.post(
  "/createmany",
  isAuth,
  attCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const manyRecipes = await RecipeModel.insertMany([...req.body]);
      return res.status(201).json(manyRecipes);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);

//6º rota: Acessar todos os usuários que favoritaram essa receita

router.get(
  "/favorites/:recipeId",
  isAuth,
  attCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const { recipeId } = req.params;

      const findFavorites = await UserModel.find(
        { favorites: { recipeId } },
        { passwordHash: 0 }
      );
      return res.status(200).json(findFavorites);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);

//7º rota: Acessar todos os usuários que deram dislike essa receita

router.get(
  "/dislike/:recipeId",
  isAuth,
  attCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const { recipeId } = req.params;

      const findDislikes = await UserModel.find(
        { dislikes: { recipeId } },
        { passwordHash: 0 }
      );
      return res.status(200).json(findDislikes);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);

//!5º rota: Deletar uma receita pelo seu ID - retira-la da array de favorites e dislikes dos USERS
router.delete(
  "/delete/:recipeId",
  isAuth,
  attCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const { recipeId } = req.params;

      const deletedRecipe = await RecipeModel.findByIdAndDelete(recipeId);

      await UserModel.updateMany(
        {
          $eq: [{ favorites: recipeId }, { dislikes: recipeId }],
        },
        { $pull: { favorites: recipeId, dislikes: recipeId } }
      );
      return res.status(200).json(deletedRecipe);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);

module.exports = router;
