// Импортируем функции из других модулей
import { getItem } from "../function/localStorage.js";
import { setItem } from "../function/localStorage.js";
import {
  appendCartData,
  appendCartTotal,
  getTotalOrderAmount,
} from "../function/appendCartData.js";
import { notify } from "../components/notify.js";
import { shippingForm } from "../function/shippingForm.js";
import { getCoupon } from "../function/getCoupon.js";

// Слушатель событий DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Получаем элементы страницы
  const display = document.getElementById("display");
  const totalAmount = document.getElementById("totalAmount");
  const notifyDiv1 = document.getElementById("notifyDiv1");
  const notifyDiv2 = document.getElementById("notifyDiv2");
  const form = document.getElementById("form");
  const couponInput = document.getElementById("couponInput");
  const applyCoupon = document.getElementById("applyCoupon");

  // Устанавливаем содержимое notifyDiv1
  notifyDiv1.innerHTML = notify("danger", "Item is removed from the bag");

  // Получаем данные корзины из local storage
  let cartData = getItem("cartData") || [];
  console.log(cartData[0].title); //отладка
  console.log(cartData); //отладка

  // Фильтруем массив cartData, сохраняем только названия товаров
  const items = cartData.map((item) => item.title);

  let myArrayAsString = JSON.stringify(items);
  console.log(items); //отладка

  // Рассчитываем общую стоимость заказа
  getTotalOrderAmount(cartData, totalAmount);

  // Получаем общую стоимость из local storage
  const cartTotal = getItem("cartTotal");

  // Выводим данные корзины и общую стоимость на странице
  appendCartData(cartData, display, totalAmount);
  appendCartTotal(cartTotal, totalAmount);

  console.log(cartTotal.grandTotal); //отладка
  let totelAmount = cartTotal.grandTotal;

  // Заполняем скрытые поля формы
  const totalAmountField = document.getElementById("totalAmountField");
  totalAmountField.value = totelAmount;
  const itemsField = document.getElementById("itemsField");
  itemsField.value = JSON.stringify(items);
  console.log("test" + itemsField.value); //отладка

  // Слушатель событий клика для применения купона
  applyCoupon.addEventListener("click", () => {
    const discountPercent = getCoupon(couponInput.value);
    if (discountPercent) {
      alert(
        `Coupon applied successfully, you got ${discountPercent}% discount`
      );
      getTotalOrderAmount(cartData, totalAmount, discountPercent);
    } else {
      alert(`Invalid coupon code`);
    }
  });

  // Слушатель событий отправки формы
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = shippingForm(form);
    notifyDiv2.innerHTML = notify(
      "info",
      user.isFilled().message,
      "liveToast2"
    );

    const toastLiveExample = document.getElementById("liveToast2");
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();

    if (user.isFilled().status) {
      const formData = new FormData(form);
      console.log("Form data:", formData); //отладка
      // Отправляем форму с данными заказа на сервер
      fetch("/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(new FormData(form)),
      })
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          // Обновляем пользовательский интерфейс после успешной отправки формы
          setItem("cartData", []); // Очищаем корзину после отправки формы заказа
          // Очищаем пользовательский интерфейс корзины
          const cartParent = document.getElementById("cartParent");
          const orderTotalParent = document.getElementById("orderTotalParent");
          appendCartData([], cartParent, orderTotalParent);
          appendCartTotal(
            { total: 0, quantity: 0, shipping: 0, discount: 0, grandTotal: 0 },
            orderTotalParent
          );
          //window.location.href = "/orderPlaced";
        })
        .catch((error) => {
          console.error(error);
          // Обновляем пользовательский интерфейс с сообщением об ошибке
        });
      setTimeout(() => {
        window.location.href = "/orderPlaced";
      }, 2000);
    }
    // setTimeout(() => {
    // window.location.href = "/orderPlaced";
    // }, 5000);
  });
});

/* Этот модуль является обработчиком страницы корзины, который выполняет следующие действия:
1. Получает данные корзины из Local Storage и отображает их на странице.
2. Вычисляет общую стоимость заказа и показывает ее на странице.
3. Применяет купон на заказ, если пользователь вводит действующий код купона.
4. Обрабатывает отправку формы заказа, проверяет заполненность полей и отправляет данные на сервер.
5. После успешной отправки формы очищает корзину и обновляет пользовательский интерфейс корзины.

При успешной отправке формы заказа пользователь перенаправляется на страницу подтверждения заказа. */
