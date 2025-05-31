fetch("https://optimizerpcback-production.up.railway.app/v0/auth/check", {
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
})
.then(response => {
    if (!response.ok) {
        window.location.href = "/OptimizerPC_Front/login/login.html";
    }
    return response.json();
})
.then(data => {
    console.log("Usuario autenticado:", data.authenticated);
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

fetch('https://optimizerpcback-production.up.railway.app/v0/s/sale')
  .then(response => response.json())
  .then(data => {
    const labels = data.map(sale =>
      new Date(sale.date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    );
    const prices = data.map(sale => sale.price);

    const ctx = document.getElementById('salesChart').getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Ventas (€)',
          data: prices,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3b82f6',
          borderWidth: 3,
          pointBackgroundColor: 'white',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: 'white',
          pointHoverBorderColor: '#3b82f6',
          pointRadius: 5,
          pointHoverRadius: 8,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
            bottom: 20,
            left: 10,
            right: 10
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#f9fafb',
              font: {
                size: 14,
                family: 'Segoe UI'
              },
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#facc15',
            bodyColor: '#f9fafb',
            borderColor: '#facc15',
            borderWidth: 1,
            cornerRadius: 4,
            titleFont: { weight: 'bold' }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'white'
            },
            ticks: {
              color: 'white',
              font: {
                size: 12
              }
            },
        
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#374151'
            },
            ticks: {
              color: '#f9fafb',
              font: {
                size: 12
              }
            },
            title: {
              display: true,
              text: 'Precio (€)',
              color: 'white',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error al obtener los datos:', error));

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
  
  


