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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las contraseñas no coinciden'
        });
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
          await Swal.fire({
            icon: 'success',
            title: 'Usuario registrado',
            text: 'Usuario registrado con éxito'
          });
          window.location.href = '/OptimizerPC_Front/login/login.html';
        } else {
          const err = await res.json();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error: ' + JSON.stringify(err)
          });
        }
      } catch (error) {
        console.error('Error al registrar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'No se pudo conectar con el servidor'
        });
      }
    });
  }

  // Login
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
          const { token, username, id } = await res.json();
          localStorage.setItem('token', token);
          localStorage.setItem('username', username);
          localStorage.setItem('userId', id);

          // Obtener IP pública para mostrar en el swal
          const ipRes = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipRes.json();
          const ip = ipData.ip || 'IP desconocida';

          await Swal.fire({
            icon: 'success',
            title: 'Sesión iniciada',
            html: `Has iniciado sesión correctamente desde <b>${ip}</b>`,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          });

          if (username === 'admin') {
            window.location.href = '/OptimizerPC_Front/admin.html';
          } else {
            window.location.href = '/OptimizerPC_Front/index.html';
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Credenciales inválidas'
          });
        }
      } catch (err) {
        console.error('Error al hacer login:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'No se pudo conectar con el servidor'
        });
      }
    });
  }

});