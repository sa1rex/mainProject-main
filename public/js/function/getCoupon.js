const couponCodes = {
  FOODSTORE5: 5,
  FOODSTORE10: 10,
  FOODSTORE15: 15,
  FOODSTORE20: 20,
  FOODSTORE25: 25,
  FOODSTORE30: 30,
};

export const getCoupon = (coupon) => {
  return couponCodes[coupon];
};

/* Данный модуль экспортирует функцию getCoupon, 

которая принимает на вход строку coupon и возвращает соответствующее значение из объекта couponCodes.

В объекте couponCodes определены свойства, каждое из которых представляет собой уникальный купон-код и его стоимость в процентах. 

Например, купон FOODSTORE5 дает скидку в 5%, а FOODSTORE30 - в 30%.

Функция getCoupon использует переданный ей аргумент coupon как ключ для доступа к соответствующему значению из объекта couponCodes. Если переданный ключ не существует в объекте, функция вернет значение undefined. */
