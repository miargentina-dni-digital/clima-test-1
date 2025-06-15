document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '78c1266a622e401280d195527251406';
  const location = 'Buenos Aires';

  // 🔹 Clima actual
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=8&lang=es`)
    .then(res => res.json())
    .then(data => {
      const temp = Math.round(data.current.temp_c);
      const termica = Math.round(data.current.feelslike_c);
      const estado = data.current.condition.text;

      console.log("🌡️ Temperatura actual:", temp + "°C");
      console.log("🥵 Sensación térmica:", termica + "°C");
      console.log("🌤️ Estado del tiempo:", estado);
    })
    .catch(err => console.error("Error clima actual:", err));

  // 🔹 Pronóstico de 7 días
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=8&lang=es`)
    .then(res => res.json())
    .then(data => {
      const pronostico = data.forecast.forecastday;

      console.log("📅 Pronóstico próximos 7 días:");
      pronostico.forEach((dia, index) => {
        const fecha = new Date(dia.date);
        const diaNombre = index === 0 ? "HOY" : fecha.toLocaleDateString('es-AR', { weekday: 'short' }).toUpperCase();

        const max = Math.round(dia.day.maxtemp_c);
      const min = Math.floor(dia.day.mintemp_c);
        const lluvia = dia.day.daily_chance_of_rain;
        const estado = data.current.condition.text;

        console.log(`🗓️ ${diaNombre}`);
        console.log(`   Máx: ${max}°C`);
        console.log(`   Mín: ${min}°C`);
        console.log(`   Prob. de lluvia: ${lluvia}%`);
        console.log(`   Estado del tiempo: ${estado}`);
      });
    })
    .catch(err => console.error("Error pronóstico:", err));
});


document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '78c1266a622e401280d195527251406';
  const lat = -34.6037;
  const lon = -58.3816;

  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=8&lang=es`)
    .then(res => res.json())
    .then(data => {
      const actual = data.current;
      const pronostico = data.forecast.forecastday;

      // Actualizar datos actuales
      const temp = Math.round(actual.temp_c);
      document.querySelector('.tempMain').textContent = `${temp}`;
      document.querySelector('.estado').textContent = actual.condition.text;
      const termica = Math.round(actual.feelslike_c);
      document.querySelector('.termica').textContent = `Térmica: ${termica}°C`;

      // Hora
      const now = new Date();
      const hora = now.getHours();
      document.querySelector('.ubicacion-hr').textContent = `BUENOS AIRES / ${hora}:00`;

      // Días
      // --- Días de la semana ---
      const dias = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
      const hoy = new Date().getDay(); // 0 (domingo) a 6 (sábado)
      const filaDias = document.querySelector('.weekContainer tr');
      filaDias.innerHTML = '';

      // Añadir "HOY"
      const tdHoy = document.createElement('td');
      tdHoy.textContent = 'HOY';
      filaDias.appendChild(tdHoy);

      // Añadir los próximos 7 días (total: 8 columnas)
      for (let i = 1; i <= 7; i++) {
        const diaIndex = (hoy + i) % 7;
        const td = document.createElement('td');
        td.textContent = dias[diaIndex];
        filaDias.appendChild(td);
      }


      // --- Iconos ---
      const filaIconos = document.querySelector('.icons');
      filaIconos.innerHTML = '';

      // Mostrar HOY + 7 días (8 iconos), y loguear el nombre real del día
      for (let i = 0; i < 8; i++) {
        const estado = pronostico[i].day.condition.text;
        const iconoSrc = obtenerIcono(estado);

        const td = document.createElement('td');
        const img = document.createElement('img');
        img.src = iconoSrc;
        img.alt = estado;
        td.appendChild(img);
        filaIconos.appendChild(td);

        // --- Temperaturas máximas y mínimas ---
        const filaMax = document.querySelector('.max-temp');
        const filaMin = document.querySelector('.min-temp');
        // Máximas y mínimas
        filaMax.innerHTML = '';
        filaMin.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            const max = Math.round(pronostico[i].day.maxtemp_c);
            const min = Math.round(pronostico[i].day.mintemp_c);

            const tdMax = document.createElement('td');
            tdMax.textContent = max;
            filaMax.appendChild(tdMax);

            const tdMin = document.createElement('td');
            tdMin.textContent = min;
            filaMin.appendChild(tdMin);
        }

        // Calcular el índice del día real
        const hoy = new Date().getDay(); // 0 (domingo) a 6 (sábado)
        const dias = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB']; // asegurate de tenerlo declarado arriba!
        const diaIndex = (hoy + i) % 7;
        const diaNombre = dias[diaIndex];

        console.log(`📅 ${diaNombre} (${pronostico[i].date}): ${estado}`);
      }
    });

  function obtenerIcono(estado) {
    const normalized = estado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (normalized.includes('soleado') || normalized.includes('despejado')) return 'icons/sun.png';
    if (normalized.includes('parcialmente nublado')) return 'icons/cloudy-day.png';
    if (normalized.includes('nublado') || normalized.includes('cubierto')) return 'icons/cloud.png';
    if (normalized.includes('lluvia fuerte')) return 'icons/heavy-rain.png';
    if (normalized.includes('lluvia') || normalized.includes('llovizna') || normalized.includes('chubascos')) return 'icons/light-rain.png';
    if (normalized.includes('tormenta')) return 'icons/storm.png';
    if (normalized.includes('niebla') || normalized.includes('neblina') || normalized.includes('bruma')) return 'icons/mist.png';

    return 'icons/cloud.png'; // default
  }
});











const weekTable = document.getElementById('weekTable');
    const hourlyContainer = document.getElementById('hourlyTableContainer');
    let pronostico = null;

    // Cargar pronóstico al inicio
    const apiKey = '78c1266a622e401280d195527251406';
    const lat = -34.6037;
    const lon = -58.3816;
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=8&lang=es`)
      .then(res => res.json())
      .then(data => {
        pronostico = data.forecast.forecastday;
        console.log("Pronóstico cargado:", pronostico);
      });

    // Manejar click en cualquier celda de la tabla (¡en cualquier fila!)
    weekTable.addEventListener('click', function(e) {
      const td = e.target.closest('td');
      if (!td) return;
      // Índice de la columna clickeada
      const colIdx = Array.from(td.parentNode.children).indexOf(td);
      if (!pronostico || !pronostico[colIdx]) return;
      console.log('Click columna:', colIdx, pronostico[colIdx]);
      mostrarTablaHoraria(pronostico[colIdx]);
    });

    function mostrarTablaHoraria(dia) {
      console.log('Mostrando horario para', dia);
      weekTable.style.display = 'none';
      hourlyContainer.style.display = '';

      const horas = dia.hour;
      let ths = '', tds = '', prob = '';
      for (let i = 0; i < horas.length; i++) {
        ths  += `<th>${horas[i].time.split(' ')[1].slice(0,5)}</th>`;
        tds  += `<td>${Math.round(horas[i].temp_c)}°C</td>`;
        prob += `<td>${horas[i].chance_of_rain}%</td>`;
      }
      hourlyContainer.innerHTML = `
        <div class="hourly-scroll">
          <table class="hourlyTable">
            <thead>
              <tr>${ths}</tr>
            </thead>
            <tbody>
              <tr>${tds}</tr>
              <tr>${prob}</tr>
            </tbody>
          </table>
        </div>
        <button id="closeHourly">Volver</button>
      `;
      document.getElementById('closeHourly').onclick = () => {
        hourlyContainer.style.display = 'none';
        weekTable.style.display = '';
      };
    }