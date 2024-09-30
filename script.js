let jsonData = {};

// Cargar el JSON desde la URL
fetch('https://edeyson.github.io/omnitours/planes1.json')
  .then(response => response.json())
  .then(data => {
    jsonData = data;
    cargarPlanes();
  })
  .catch(error => console.error('Error al cargar JSON:', error));

// Detectar si el mes tiene un formato específico de fechas, como rangos personalizados
function tieneFechasEspecificas(fecha) {
  const regexMesCompleto = /^2024-\d{2}-01\/2024-\d{2}-\d{2}$/; // Formato mes completo
  return !regexMesCompleto.test(fecha); // Si no coincide con el mes completo, es fecha específica
}

// Cargar los planes en la interfaz
function cargarPlanes() {
  const plansContainer = document.getElementById('plansContainer');
  const specificDatePlansContainer = document.getElementById('specificDatePlansContainer');
  
  plansContainer.innerHTML = ''; // Limpiar contenido previo
  specificDatePlansContainer.innerHTML = ''; // Limpiar contenido previo

  for (const planKey in jsonData) {
    const plan = jsonData[planKey];
    const planDiv = document.createElement('div');
    planDiv.classList.add('plan');
    
    // Título del plan
    const planTitle = document.createElement('h2');
    planTitle.textContent = plan.tour.nombre_del_plan;
    planDiv.appendChild(planTitle);
    
    // Verificar si tiene fechas específicas
    let tieneFechasEspecificasFlag = false;
    const monthsDiv = document.createElement('div');
    monthsDiv.classList.add('months');
    
    for (const mes in plan.months) {
      const fecha = plan.months[mes];
      if (tieneFechasEspecificas(fecha)) {
        tieneFechasEspecificasFlag = true;
      }

      const monthDiv = document.createElement('div');
      monthDiv.classList.add('month');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `${planKey}_${mes}`;
      checkbox.checked = true; // Activo por defecto
      checkbox.dataset.plan = planKey;
      checkbox.dataset.month = mes;
      
      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = mes;
      
      monthDiv.appendChild(checkbox);
      monthDiv.appendChild(label);
      monthsDiv.appendChild(monthDiv);
    }
    
    planDiv.appendChild(monthsDiv);
    
    // Botón para eliminar el plan
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar Plan';
    deleteButton.addEventListener('click', () => eliminarPlan(planKey));
    planDiv.appendChild(deleteButton);
    
    // Si tiene fechas específicas, agregar a la sección correspondiente
    if (tieneFechasEspecificasFlag) {
      specificDatePlansContainer.appendChild(planDiv);
    } else {
      plansContainer.appendChild(planDiv);
    }
  }
}

// Eliminar un plan
function eliminarPlan(planKey) {
  if (confirm('¿Estás seguro de que deseas eliminar este plan?')) {
    delete jsonData[planKey];
    cargarPlanes(); // Recargar los planes actualizados
  }
}

// Marcar/Desmarcar todos los planes en un mes
document.getElementById('toggleMonth').addEventListener('click', function () {
  const selectedMonth = document.getElementById('selectMonth').value;
  const checkboxes = document.querySelectorAll(`input[data-month="${selectedMonth}"]`);

  // Alternar la selección de todos los checkboxes del mes
  const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
  checkboxes.forEach(checkbox => {
    checkbox.checked = !allChecked; // Si todos están marcados, desmarcar. Si no, marcar.
  });
});

// Guardar cambios en el JSON
document.getElementById('saveChanges').addEventListener('click', function () {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    const planKey = checkbox.dataset.plan;
    const month = checkbox.dataset.month;
    
    if (!checkbox.checked) {
      delete jsonData[planKey].months[month]; // Eliminar mes si no está marcado
    }
  });

  document.getElementById('outputJson').textContent = JSON.stringify(jsonData, null, 2);
  alert('Cambios guardados');
});

// Copiar JSON al portapapeles
document.getElementById('copyToClipboard').addEventListener('click', function () {
  const jsonText = JSON.stringify(jsonData, null, 2);
  navigator.clipboard.writeText(jsonText).then(() => {
    alert('JSON copiado al portapapeles');
  }).catch(err => {
    alert('Error al copiar JSON: ' + err);
  });
});

// Agregar un nuevo plan
document.getElementById('addPlan').addEventListener('click', function () {
  const newPlanName = document.getElementById('newPlanName').value;
  const newPlanCode = document.getElementById('newPlanCode').value;
  const newCityCode = document.getElementById('newCityCode').value;

  if (newPlanName && newPlanCode && newCityCode) {
    const newPlanKey = `plan${Object.keys(jsonData).length + 1}`;
    jsonData[newPlanKey] = {
      tour: {
        nombre_del_plan: newPlanName,
        plan_code: newPlanCode,
        city_code: newCityCode
      },
      months: {
        "Enero": "2024-01-01/2024-01-31",
        "Febrero": "2024-02-01/2024-02-28",
        "Marzo": "2024-03-01/2024-03-31",
        "Abril": "2024-04-01/2024-04-30",
        "Mayo": "2024-05-01/2024-05-31",
        "Junio": "2024-06-01/2024-06-30",
        "Julio": "2024-07-01/2024-07-31",
        "Agosto": "2024-08-01/2024-08-31",
        "Septiembre": "2024-09-01/2024-09-30",
        "Octubre": "2024-10-01/2024-10-31",
        "Noviembre": "2024-11-01/2024-11-30",
        "Diciembre": "2024-12-01/2024-12-31"
      }
    };

    cargarPlanes(); // Recargar los planes para mostrar el nuevo plan
    alert('Nuevo plan agregado');
  } else {
    alert('Por favor, completa todos los campos para agregar un plan.');
  }
});
