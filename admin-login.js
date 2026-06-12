(function () {
  const sessionKey = window.PORTFOLIO_ADMIN_SESSION_KEY;
  const password = window.PORTFOLIO_ADMIN_PASSWORD;
  const passwordInput = document.getElementById('admin-password');
  const loginButton = document.getElementById('login-button');

  if (sessionStorage.getItem(sessionKey) === 'true') {
    window.location.href = './editor.html';
    return;
  }

  function login() {
    if (passwordInput.value === password) {
      sessionStorage.setItem(sessionKey, 'true');
      window.location.href = './editor.html';
      return;
    }
    alert('비밀번호가 올바르지 않습니다.');
  }

  loginButton.addEventListener('click', login);
  passwordInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') login();
  });
})();
