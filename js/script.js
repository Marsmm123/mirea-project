"use strict";

// 1. Мобильное меню
function initMenu() {
  const menuBtn = document.querySelector('.menu-button');
  const nav = document.querySelector('.nav');
  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => {
    // Если меню скрыто (пусто или none), показываем его как flex, иначе скрываем
    const isClosed = nav.style.display === '' || nav.style.display === 'none';
    nav.style.display = isClosed ? 'flex' : 'none';
    
    // Для мобильного вида делаем его колонкой
    if (isClosed) {
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '80px';
      nav.style.right = '20px';
      nav.style.background = '#f7f4f0';
      nav.style.padding = '20px';
      nav.style.borderRadius = '12px';
      nav.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }

    // Синхронизация атрибута доступности (требование a11y)
    menuBtn.setAttribute('aria-expanded', isClosed);
  });
}

// 2. Вкладки (Табы)
function initTabs() {
  const tabsContainer = document.querySelector('[data-js="tabs"]');
  if (!tabsContainer) return;
  
  const buttons = tabsContainer.querySelectorAll('.tabs-placeholder button');
  const cards = tabsContainer.querySelectorAll('.project-card');

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // Сбрасываем активный класс у всех кнопок
      buttons.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      // Добавляем активный класс нажатой кнопке
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      // Скрываем все карточки и показываем нужную
      cards.forEach(card => card.style.display = 'none');
      if (cards[index]) {
        cards[index].style.display = 'flex';
      } else {
        cards[0].style.display = 'flex';
      }
    });
  });
  // Эмулируем клик по первой вкладке при старте страницы
  if (buttons.length > 0) {
    buttons[0].click();
  }
}

// 3. Аккордеон (Часто задаваемые вопросы)
function initAccordion() {
  const accordion = document.querySelector('[data-js="accordion"]');
  if (!accordion) return;
  const items = accordion.querySelectorAll('.faq-item');

  items.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('p');
    const icon = item.querySelector('.faq-icon');

    // Устанавливаем базовые aria-атрибуты
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', item.classList.contains('is-open'));

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Закрываем все пункты (чтобы одновременно был открыт только один)
      items.forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('p').hidden = true;
        i.querySelector('.faq-icon').textContent = '+';
        i.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
      });

      // Если кликнули по закрытому, открываем его
      if (!isOpen) {
        item.classList.add('is-open');
        content.hidden = false;
        icon.textContent = '✕';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// 4. Слайдер
function initSlider() {
  const slider = document.querySelector('[data-js="slider"]');
  if (!slider) return;
  
  const prevBtn = slider.querySelectorAll('.slider-arrow')[0];
  const nextBtn = slider.querySelectorAll('.slider-arrow')[1];
  const img = slider.querySelector('.slider-img');
  const text = slider.querySelector('.slider-content p');
  
  // Создаем счетчик слайдов и добавляем его в HTML
  const counter = document.createElement('div');
  counter.classList.add('slider-counter'); // Подключаем CSS-класс
  text.parentElement.appendChild(counter);

  // Данные для слайдов
  const slides = [
    { src: 'news.png', desc: 'Выпускник Детского технопарка «Альтаир» РТУ МИРЭА создал мессенджер «МыС»...' },
    { src: 'волонтёры.jpg', desc: 'Бакалавры РТУ МИРЭА оказали волонтёрскую поддержку Приокско-Террасному государственному природному биосферному заповеднику, расположенному на террасах левого берега реки Оки, в городском округе Серпухов Московской области.' },
    { src: 'кино.jpg', desc: '5 ноября состоялся кинопоказ от лейбла RME РТУ МИРЭА! Команда представила премьеру короткометражного фильма «Становление», посвящённого выбору между привычной повседневностью и стремлением изменить свою жизнь.' }
  ];
  let currentIndex = 0;

  function updateSlide() {
    img.src = slides[currentIndex].src;
    text.textContent = slides[currentIndex].desc;
    counter.textContent = `${currentIndex + 1} / ${slides.length}`;
  }

  prevBtn.addEventListener('click', () => {
    // Если слайд первый, переходим на последний (цикличность)
    currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
    updateSlide();
  });

  nextBtn.addEventListener('click', () => {
    // Если слайд последний, переходим на первый (цикличность)
    currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
    updateSlide();
  });

  updateSlide(); // Показываем первый слайд при загрузке
}

// 5. Модальное окно и Валидация Формы
function initModalAndForm() {
  const modal = document.querySelector('[data-js="modal"]');
  const openBtn = document.querySelector('[data-js="login-btn"]');
  const closeBtn = document.querySelector('[data-js="modal-close"]');
  const form = document.querySelector('[data-js="form"]');
  if (!modal || !openBtn || !closeBtn || !form) return;

  // Открытие модального окна
  openBtn.addEventListener('click', () => {
    modal.showModal();
  });

  // Закрытие по кнопке-крестику с возвратом фокуса
  closeBtn.addEventListener('click', () => {
    modal.close();
    openBtn.focus();
  });

  // Закрытие по клику на темный фон позади окна
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close();
      openBtn.focus();
    }
  });

  // Валидация формы
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Отменяем стандартную перезагрузку страницы

    const nameInput = form.querySelector('#userName');
    const emailInput = form.querySelector('#userEmail');
    const consentInput = form.querySelector('#userConsent');
    const successMsg = form.querySelector('.success-message');
    let isValid = true;

    // Проверка имени (не пустое, удаляем лишние пробелы trim)
    if (nameInput.value.trim() === '') {
      nameInput.parentElement.classList.add('has-error');
      isValid = false;
    } else {
      nameInput.parentElement.classList.remove('has-error');
    }

    // Проверка Email (простейшее регулярное выражение)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      emailInput.parentElement.classList.add('has-error');
      isValid = false;
    } else {
      emailInput.parentElement.classList.remove('has-error');
    }

    // Проверка чекбокса согласия (checked)
    if (!consentInput.checked) {
      consentInput.parentElement.classList.add('has-error');
      isValid = false;
    } else {
      consentInput.parentElement.classList.remove('has-error');
    }

    // Если всё верно — показываем успех и закрываем окно
    if (isValid) {
      successMsg.hidden = false;
      form.reset(); // Очищаем поля
      setTimeout(() => {
        modal.close();
        successMsg.hidden = true;
        openBtn.focus();
      }, 2000); // Окно закроется само через 2 секунды
    }
  });
}

// 6. Уведомление о Cookies
function initCookies() {
  const notice = document.querySelector('[data-js="cookie-notice"]');
  const btn = document.querySelector('[data-js="cookie-btn"]');
  if (!notice || !btn) return;

  btn.addEventListener('click', () => {
    notice.style.display = 'none'; // Скрываем плашку навсегда
  });
}

// 7. Обновление диагностики в подвале
function updateDiagnostics() {
  const status = document.querySelector("[data-js-status]");
  if (status) {
    status.textContent = "Интерактивность (JS) успешно подключена и работает!";
    status.classList.add("status--ready");
  }
}

// Запускаем все функции только после того, как HTML полностью загрузился
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initTabs();
  initAccordion();
  initSlider();
  initModalAndForm();
  initCookies();
  updateDiagnostics();
});