import { shortString, numberWithCommas } from "./extraFunctions.js";
import { setItem } from "./localStorage.js";

// Экспортируем функцию appendCartData()
// Она принимает массив товаров (data), родительский элемент для отображения товаров в корзине (parent),
// и родительский элемент для отображения общей стоимости заказа (orderTotalParent)
export const appendCartData = (data, parent, orderTotalParent) => {
  // Удаляем содержимое родительского элемента parent
  parent.innerHTML = null;

  // Перебираем каждый товар в массиве data и создаем для него элементы DOM
  data.map((item, index) => {
    // Разбиваем объект товара на свойства - название, изображение и цену
    const { title, image, price } = item;

    // Создаем контейнер для товара
    const div = document.createElement("div");
    div.setAttribute("id", "foodDiv");

    // Создаем контейнер для изображения товара
    const imgDiv = document.createElement("div");
    imgDiv.setAttribute("id", "imgDiv");

    // Создаем контейнер для информации о товаре
    const detailsDiv = document.createElement("div");
    detailsDiv.setAttribute("id", "cartDetailsDiv");

    // Создаем контейнер для кнопки "Удалить"
    const btnDiv = document.createElement("div");
    btnDiv.setAttribute("id", "btnDiv");

    // Создаем элемент <img> для изображения товара
    const img = document.createElement("img");
    img.src = image;

    // Создаем элемент <p> для названия товара
    const name = document.createElement("p");
    name.textContent = shortString(title, 20).toUpperCase();
    name.style = "font-weight:600; font-size:17px";

    // Создаем элемент <p> для цены товара
    const rate = document.createElement("p");
    rate.textContent = `$${price}`;
    rate.style = "color:red; font-weight:600; font-size:22px";

    // Находим элемент в DOM с id "liveToast"
    const toastLiveExample = document.getElementById("liveToast");

    // Создаем кнопку "Удалить"
    const removeFromCart = document.createElement("button");
    removeFromCart.textContent = "Remove";
    removeFromCart.setAttribute("class", "btn btn-outline-danger");

    // Добавляем обработчик событий на кнопку "Удалить"
    removeFromCart.addEventListener("click", () => {
      // Удаляем выбранный товар из массива data
      data.splice(index, 1);
      // Обновляем данные корзины в localStorage
      setItem("cartData", data);

      // Обновляем количество каждого товара в localStorage
      let quantities = data.reduce((quantities, item) => {
        quantities[item.id] = item.quantity;
        return quantities;
      }, {});
      setItem("itemQuantities", quantities);

      // Обновляем значения скрытых полей формы
      let items = data.map((item) => item.title);
      let myArrayAsString = JSON.stringify(items);
      const itemsField = document.getElementById("itemsField");
      itemsField.value = myArrayAsString;

      // Показываем уведомление об удалении товара
      const toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
      // Обновляем отображение корзины
      appendCartData(data, parent, orderTotalParent);
      // Обновляем общую стоимость заказа
      getTotalOrderAmount(data, orderTotalParent);
    });

    // Добавляем элементы в соответствующие контейнеры
    imgDiv.append(img);
    btnDiv.append(removeFromCart);
    detailsDiv.append(name, rate);

    // Добавляем контейнеры в контейнер товара
    div.append(imgDiv, detailsDiv, btnDiv);

    // Добавляем контейнер товара в родительский элемент
    parent.append(div);
  });
};
// Экспортируем функцию getTotalOrderAmount()
// Она принимает массив товаров (data), родительский элемент для отображения общей стоимости заказа (parent),
// и процент скидки (discountPercent), равный 0 по умолчанию
export const getTotalOrderAmount = (data, parent, discountPercent = 0) => {
  // Считаем общую стоимость товаров в корзине
  const total = data.map((e) => e.price).reduce((prev, curr) => prev + curr, 0);

  // Считаем количество товаров в корзине
  const quantity = data.length;

  // Рассчитываем стоимость доставки в зависимости от общей стоимости и количества товаров
  const shipping = total < 999 && quantity > 0 ? 20 : 0;

  // Рассчитываем сумму скидки
  const discount = Math.floor(total * (discountPercent / 100));

  // Рассчитываем итоговую стоимость заказа
  const grandTotal = total + shipping - discount;

  // Создаем объект, содержащий информацию о стоимости заказа
  const cartTotal = { total, quantity, shipping, discount, grandTotal };

  // Обновляем данные корзины в localStorage
  setItem("cartTotal", cartTotal);

  // Отображаем информацию о стоимости заказа
  appendCartTotal(cartTotal, parent);
};

