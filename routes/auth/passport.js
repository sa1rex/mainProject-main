// Импорт утилит
const { verifyPassword, hashPassword } = require("../utils/utils.js");
const { sqlFetch } = require("../utils/utils.js");

// Импорт локальной стратегии Passport
var LocalStrategy = require("passport-local").Strategy;

// Функция поиска пользователя по электронной почте
async function findByEmail(email) {
  const users = await sqlFetch`SELECT * From users WHERE email = ${email}`;
  const user = users[0];
  return user;
}

// Функция сохранения нового пользователя
async function saveUser({ email, hash, salt, iterations, displayName }) {
  const users = await sqlFetch`
		INSERT INTO users
			( [email], [hash], [salt], [iterations], [displayName], [isAdmin] )
		VALUES
			( ${email}, ${hash}, ${salt}, ${iterations}, ${displayName}, ${false} )
		SELECT id FROM users WHERE ID = @@IDENTITY`;
  const user = users[0];
  return user;
}

// Экспорт функции для работы с Passport
module.exports = function (passport) {
  // Сериализация пользователя
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Десериализация пользователя
  passport.deserializeUser(async function (id, done) {
    try {
      const users = await sqlFetch`SELECT * From users WHERE id = ${id}`;
      const user = users[0];
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Регистрация пользователя с использованием Passport
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        // Проверка пароля и подтверждения пароля
        if (req.body.password !== req.body.passwordConfirmation) {
          done(
            null,
            false,
            req.flash(
              "signupMessage",
              "The password and confirmation do not match."
            )
          );
        }

        // Проверка наличия имени пользователя
        if (!req.body.displayName || req.body.displayName.length <= 0) {
          done(
            null,
            false,
            req.flash("signupMessage", "The display name must be provided.")
          );
        }

        // Поиск пользователя с таким же адресом электронной почты
        const user = await findByEmail(email);

        // Если пользователь с таким адресом электронной почты уже существует
        if (user) {
          return done(
            null,
            false,
            req.flash("signupMessage", "That email is already taken.")
          );
        } else {
          // Если пользователь с таким адресом электронной почты не найден, создаем нового пользователя
          const { hash, salt, iterations } = await hashPassword(password);
          var newUser = await saveUser({
            email,
            hash,
            salt,
            iterations,
            displayName: req.body.displayName,
          });

          return done(null, newUser);
        }
      }
    )
  );

  // Аутентификация пользователя с использованием Passport
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",

        passwordField: "password",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        // Получение пользователя по адресу электронной почты
        const user = await findByEmail(email);

        // Если пользователь не найден, возвращаем сообщение
        if (!user)
          return done(
            null,
            false,
            req.flash("loginMessage", "No user found with that email.")
          );

        // Если пользователь найден, но пароль неверный
        if (
          !(await verifyPassword(
            user.hash,
            user.salt,
            user.iterations,
            password
          ))
        )
          return done(
            null,
            false,
            req.flash("loginMessage", "Oops! Wrong password.")
          );

        // Все в порядке, возвращаем успешного пользователя
        return done(null, user);
      }
    )
  );
};

/*   
Passport это middleware для Node.js который используется для регистрации и аутентификации пользователей.(более подробно https://www.passportjs.org/)

В нем определены функции для поиска пользователя по адресу электронной почты и сохранения нового пользователя, а также сериализация и десериализация пользователей.

Passport использует стратегию "local-signup" для регистрации новых пользователей, 

а стратегия "local-login" используется для аутентификации существующих пользователей. 

В процессе регистрации производится проверка совпадения пароля и подтверждения пароля, а также наличия имени пользователя. 

В процессе аутентификации выполняется проверка наличия пользователя с указанным адресом электронной почты и проверка корректности пароля. */
