document.addEventListener('DOMContentLoaded', () => {
  // 1. Captura de elementos del DOM
  const form = document.getElementById('formularioRegistro');
  const alertaEstado = document.getElementById('alertaEstado');
  const inputNombre = document.getElementById('nombre');
  const inputCorreo = document.getElementById('correo');
  const inputTelefono = document.getElementById('telefono');
  const selectPrograma = document.getElementById('programa');
  const checkTerminos = document.getElementById('terminos');
  const botonesSeleccion = document.querySelectorAll('.select-programa-btn');

  // 2. Conectar los botones del catálogo con el menú desplegable del formulario
  botonesSeleccion.forEach(boton => {
    boton.addEventListener('click', () => {
      const carrera = boton.getAttribute('data-carrera');
      if (carrera && selectPrograma) {
        selectPrograma.value = carrera;
        selectPrograma.classList.remove('is-invalid');
        selectPrograma.classList.add('is-valid');
      }
    });
  });

  // 3. Limpiar advertencias en tiempo real con el evento 'input'
  const inputsTexto = [inputNombre, inputCorreo, inputTelefono];
  inputsTexto.forEach(input => {
    input.addEventListener('input', () => {
      input.setCustomValidity(''); // Limpia el error personalizado nativo
      if (input.checkValidity()) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      } else {
        input.classList.remove('is-valid');
      }
    });
  });

  // Limpiar select y checkbox en evento 'change'
  selectPrograma.addEventListener('change', () => {
    if (selectPrograma.value) {
      selectPrograma.classList.remove('is-invalid');
      selectPrograma.classList.add('is-valid');
    }
  });

  checkTerminos.addEventListener('change', () => {
    if (checkTerminos.checked) {
      checkTerminos.classList.remove('is-invalid');
      checkTerminos.classList.add('is-valid');
    }
  });

  // 4. Interceptar y procesar el envío del formulario con 'submit'
  form.addEventListener('submit', (evento) => {
    // Detener el comportamiento predeterminado del navegador (evitar recarga completa)
    evento.preventDefault();

    let esValido = true;
    alertaEstado.innerHTML = ''; // Limpiar mensajes anteriores

    // Validación manual de campos
    // Nombre: al menos 3 caracteres
    if (inputNombre.value.trim().length < 3) {
      inputNombre.classList.add('is-invalid');
      esValido = false;
    } else {
      inputNombre.classList.remove('is-invalid');
      inputNombre.classList.add('is-valid');
    }

    // Correo: verificación de formato con Regex
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(inputCorreo.value.trim())) {
      inputCorreo.classList.add('is-invalid');
      esValido = false;
    } else {
      inputCorreo.classList.remove('is-invalid');
      inputCorreo.classList.add('is-valid');
    }

    // Teléfono: exactamente 9 dígitos numéricos
    const regexTel = /^[0-9]{9}$/;
    if (!regexTel.test(inputTelefono.value.trim())) {
      inputTelefono.classList.add('is-invalid');
      esValido = false;
    } else {
      inputTelefono.classList.remove('is-invalid');
      inputTelefono.classList.add('is-valid');
    }

    // Selección de programa
    if (!selectPrograma.value) {
      selectPrograma.classList.add('is-invalid');
      esValido = false;
    } else {
      selectPrograma.classList.remove('is-invalid');
      selectPrograma.classList.add('is-valid');
    }

    // Checkbox de términos
    if (!checkTerminos.checked) {
      checkTerminos.classList.add('is-invalid');
      esValido = false;
    } else {
      checkTerminos.classList.remove('is-invalid');
      checkTerminos.classList.add('is-valid');
    }

    // Si algún campo falló, mostrar alerta de advertencia en el DOM
    if (!esValido) {
      alertaEstado.innerHTML = `
        <div class="alert alert-danger d-flex align-items-center gap-2 p-3 rounded-3 shadow-sm" role="alert">
          <span class="fs-5">⚠️</span>
          <div class="small">
            <strong>Atención:</strong> Por favor, corrige los campos marcados en rojo antes de enviar.
          </div>
        </div>
      `;
      return;
    }

    // Simulación del envío de datos mediante método POST asíncrono
    const datosRegistro = {
      nombre: inputNombre.value.trim(),
      correo: inputCorreo.value.trim(),
      telefono: inputTelefono.value.trim(),
      programa: selectPrograma.value,
      fechaEnvio: new Date().toISOString()
    };

    console.log("Simulando envío POST hacia el servidor...", datosRegistro);

    // Animación de botón procesando
    const botonSubmit = form.querySelector('button[type="submit"]');
    const textoOriginalBoton = botonSubmit.innerHTML;
    botonSubmit.disabled = true;
    botonSubmit.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span>Procesando inscripción...</span>
    `;

    setTimeout(() => {
      // Renderizar mensaje de éxito en el DOM
      alertaEstado.innerHTML = `
        <div class="alert alert-success d-flex align-items-start gap-3 p-3 rounded-3 shadow-sm" role="alert">
          <span class="fs-4">✅</span>
          <div class="small">
            <h6 class="fw-bold mb-1">¡Registro completado con éxito!</h6>
            <p class="mb-0 text-secondary">
              Gracias <strong>${datosRegistro.nombre}</strong>. Hemos recibido tu solicitud para el programa 
              <strong>${selectPrograma.options[selectPrograma.selectedIndex].text}</strong>. 
              Un asesor de admisiones te contactará a <strong>${datosRegistro.correo}</strong>.
            </p>
          </div>
        </div>
      `;

      // Restablecer formulario y clases de validación
      form.reset();
      [inputNombre, inputCorreo, inputTelefono, selectPrograma, checkTerminos].forEach(elem => {
        elem.classList.remove('is-valid');
        elem.classList.remove('is-invalid');
      });

      botonSubmit.disabled = false;
      botonSubmit.innerHTML = textoOriginalBoton;
    }, 900);
  });
});