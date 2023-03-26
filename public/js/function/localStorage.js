// Экспортируем функцию getItem, которая принимает ключ (key)
export const getItem = (key) => {
  // Получаем данные из localStorage с использованием ключа (key)
  let data = localStorage.getItem(key);

  // Если данные найдены
  if (data) {
    // Возвращаем данные, преобразованные из JSON-строки в объект
    return JSON.parse(data);
  } else {
    // Если данных нет, возвращаем undefined
    return undefined;
  }
};

// Экспортируем функцию setItem, которая принимает ключ (key) и данные (data)
export const setItem = (key, data) => {
  // Сохраняем данные в localStorage, преобразовав их в JSON-строку
  return localStorage.setItem(key, JSON.stringify(data));
};

// Экспортируем функцию removeItem, которая принимает ключ (key)
export const removeItem = (key) => {
  // Удаляем данные из localStorage с использованием ключа (key)
  return localStorage.removeItem(key);
};

/* Этот модуль представляет собой набор функций для работы с localStorage в веб-браузере. Функции позволяют получать, сохранять и удалять данные, используя ключи. 

Все функции экспортируются, чтобы их можно было импортировать и использовать в других частях приложения.

getItem(key): принимает ключ и возвращает данные, сохраненные в localStorage под этим ключом, в виде объекта. Если данных нет, возвращает undefined.

setItem(key, data): принимает ключ и данные, преобразует данные в JSON-строку и сохраняет их в localStorage под заданным ключом.

removeItem(key): принимает ключ и удаляет данные, сохраненные в localStorage под этим ключом. */