// Экспортируем функцию appendCartTotal()
// Она принимает объект с информацией о стоимости заказа (cartTotal) и родительский элемент для отображения этой информации (parent)
export const appendCartTotal = (
  { total, quantity, shipping, discount, grandTotal },
  parent
) => {
  // Удаляем содержимое родительского элемента parent
  parent.innerHTML = null;

  // Создаем контейнеры для отображения информации о стоимости заказа
  const cartDiv1 = document.createElement("div");
  const cartTotal1 = document.createElement("p");
  cartTotal1.innerText = `Food Cost:`;
  const cartTotal2 = document.createElement("p");
  cartTotal2.innerText = `$${numberWithCommas(total)}`;
  cartDiv1.append(cartTotal1, cartTotal2);
  cartDiv1.setAttribute("class", "cartFontDiv");

  const cartDiv2 = document.createElement("div");
  const cartQuantity1 = document.createElement("p");
  cartQuantity1.innerText = `Food Items:`;
  const cartQuantity2 = document.createElement("p");
  cartQuantity2.innerText = `${quantity}`;
  cartDiv2.append(cartQuantity1, cartQuantity2);
  cartDiv2.setAttribute("class", "cartFontDiv");

  const cartDiv3 = document.createElement("div");
  const shippingCharges1 = document.createElement("p");
  shippingCharges1.innerText = `Shipping charge:`;
  const shippingCharges2 = document.createElement("p");
  shippingCharges2.innerText = `$${shipping}`;
  cartDiv3.append(shippingCharges1, shippingCharges2);
  cartDiv3.setAttribute("class", "cartFontDiv");

  const cartDiv4 = document.createElement("div");
  const discountTotal1 = document.createElement("p");
  discountTotal1.innerText = `Discount:`;
  const discountTotal2 = document.createElement("p");
  discountTotal2.innerText = `$${numberWithCommas(discount)}`;
  cartDiv4.append(discountTotal1, discountTotal2);
  cartDiv4.setAttribute("class", "cartFontDiv");

  const cartDiv5 = document.createElement("div");
  const finalTotal1 = document.createElement("p");
  finalTotal1.innerText = `Grand Total:`;
  const finalTotal2 = document.createElement("p");
  finalTotal2.innerText = `$${numberWithCommas(grandTotal)}`;
  cartDiv5.append(finalTotal1, finalTotal2);
  cartDiv5.setAttribute("class", "cartFontDiv");

  // Добавляем контейнеры с информацией о стоимости заказа в родительский элемент
  parent.append(cartDiv1, cartDiv2, cartDiv3, cartDiv4, cartDiv5);
};

/* Этот модуль экспортирует несколько функций, которые используются для отображения информации о товарах в корзине и рассчета общей стоимости заказа.

Функция appendCartData принимает массив товаров, родительский элемент для отображения товаров в корзине и родительский элемент для отображения общей стоимости заказа. 

Она создает элементы DOM для каждого товара в массиве и добавляет их в родительский элемент для отображения товаров.

Функция также добавляет обработчик событий на кнопку "Удалить" для каждого товара, который удаляет выбранный товар из массива data, обновляет данные корзины в localStorage, 

отображает уведомление об удалении товара, обновляет отображение корзины и общую стоимость заказа.

Функция getTotalOrderAmount принимает массив товаров, родительский элемент для отображения общей стоимости заказа и процент скидки (равный 0 по умолчанию) 

и рассчитывает общую стоимость товаров в корзине, количество товаров в корзине, стоимость доставки, сумму скидки и итоговую стоимость заказа. 

Функция сохраняет эту информацию в localStorage и отображает ее в родительском элементе.

Функция appendCartTotal принимает объект с информацией о стоимости заказа и родительский элемент для отображения этой информации. 

Она создает элементы DOM для отображения информации о стоимости заказа и добавляет их в родительский элемент.

Модуль также импортирует две функции из других модулей: shortString и numberWithCommas. */
