export const notify = (type, text, id = "liveToast") => {
  return `<div class="position-fixed bottom-0 end-0 p-3 " style="z-index: 11">
            <div id=${id} class="toast text-white bg-${type}" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                    ${text}
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>`;
};

/* Этот модуль экспортирует функцию notify, которая принимает три аргумента: тип уведомления (type), текст уведомления (text) и необязательный идентификатор (id) для элемента div уведомления.
Функция notify возвращает HTML-код, который создает плавающее уведомление (toast) с помощью компонента Bootstrap. Этот код включает div-контейнер, 
который размещает уведомление в правом нижнем углу экрана (position-fixed bottom-0 end-0), 
а также toast-элемент, который содержит текст уведомления и кнопку закрытия.
Цвет фона уведомления (bg-${type}) зависит от типа, переданного в качестве аргумента type. Если значение id не передано, то по умолчанию устанавливается значение liveToast. */
