import { randomNumber } from "./extraFunctions.js";

export const handleGetData = async (url) => {
  try {
    let res = await fetch(url);

    res = await res.json();

    res = res.meals;

    const data = res.map((item) => ({
      title: item.strMeal,
      image: item.strMealThumb,
      category: item.strCategory,
      price: item.idMeal - 52950 < 5 ? 10 : item.idMeal - 52950,
      rating: +randomNumber(),
      id: item.idMeal,
    }));

    return data;
  } catch (err) {
    console.log(err);
  }
};

/* Данный модуль экспортирует функцию handleGetData, которая принимает на вход URL-адрес и отправляет GET-запрос с использованием функции fetch для получения данных из этого URL-адреса.

Далее полученный ответ конвертируется в формат JSON с помощью метода json(). Затем из объекта JSON извлекается массив meals с помощью свойства объекта.

После этого, с помощью метода map() для каждого элемента в массиве res создается новый объект с несколькими свойствами: название блюда (title), 

ссылка на изображение блюда (image), категория блюда (category), цена блюда (price), рейтинг блюда (rating) и идентификатор блюда (id).

Цена блюда зависит от идентификатора блюда, который вычисляется как item.idMeal - 52950. Если это значение меньше 5, 

то цена будет равна 10, в противном случае цена будет равна item.idMeal - 52950.

Рейтинг блюда генерируется с помощью функции randomNumber(), которая импортируется из модуля ./extraFunctions.js.

Функция handleGetData возвращает полученный массив данных. Если в процессе выполнения возникнет ошибка, она будет обработана с помощью блока catch и выведена в консоль. */
