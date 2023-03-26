import { searchImage } from "../components/searchImage.js";
import { appendData } from "../function/appendData.js";
import { handleGetData } from "../function/handleGetRequest.js";
import { getItem } from "../function/localStorage.js";

// Функция, которая будет вызвана при загрузке документа
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const foodName = document.getElementById("foodName");
  let cartData = getItem("cartData") || [];
  let timerId;

  // Событие 'input' на элементе foodName
  foodName.addEventListener("input", () => {
    debounce(1500);
  });

  // Асинхронная функция для отображения результатов поиска
  async function displaySearchFood() {
    const name = foodName.value;

    if (name.length < 1) return false;

    const URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`; // API

    const data = await handleGetData(URL);

    searchPic.innerHTML = null;

    appendData(data, display, cartData);
  }

  // Функция задержки (debounce) для обработки запросов
  function debounce(delay) {
    if (timerId) {
      clearInterval(timerId);
    }

    timerId = setTimeout(() => {
      displaySearchFood();
    }, delay);
  }

  const searchPic = document.getElementById("searchPic");
  searchPic.innerHTML = searchImage();
});

/* Этот модуль выполняет следующие действия:

Импортирует необходимые функции и компоненты.

При загрузке документа получает ссылки на элементы с ID "display", "foodName" и "searchPic".

Создает слушатель события "input" на элементе foodName, который вызывает функцию debounce для задержки перед отправкой запроса на поиск.

Реализует асинхронную функцию displaySearchFood, которая отправляет запрос на поиск блюда по введенному тексту и обновляет содержимое элемента display с результатами поиска.

Реализует функцию debounce, которая откладывает выполнение функции на определенное время, чтобы предотвратить множественные запросы при вводе текста.

Вставляет изображение для поиска в элемент с ID "searchPic". */

/* const URL = https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;` - это строка кода, которая создает константу URL, содержащую адрес API-запроса.

В данном случае, URL состоит из базового адреса API (https://www.themealdb.com/api/json/v1/1/search.php), а также параметра запроса s, 

который используется для передачи значения переменной name. Значение name вставляется в URL с помощью шаблонной строки (template string) - это строка, заключенная в обратные кавычки (`), 

которая позволяет включать выражения внутри строки с использованием фигурных скобок и знака доллара (${expression}).

В данном контексте, name представляет собой поисковый запрос пользователя. API, используемый в этом примере, предоставляет данные о рецептах блюд. 

Запрос отправляется на сервер, который возвращает информацию о блюдах, соответствующих введенному запросу. */
