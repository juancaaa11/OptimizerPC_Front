fetch("https://optimizerpcback-production.up.railway.app/v0/auth/check", {
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
})
.then(response => {
    if (!response.ok) {
        window.location.href = "/OptimizerPC_Front/login/login.html";
        throw new Error("No autorizado");
    }
    return response.json();
})
.then(data => {
    if (!data.authenticated) {
        window.location.href = "/OptimizerPC_Front/login/login.html";
        return;
    }

    const username = localStorage.getItem("username");
    if (!username || username.toLowerCase() !== "admin") {
        window.location.href = "/OptimizerPC_Front/login/login.html";
        return;
    }

    console.log("Usuario autenticado y autorizado como admin:", data);
    // Aquí continúa tu lógica para usuarios admin
})
.catch(error => {
    console.error("Error en autenticación:", error);
});


fetch("https://optimizerpcback-production.up.railway.app/v0/s/categories")
    .then(response => response.json())
    .then(data => {
        categories = data;
        const checkboxContainer = document.getElementById('category-checkboxes');
        data.forEach(category => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="radio" name="categoryId" value="${category.id}" required> ${category.name}
            `;
            checkboxContainer.appendChild(label);
        });
    })

document.addEventListener("DOMContentLoaded", function () {
  fetch('https://optimizerpcback-production.up.railway.app/v0/s/sale')
    .then(response => response.json())
    .then(data => {
      const seriesData = data.map(sale => ({
        // Convertimos "yyyy-MM-dd HH:mm:ss" a ISO 8601 reemplazando espacio por 'T'
        x: new Date(sale.date.replace(' ', 'T')).getTime(),
        y: sale.price
      }));

      const options = {
        chart: {
          type: 'area',
          height: 400,
          zoom: { enabled: true },
          toolbar: {
            show: true,
            tools: {
              download: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true
            }
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: { enabled: true, delay: 150 },
            dynamicAnimation: { enabled: true, speed: 350 }
          },
          foreColor: '#ffffff', // color texto blanco
          background: '#1e40af' // azul oscuro de fondo
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        series: [{
          name: 'Ventas (€)',
          data: seriesData
        }],
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: false,
            format: 'dd MMM HH:mm',
            style: { colors: '#e0e7ff', fontSize: '12px' } // azul clarito claro
          },
          title: {
            text: 'Fecha y Hora',
            style: { color: '#e0e7ff', fontWeight: 'bold' }
          },
          axisBorder: {
            show: true,
            color: '#93c5fd'
          },
          axisTicks: {
            show: true,
            color: '#93c5fd'
          }
        },
        yaxis: {
          title: {
            text: 'Precio (€)',
            style: { color: '#e0e7ff', fontWeight: 'bold' }
          },
          labels: {
            formatter: val => `€${val.toFixed(2)}`,
            style: { colors: '#e0e7ff' }
          },
          min: 0,
          forceNiceScale: true
        },
        tooltip: {
          enabled: true,
          theme: 'dark',
          x: {
            format: 'dd MMM yyyy HH:mm:ss',
            formatter: val => {
              const dt = new Date(val);
              return dt.toLocaleString('es-ES', { 
                year: 'numeric', month: 'short', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false 
              });
            }
          },
          y: {
            formatter: val => `€${val.toFixed(2)}`
          },
          shared: true,
          intersect: false,
          style: {
            fontSize: '14px',
            color: '#ffffff'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [
              { offset: 0, color: '#60a5fa', opacity: 0.7 }, // azul claro
              { offset: 100, color: '#1e3a8a', opacity: 0.1 } // azul oscuro
            ]
          }
        },
        stroke: {
          curve: 'smooth',
          width: 3,
          colors: ['#93c5fd'] // línea azul clara
        },
        markers: {
          size: 5,
          colors: ['#bfdbfe'], // marcador azul claro
          strokeColors: '#1e40af',
          strokeWidth: 2,
          hover: {
            size: 7
          }
        },
        grid: {
          borderColor: '#3b82f6',
          row: { colors: ['#1e40af', '#2563eb'], opacity: 0.1 }
        },
        theme: {
          monochrome: {
            enabled: true,
            color: '#93c5fd',
            shadeTo: 'dark',
            shadeIntensity: 0.65
          }
        }};

      const chart = new ApexCharts(document.querySelector("#salesChart"), options);
      chart.render();
    })
    .catch(error => console.error('Error al obtener los datos:', error));
});




 document.getElementById('product-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = e.target;

  // Obtener valores
  const name = form.elements['name'].value.trim();
  const priceStr = form.elements['price'].value.trim();
  const imageFile = form.elements['image'].files[0];
  const categoryId = form.elements['categoryId'].value;

  // Validaciones básicas
  if (!categoryId) {
    Swal.fire("Error", "Selecciona una categoría", "warning");
    return;
  }
  if (!name) {
    Swal.fire("Error", "El nombre es obligatorio", "warning");
    return;
  }
  const price = parseFloat(priceStr);
  if (isNaN(price) || price <= 0) {
    Swal.fire("Error", "El precio debe ser un número válido mayor que 0", "warning");
    return;
  }
  if (!imageFile) {
    Swal.fire("Error", "Selecciona una imagen", "warning");
    return;
  }

  // Confirmación con SweetAlert
  Swal.fire({
    title: '¿Agregar producto?',
    icon: 'question',
    html: `Vas a agregar <b>${name}</b> por <b>${price.toFixed(2)}€</b>`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64ImageWithPrefix = reader.result;

        const payload = {
          name: name,
          image: base64ImageWithPrefix,
          price: price
        };

        try {
          const response = await fetch(`https://optimizerpcback-production.up.railway.app/v0/article?categoryId=${categoryId}`, {
            method: 'POST',
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            Toastify({
              text: `✅ ${name} agregado correctamente`,
              duration: 3000,
              gravity: "top",
              position: "right",
              style: { background: "#4BB543" }
            }).showToast();
            Swal.fire({
            title: '🎉 ¡Producto agregado!',
            html: `
            <p><strong>${name}</strong> se ha agregado correctamente a la tienda.</p>
            <p>Precio: <strong>${price.toFixed(2)}€</strong></p>
              ` ,
          imageUrl: base64ImageWithPrefix,
            imageAlt: `Imagen de ${name}`,
              imageWidth: 200,
              background: '#f0f9ff',
            icon: 'success',
            confirmButtonText: 'Genial 😎',
          customClass: {
         popup: 'swal2-show-image-popup'
                }
              });

            form.reset();
          } else {
            const error = await response.text();
            Swal.fire("Error al agregar", error, "error");
          }
        } catch (error) {
          Swal.fire("Error de red", "No se pudo conectar con el servidor", "error");
          console.error(error);
        }
      };

      reader.readAsDataURL(imageFile);
    }
  });
});



