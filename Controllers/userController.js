const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* CREATE NEW LOCAL USER */
exports.newUser = [
  body("username")
    .notEmpty()
    .withMessage("Por favor ingresa un nombre de usuario"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("La contraseña debe tener al menos 5 caracteres"),
  body("confirm", "Las contraseñas deben coincidir")
    .exists()
    .custom((value, { req }) => value === req.body.password),

  async (req, res, next) => {
    const validationErrors = validationResult(req);

    try {
      const { username, password } = req.body;

      let usernameExist = await User.findOne({
        username: new RegExp("^" + username + "$", "i"), //^start $end of string
      });

      if (usernameExist) {
        validationErrors.errors.push({ msg: "El usuario ya existe" });
      }

      if (!validationErrors.isEmpty()) {
        return res.status(500).json({ errors: validationErrors.array() });
      }

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
    if (!user) return res.status(500).json("User does not exist");
    else {
      req.login(user, { sesion: false }, (err) => {
        if (err) return next(err);
        const token = jwt.sign(
          user.toJSON(),
          process.env.JWT_SECRET /* {
          expiresIn: "20s",
        } */
        );
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
    // SI NO AGREGO NADA EN POSTMAN, AGREGA NULL. FIX THIS
    const recipe = await Recipe.findById(recipeID);

    const user = await User.findByIdAndUpdate(
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
  const { ingredientId, ingredientQty, ingredientName } = req.body;
  try {
    const ingredient = await Ingredient.findById(ingredientId);

    // UNIT ? gr, ml, etc
    const ingredientToAdd = {
      ingredient: ingredientName,
      quantity: ingredientQty,
      name: ingredient.name,
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
  const { ingredientName, ingredientCount } = req.body;
  try {
    User.findById(req.params.id, async (err, user) => {
      if (err) return next(err);

      const ingredientsArr = user.fridge;

      for (let i = 0; i < ingredientsArr.length; i++) {
        if (ingredientsArr[i].name === ingredientName) {
          ingredientsArr[i].quantity += parseInt(ingredientCount);
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
