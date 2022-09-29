const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnection = require("./config/db.config");
dbConnection();

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URI }));

const RecipesRoute = require("./routes/recipes.routes");
app.use("/recipe", RecipesRoute);

const UsersRoute = require("./routes/users.routes");
app.use("/user", UsersRoute);

const ImageRoute = require("./routes/images-upload.routes");
app.use("/", ImageRoute);

app.listen(+process.env.PORT, () => {
  console.log("Server up and running on port", process.env.PORT);
});
