/* Englyx — client-side progressive enhancement.
   Sahifalar server-side ishlaydi; bu fayl shunchaki UX'ni jonlantiradi. */
(function () {
  'use strict';

  /* ---- Daraja tanlash ---- */
  var levelInput = document.querySelector('[data-level-input]');
  document.querySelectorAll('[data-level]').forEach(function (card) {
    card.addEventListener('click', function () {
      document.querySelectorAll('[data-level]').forEach(function (c) {
        c.classList.remove('on');
      });
      card.classList.add('on');
      if (levelInput) levelInput.value = card.getAttribute('data-level');
    });
  });

  /* ---- Maqsad tanlash ---- */
  var goalInput = document.querySelector('[data-goal-input]');
  document.querySelectorAll('[data-goal]').forEach(function (card) {
    card.addEventListener('click', function () {
      document.querySelectorAll('[data-goal]').forEach(function (c) {
        c.classList.remove('on');
      });
      card.classList.add('on');
      if (goalInput) goalInput.value = card.getAttribute('data-goal');
    });
  });

  /* ---- Parolni ko'rsatish/yashirish ---- */
  document.querySelectorAll('[data-eye]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.parentElement.querySelector('[data-pw]');
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  /* ---- Username live-check ---- */
  var userIn = document.querySelector('[data-user]');
  var userTag = document.querySelector('[data-user-tag]');
  if (userIn && userTag) {
    userIn.addEventListener('input', function () {
      var v = userIn.value.replace(/\s/g, '');
      if (userIn.value !== v) userIn.value = v;
      if (!v) {
        userTag.hidden = true;
        return;
      }
      userTag.hidden = false;
      if (v.length >= 3) {
        userTag.classList.remove('warn');
        userTag.lastChild.textContent = ' bo\u2018sh';
        userTag.firstElementChild.style.display = '';
      } else {
        userTag.classList.add('warn');
        userTag.lastChild.textContent = 'qisqa';
        userTag.firstElementChild.style.display = 'none';
      }
      refresh();
    });
  }

  /* ---- Parol kuchi ---- */
  var pwMain = document.querySelector('[data-account-form] [data-pw]');
  var pwTag = document.querySelector('[data-pw-tag]');
  if (pwMain && pwTag) {
    pwMain.addEventListener('input', function () {
      var v = pwMain.value;
      if (!v) {
        pwTag.hidden = true;
        return;
      }
      pwTag.hidden = false;
      var strong = v.length >= 8;
      pwTag.textContent = strong ? 'kuchli' : 'zaif';
      pwTag.classList.toggle('warn', !strong);
      refresh();
    });
  }

  /* ---- Roziman checkbox ---- */
  var agreeWrap = document.querySelector('[data-agree-wrap]');
  var agree = document.querySelector('[data-agree]');
  if (agreeWrap && agree) {
    agreeWrap.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') return;
      e.preventDefault();
      agree.checked = !agree.checked;
      agreeWrap.classList.toggle('on', agree.checked);
      refresh();
    });
  }

  /* ---- Submit tugmasini yoqish/o'chirish ---- */
  var form = document.querySelector('[data-account-form]');
  var submit = document.querySelector('[data-submit]');

  function refresh() {
    if (!form || !submit) return;
    var name = (form.querySelector('[name="name"]') || {}).value || '';
    var email = (form.querySelector('[name="email"]') || {}).value || '';
    var pw = pwMain ? pwMain.value : '';
    var ok = name.trim() && email.indexOf('@') > 0 && pw.length >= 8 && agree && agree.checked;
    submit.disabled = !ok;
    submit.setAttribute('aria-disabled', String(!ok));
  }

  if (form && submit) {
    form.querySelectorAll('input').forEach(function (i) {
      i.addEventListener('input', refresh);
    });
    refresh();
  }
})();
