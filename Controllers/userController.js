const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* CREATE NEW LOCAL USER */
exports.newUser = [
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) return next(err);

        const user = new User({
          username,
          password: hash,
        });

        await user.save();
        res.json(user);
      });
    } catch (err) {
      res.json(next(err));
    }
  },
];

/* LOGIN LOCAL USER */
exports.localLogin = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user)
      return res.status(500).json("El usuario o contraseña es incorrecto.");
    else {
      req.login(user, { sesion: false }, (err) => {
        if (err) return next(err);
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: "24h",
        });
        res.json({ token, user });
      });
    }
  })(req, res, next);
};

/* GET USER */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.json("User not found");
    res.json(user);
  } catch (err) {
    res.json(next(err));
  }
};

/* ADD AN EXISTING RECIPE TO THE USER */
exports.addRecipeUser = async (req, res, next) => {
  const { recipeID } = req.body;
  try {
    let user = await User.findById(req.user._id);
    if (!user) return res.json("User not found");

    const recipe = await Recipe.findById(recipeID);
    if (!recipe) return res.json("Recipe Doesn't exist.");

    user = await User.findByIdAndUpdate(
      req.params.id,

      {
        $addToSet: { recipes: recipe },
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.json(next(err));
  }
};
/* REMOVE A RECIPE FROM THE USER FAVORITES */
exports.deleteRecipeUser = async (req, res, next) => {
  const { recipeId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { recipes: recipeId },
      },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.json(next(err));
  }
};

/* ADD INGREDIENTS TO THE USER FRIDGE */
exports.addIngredientFridge = async (req, res, next) => {
  const { ingredientId, ingredientQty, unit, ingredientName } = req.body;
  try {
    const ingredient = await Ingredient.findById(ingredientId);

    const ingredientToAdd = {
      ingredient: ingredientName,
      quantity: ingredientQty,
      unit,
    };

    User.findById(req.params.id, async (err, user) => {
      if (err) return next(err);
      if (!user) return res.json("User doesnt exist");
      const ingredientsArr = user.fridge;

      if (ingredientsArr.length === 0) {
        ingredientsArr.push(ingredientToAdd);
      } else {
        for (let i = 0; i < ingredientsArr.length; i++) {
          if (ingredientsArr[i].name === ingredient.name) {
            return res.json(user);
          }
        }
        ingredientsArr.push(ingredientToAdd);
      }
      user.markModified("ingredients");
      await user.save();
      res.json(user);
    });
  } catch (err) {
    res.json(next(err));
  }
};

/* REMOVE INGREDIENT FROM THE USER FRIDGE */
exports.removeIngredientFridge = async (req, res, next) => {
  const { ingredientName } = req.body;
  try {
    User.findById(req.params.id, async (err, user) => {
      if (err) return next(err);

      const ingredientsArr = user.fridge;

      for (let i = 0; i < ingredientsArr.length; i++) {
        if (ingredientsArr[i].name === ingredientName) {
          ingredientsArr.splice(i, 1);
        }
      }
      user.markModified("ingredients");
      await user.save();
      res.json(user);
    });
  } catch (err) {
    res.json(next(err));
  }
};

/* MODIFY INGREDIENTS FRIDGE COUNT */
exports.modifyIngredientCount = async (req, res, next) => {
  const { ingredientName, ingredientCount, unit } = req.body;
  try {
    User.findById(req.params.id, async (err, user) => {
      if (err) return next(err);

      const ingredientsArr = user.fridge;

      for (let i = 0; i < ingredientsArr.length; i++) {
        if (ingredientsArr[i].name === ingredientName) {
          ingredientsArr[i].quantity += parseInt(ingredientCount);
          ingredientsArr[i].unit = unit;
        }
      }
      user.markModified("ingredients");
      await user.save();
      res.json(user);
    });
  } catch (err) {
    res.json(next(err));
  }
};
