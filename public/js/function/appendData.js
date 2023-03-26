// Импортируем функцию shortString из модуля ./extraFunctions.js
import { shortString } from "./extraFunctions.js";

// Импортируем функцию setItem из модуля ./localStorage.js
import { setItem } from "./localStorage.js";

// Экспортируем функцию appendData()
// Она принимает массив товаров (data), родительский элемент для отображения товаров (parent)
// и массив с данными о товарах в корзине (cartData)
export const appendData = (data, parent, cartData) => {
  // Удаляем содержимое родительского элемента parent
  parent.innerHTML = null;

  // Итерируемся по каждому элементу в массиве data
  data.map((item) => {
    // Деструктурируем объект item и получаем из него свойства
    const { title, image, price, category, rating } = item;

    // Создаем контейнеры для отображения товара
    const div = document.createElement("div");
    div.setAttribute("id", "foodDiv");

    const imgDiv = document.createElement("div");
    imgDiv.setAttribute("id", "imgDiv");

    const detailsDiv = document.createElement("div");
    detailsDiv.setAttribute("id", "detailsDiv");

    const btnDiv = document.createElement("div");
    btnDiv.setAttribute("id", "btnDiv");

    // Создаем тег <img> и устанавливаем для него свойство src
    const img = document.createElement("img");
    img.src = image;

    // Создаем тег <p> и добавляем в него название товара (обрезаем до 20 символов)
    const name = document.createElement("p");
    name.textContent = shortString(title, 20).toUpperCase();
    name.style = "font-weight:600; font-size:17px";

    // Создаем тег <p> и добавляем в него категорию товара
    const foodCategory = document.createElement("p");
    foodCategory.textContent = category;
    foodCategory.style = "color:gray; font-size:14px";

    // Создаем тег <p> и добавляем в него цену товара
    const rate = document.createElement("p");
    rate.textContent = `$${price}`;
    rate.style = "color:red; font-weight:600; font-size:22px";

    // Создаем тег <p> и добавляем в него рейтинг товара
    const foodRating = document.createElement("p");
    foodRating.textContent = `Rating: ${rating}`;
    foodRating.style = "color:gray; font-size:14px";

    // Получаем элемент с id="liveToast"
    const toastLiveExample = document.getElementById("liveToast");

    // Создаем кнопку "Add to bag" и добавляем обработчик события клика
    // При клике на кнопку, товар добавляется в массив cartData и сохраняется в localStorage,
    // а затем появляется всплывающее уведомление
    const addToCart = document.createElement("button");
    addToCart.textContent = "Add to bag";
    addToCart.setAttribute("class", "btn btn-outline-success");
    addToCart.addEventListener("click", () => {
      cartData.push(item);
      setItem("cartData", cartData);
      // Создаем новый объект bootstrap.Toast и показываем всплывающее уведомление
      const toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
    });

    // Добавляем изображение и кнопку в imgDiv и btnDiv соответственно
    imgDiv.append(img);
    btnDiv.append(addToCart);

    // Добавляем название, категорию, цену и рейтинг товара в detailsDiv
    detailsDiv.append(name, foodCategory, rate, foodRating);

    // Добавляем imgDiv, detailsDiv и btnDiv в div
    div.append(imgDiv, detailsDiv, btnDiv);

    // Добавляем div в родительский элемент parent
    parent.append(div);
  });
};

/* Этот модуль экспортирует функцию appendData, которая используется для отображения товаров на странице. Функция принимает три аргумента:

массив товаров (data)

родительский элемент для отображения товаров (parent)

массив данных о товарах в корзине (cartData)

Функция проходится по каждому элементу в массиве data, создает контейнеры для отображения товара и добавляет в них изображение, название, категорию, цену, рейтинг и кнопку "Add to bag". 

При нажатии на кнопку товар добавляется в массив cartData и сохраняется в localStorage, а затем появляется всплывающее уведомление.

Для работы функция использует другие функции, импортированные из других модулей:

shortString из модуля ./extraFunctions.js используется для обрезки названия товара до 20 символов.

setItem из модуля ./localStorage.js используется для сохранения данных о товарах в корзине в localStorage. */
