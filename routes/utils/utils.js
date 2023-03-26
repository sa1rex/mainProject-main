const crypto = require("crypto");
const sql = require("mssql");

// Middleware для маршрута, чтобы убедиться, что пользователь вошел в систему
module.exports.isLoggedIn = function isLoggedIn(req, res, next) {
  // Если пользователь аутентифицирован в текущей сессии, продолжить выполнение
  if (req.isAuthenticated()) return next();
  // Если нет, перенаправить его на страницу входа
  req.flash("error", "You must be logged in to visit that page.");
  res.redirect("/login");
};

//  экспортирует асинхронную функцию sqlFetch в качестве модуля. Функция принимает любое количество аргументов (используя оператор расширения ...args) и использует модуль mssql для выполнения SQL-запроса к базе данных.
module.exports.sqlFetch = async (...args) => {
  try {
    const result = await sql.query(...args); // Выполнение SQL-запроса с использованием аргументов, переданных функции
    const resultingRows = result.recordsets[0]; // Извлечение первого набора записей из результата запроса
    return resultingRows; // Возврат первого набора записей
  } catch (err) {
    // Обработка ошибки, если запрос не может быть выполнен
    const err2 = new Error(
      "Something went wrong with that last sql query. View the call stack here and more details in the next error:"
    );
    console.error(err2.message); // Вывод сообщения об ошибке в консоль
    console.log(err2.stack); // Вывод стека вызовов в консоль
    throw err; // Выброс исключения, которое содержит информацию о произошедшей ошибке
  }
};

// Функция pbkdf2 для создания хеша пароля
function pbkdf2(password, salt, iterations) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) {
          // reject the promise so the .catch will fire.
          return reject(err);
        }
        // resolve the promise so the .then will fire.
        resolve(derivedKey.toString("hex"));
      }
    );
  });
}
/**
 * https://stackoverflow.com/a/17201493/2066736
 * @param {string} password
 * @returns {Promise<{salt: string, hash: string, iterations: }>}
 */

// Функция для создания хеша пароля с помощью pbkdf2 и случайной соли
module.exports.hashPassword = async (password) => {
  var salt = crypto.randomBytes(128).toString("base64");
  var iterations = 100000;
  const hash = await pbkdf2(password, salt, iterations);
  return {
    salt: salt,
    hash: hash,
    iterations: iterations,
  };
};
/**
 * https://stackoverflow.com/a/17201493/2066736
 * @param {string} savedHash
 * @param {*} savedSalt
 * @param {*} savedIterations
 * @param {*} passwordAttempt
 */

// Функция для проверки, соответствует ли переданный пароль хешу и соли, сохраненным в базе данных
module.exports.verifyPassword = async function verifyPassword(
  savedHash,
  savedSalt,
  savedIterations,
  passwordAttempt
) {
  return (
    savedHash == (await pbkdf2(passwordAttempt, savedSalt, savedIterations))
  );
};
