// Экспортируем функцию shippingForm, которая принимает форму (form) в качестве аргумента
export const shippingForm = (form) => {
  // Создаем класс UserForm
  class UserForm {
    // Конструктор класса инициализирует свойства объекта на основе значений полей формы
    constructor() {
      this.name = form.name.value;
      this.email = form.email.value;
      this.mobile = form.mobile.value;
      this.street = form.street.value;
      this.city = form.city.value;
      this.state = form.state.value;
      this.pincode = form.pincode.value;
    }

    // Метод isFilled проверяет, корректно ли заполнена форма
    isFilled() {
      if (this.name.length < 2) {
        return {
          message: "Please fill your name",
          status: false,
        };
      } else if (this.email.length < 2) {
        return {
          message: "Please fill your valid email",
          status: false,
        };
      } else if (!this.street && !this.city && !this.state) {
        return {
          message: "Please fill your address",
          status: false,
        };
      } else if (this.pincode.length !== 6) {
        return {
          message: "Please enter 6 digit pincode",
          status: false,
        };
      } else {
        return {
          message: "Order placed",
          status: true,
        };
      }
    }
  }
  // Возвращаем новый экземпляр класса UserForm
  return new UserForm();
};

/* Этот модуль представляет собой функцию shippingForm, которая принимает аргументом форму и создает класс UserForm. 

Класс UserForm используется для проверки правильности заполнения формы отправки товара. Конструктор класса инициализирует свойства объекта на основе значений полей формы.

В классе имеется метод isFilled(), который проверяет корректность заполнения формы. Если форма заполнена некорректно, метод возвращает объект с сообщением об ошибке и статусом false. 

Если форма заполнена корректно, метод возвращает объект с сообщением о размещении заказа и статусом true.

Функция shippingForm возвращает новый экземпляр класса UserForm, который можно использовать для проверки корректности заполнения формы отправки товара. */
