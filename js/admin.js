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
          }
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
            style: { fontSize: '12px' }
          },
          title: {
            text: 'Fecha y Hora',
            style: { fontWeight: 'bold' }
          }
        },
        yaxis: {
          title: {
            text: 'Precio (€)',
            style: { fontWeight: 'bold' }
          },
          labels: {
            formatter: val => `€${val.toFixed(2)}`
          },
          min: 0,
          forceNiceScale: true
        },
        tooltip: {
          enabled: true,
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
            fontSize: '14px'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100]
          }
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        markers: {
          size: 5,
          hover: {
            size: 8
          }
        },
        grid: {
          borderColor: '#e7e7e7',
          row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 }
        }
      };

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
  
    // Validaciones
    if (!categoryId) {
      alert("Selecciona una categoría");
      return;
    }
    if (!name) {
      alert("El nombre es obligatorio");
      return;
    }
    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      alert("El precio debe ser un número válido mayor que 0");
      return;
    }
    if (!imageFile) {
      alert("Selecciona una imagen");
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = async () => {
      // Aquí pasamos el base64 completo, con prefijo 'data:image/...'
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
            text: "Producto agregado correctamente",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: { background: "#4BB543" }
          }).showToast();
          form.reset();
        } else {
          const error = await response.text();
          alert("Error al agregar producto: " + error);
        }
      } catch (error) {
        alert("Error al conectar con el servidor");
        console.error(error);
      }
    };
  
    reader.readAsDataURL(imageFile);
  });
  
  


