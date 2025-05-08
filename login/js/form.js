// form.js

document.addEventListener('DOMContentLoaded', () => {

    // 1) Toggle entre login ↔ registro
    $('.alt-form').click(function() {
      $('.form-content').animate({
        height: 'toggle',
        opacity: 'toggle'
      }, 600);
    });
  
    // 2) Validación de blur para todos los inputs con la clase .form-input
    document.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', function() {
        const label = this.nextElementSibling;
        if (this.value.trim().length > 0) {
          label.classList.add('active');
          label.classList.remove('error');
        } else {
          label.classList.add('error');
          label.classList.remove('active');
        }
      });
    });
  
    // 3) Envío del formulario de registro
    const formRegister = document.getElementById('form-register');
    if (formRegister) {
      formRegister.addEventListener('submit', async function(e) {
        e.preventDefault();
  
        const pass = document.getElementById('reg-pass').value;
        const rep  = document.getElementById('reg-rep-pass').value;
        if (pass !== rep) {
          alert('Las contraseñas no coinciden');
          return;
        }
  
        const payload = {
          name:     document.getElementById('reg-name').value.trim(),
          email:    document.getElementById('reg-email').value.trim(),
          username: document.getElementById('reg-user').value.trim(),
          password: pass
        };
  
        try {
          const res = await fetch('https://optimizerpcback-production.up.railway.app/v0/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
  
          if (res.status === 201) {
            alert('Usuario registrado con éxito');
            window.location.href = '/OptimizerPC_Front/login/login.html';
          } else {
            const err = await res.json();
            alert('Error: ' + JSON.stringify(err));
          }
        } catch (error) {
          console.error('Error al registrar:', error);
          alert('Error de red');
        }
      });
    }
  
    // 4) Envío del formulario de login
    // (Tu login no tiene id en el form, le ponemos uno para engancharlo)
    const formLogin = document.querySelector('form.cod-form');
    if (formLogin && !formLogin.id) {
      formLogin.setAttribute('id', 'form-login');
    }
    const loginEl = document.getElementById('form-login');
    if (loginEl) {
      loginEl.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email    = document.getElementById('correo').value.trim();
        const password = document.getElementById('pass').value;
  
        try {
          const res = await fetch('https://optimizerpcback-production.up.railway.app/v0/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password })
          });
  
          if (res.ok) {
            const { token } = await res.json();
            localStorage.setItem('token', token);
            window.location.href = '/OptimizerPC_Front/index.html';
          } else {
            alert('Credenciales inválidas');
          }
        } catch (err) {
          console.error('Error al hacer login:', err);
          alert('Error de red');
        }
      });
    }
  
  });
  