const diasSemana = ["D", "L", "M", "M", "J", "V", "S"];
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const obtenerDiasMeses = (mesesTotales) => {
  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const diasMeses = [];

  for (let i = -mesesTotales; i <= mesesTotales; i++) {
    const mes = new Date();
    mes.setMonth(mesActual + i);
    mes.setDate(1);

    const primerDiaMes = mes.getDay();
    const ultimoDiaMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();

    const dias = Array.from({ length: primerDiaMes }, () => "");
    for (let d = 1; d <= ultimoDiaMes; d++) {
      dias.push(d);
    }

    const totalDias = dias.length;
    const totalSemanas = Math.ceil(totalDias / 7);
    const diasFaltantes = totalSemanas * 7 - totalDias;
    dias.push(...Array.from({ length: diasFaltantes }, () => ""));

    diasMeses.push({ nombre: meses[mes.getMonth()], dias });
  }

  return diasMeses;
};

const actualizarCalendario = () => {
  const fechaPago = parseInt(document.getElementById("fechaPago").value);
  const fechaCorte = parseInt(document.getElementById("fechaCorte").value);
  let mesesTotales = parseInt(document.getElementById("mesesTotales").value);

  if (mesesTotales > 6) {
    mesesTotales = 6;
  }
  if (mesesTotales < 1) {
    mesesTotales = 1;
  }

  const diasMeses = obtenerDiasMeses(mesesTotales);
  const calendarContainer = document.querySelector(".calendar-container");
  calendarContainer.innerHTML = "";

  let colorBordeFechaCorte = null;
  let colorBordeFechaPago = null;

  diasMeses.forEach((mes, index) => {
    const monthContainer = document.createElement("div");
    monthContainer.classList.add("month-container");
    if (index === mesesTotales) {
      monthContainer.classList.add("current-month");
    }

    const monthTitle = document.createElement("h2");
    monthTitle.textContent = mes.nombre;
    monthTitle.style.marginTop = "0";
    monthContainer.appendChild(monthTitle);

    const weekCount = Math.ceil(mes.dias.length / 7);

    const weekDays = document.createElement("div");
    weekDays.classList.add("week");
    diasSemana.forEach((dia) => {
      const dayName = document.createElement("div");
      dayName.classList.add("day", "day-name");
      dayName.textContent = dia;
      weekDays.appendChild(dayName);
    });
    monthContainer.appendChild(weekDays);

    for (let i = 0; i < weekCount; i++) {
      const week = document.createElement("div");
      week.classList.add("week");

      for (let j = 0; j < 7; j++) {
        const day = document.createElement("div");
        day.classList.add("day");
        const dayIndex = i * 7 + j;
        if (dayIndex < mes.dias.length) {
          if (mes.dias[dayIndex] !== "") {
            day.textContent = mes.dias[dayIndex];
            if (mes.dias[dayIndex] === fechaCorte) {
              colorBordeFechaCorte = obtenerColorBorde(colorBordeFechaCorte, "corte");
              const nextColorCorte = obtenerColorBorde(colorBordeFechaCorte, "corte");
              // day.style.borderBottom = `7px solid ${colorBordeFechaCorte}`;
              applyGradient(day, nextColorCorte, colorBordeFechaCorte);
              day.style.color = "white";
              day.style.fontWeight = "bold";
            } else {
              day.style.borderBottom = `7px solid ${colorBordeFechaCorte}`;
            }
            if (mes.dias[dayIndex] === fechaPago) {
              colorBordeFechaPago = obtenerColorBorde(colorBordeFechaPago, "pago");
              const nextColorPago = obtenerColorBorde(colorBordeFechaPago, "pago");
              // day.style.borderTop = `7px solid ${colorBordeFechaPago}`;
              applyGradient(day, nextColorPago, colorBordeFechaPago);
              day.style.color = "white";
              day.style.fontWeight = "bold";
            } else {
              day.style.borderTop = `7px solid ${colorBordeFechaPago}`;
            }
          } else {
            day.classList.add("empty-day");
            if (dayIndex < 7 || dayIndex >= mes.dias.length - 7) {
              day.style.border = `0.5px solid #eee`;
            } else {
              day.style.borderBottom = `7px solid ${colorBordeFechaCorte}`;
              day.style.borderTop = `7px solid ${colorBordeFechaPago}`;
            }
          }
        }
        if (mes.nombre === meses[new Date().getMonth()] && mes.dias[dayIndex] === new Date().getDate()) {
          day.classList.add("current-day");
        }
        week.appendChild(day);
      }

      monthContainer.appendChild(week);
    }

    calendarContainer.appendChild(monthContainer);
  });
};

const obtenerColorBorde = (colorActual, periodo) => {
  const coloresFechaCorte = ["#3a9d23", "#b7c000"];

  const coloresFechaPago = ["#ff0000", "orange"];
  const colores = periodo === "corte" ? coloresFechaCorte : coloresFechaPago;
  if (!colorActual || !colores.includes(colorActual)) {
    return colores[0];
  }
  const index = colores.indexOf(colorActual);
  return colores[(index + 1) % colores.length];
};

const applyGradient = (element, startColor, endColor) => {
  const gradient = `linear-gradient(to right, ${startColor}, ${endColor})`;
  element.style.background = gradient;
};

actualizarCalendario();
