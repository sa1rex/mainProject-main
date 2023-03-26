// Импорт необходимых функций и компонентов
import { notify } from "../components/notify.js";
import { appendData } from "../function/appendData.js";
import { handleGetData } from "../function/handleGetRequest.js";
import { getItem, setItem } from "../function/localStorage.js";
import { showTotal } from "../function/showTotal.js";

const display = document.getElementById("display");
const totalFood = document.getElementById("totalFood");
const notifyDiv = document.getElementById("notifyDiv");
const trendingBtn = document.getElementsByName("trendingBtn");

// Отображение уведомления о добавлении товара в корзину
notifyDiv.innerHTML = notify("success", "Item is added to the bag");

// Добавление слушателей событий для кнопок "trending"
for (let btn of trendingBtn) {
  btn.addEventListener("click", () => {
    displayFoodItem(btn.value);
  });
}

// Функция для отображения списка продуктов на основе поискового запроса
async function displayFoodItem(name = "b") {
  const DISH_URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`; // API

  let dishData = await handleGetData(DISH_URL);
  setItem("trending", dishData);
  let cartData = getItem("cartData") || [];

  // Отображение данных на странице
  appendData(dishData, display, cartData);

  // Отображение общего количества продуктов
  showTotal(dishData, totalFood);

  // Сортировка продуктов по возрастанию цены
  document.getElementById("sortLH").addEventListener("click", () => {
    dishData.sort((a, b) => a.price - b.price);
    appendData(dishData, display);
  });

  // Сортировка продуктов по убыванию цены
  document.getElementById("sortHL").addEventListener("click", () => {
    dishData.sort((a, b) => b.price - a.price);
    appendData(dishData, display);
  });

  // Сортировка продуктов по возрастанию рейтинга
  document.getElementById("ratingLH").addEventListener("click", () => {
    dishData.sort((a, b) => a.rating - b.rating);
    appendData(dishData, display);
  });

  // Сортировка продуктов по убыванию рейтинга
  document.getElementById("ratingHL").addEventListener("click", () => {
    dishData.sort((a, b) => b.rating - a.rating);
    appendData(dishData, display);
  });

  // Сброс сортировки продуктов
  document.getElementById("reset").addEventListener("click", () => {
    dishData = getItem("trending");
    appendData(dishData, display, cartData);
  });
}

// Отображение продуктов по умолчанию
displayFoodItem();

/* Этот модуль отвечает за отображение списка продуктов на основе поискового запроса и предоставляет возможность сортировки продуктов по цене и рейтингу. 
Вначале происходит импорт необходимых функций и компонентов, а затем добавление слушателей событий */
