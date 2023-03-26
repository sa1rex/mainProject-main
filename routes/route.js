const express = require("express");
const router = express.Router();
const passport = require("passport");
const sql = require("mssql");
const path = require("path");
const config = require("../config");
const bodyParser = require("body-parser");

// Настройка bodyParser
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Отправка главного файла
router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "public", "main_index.html"));
});

// Отображение страниц
// Главная страница
router.get("/index", (req, res) => {
  const displayName = req.user && req.user.displayName;
  res.render("index", { title: "Food Store", displayName });
});

// Страница подтверждения заказа
router.get("/orderPlaced", (req, res) => {
  const displayName = req.user && req.user.displayName;
  res.render("orderPlaced", { title: "Order Placed", displayName });
});

// Страница с популярными блюдами
router.get("/trending", (req, res) => {
  const displayName = req.user && req.user.displayName;
  res.render("trending", { title: "Food Menu", displayName });
});

// Страница поиска
router.get("/search", (req, res) => {
  const displayName = req.user && req.user.displayName;
  res.render("search", { title: "Search", displayName });
});

// Страница корзины
router.get("/cart", (req, res) => {
  const displayName = req.user && req.user.displayName;
  res.render("cart", { title: "Your Cart", displayName });
});

// Страница входа
router.get("/login", function (req, res) {
  const displayName = req.user && req.user.displayName;
  res.render("login", {
    title: "Login Page",
    layout: "login-layout",
    message: req.flash("loginMessage"),
    displayName,
  });
});

// Страница регистрации
router.get("/signup", function (req, res) {
  const displayName = req.user && req.user.displayName;
  res.render("signup", {
    title: "Signup Page",
    layout: "login-layout",
    message: req.flash("signupMessage"),
    displayName,
  });
});

// Обработка входа и регистрации
router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/index",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

// Выход из системы
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/index");
});

// Обработка заказа
router.post("/cart", async (req, res) => {
  const {
    user_name: name,
    user_email: email,
    user_mobilenumber: mobile,
    user_street: street,
    user_city: city,
    user_state: state,
    user_pincode: pincode,
    totalAmount,
    items: itemsString,
  } = req.body;

  try {
    const items = JSON.parse(itemsString);

    const query =
      "INSERT INTO orders (name, email, mobile, street, city, state, pincode, total_amount, items) " +
      "VALUES (@name, @email, @mobile, @street, @city, @state, @pincode, @totalAmount, @items)";

    const pool = new sql.ConnectionPool(config);
    pool
      .connect()
      // Подключение к базе данных
      .then(() => {
        const request = new sql.Request(pool);
        request.input("name", sql.NVarChar, name);
        request.input("email", sql.NVarChar, email);
        request.input("mobile", sql.NVarChar, mobile);
        request.input("street", sql.NVarChar, street);
        request.input("city", sql.NVarChar, city);
        request.input("state", sql.NVarChar, state);
        request.input("pincode", sql.NVarChar, pincode);
        request.input("totalAmount", sql.Decimal, totalAmount);
        request.input("items", sql.NVarChar, items.join(", "));

        // Выполнение запроса на вставку данных
        return request.query(query);
      })
      .then((result) => {
        console.log(result);
        res.send("Order placed successfully!");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error while placing the order.");
      })
      .finally(() => {
        // Закрытие подключения к базе данных
        pool.close();
      });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    res.redirect("/cart");
  }
});

module.exports = router;
