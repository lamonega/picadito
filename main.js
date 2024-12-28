const textarea = document.getElementById("textarea");
const submit = document.getElementById("submit");
const equipoContainer = document.getElementById("equipo-container");
const numJugadoresSelect = document.getElementById("num-jugadores");
const formacionAleatoriaCheckbox = document.getElementById("formacion-aleatoria");
const posicionesAleatoriasCheckbox = document.getElementById("posiciones-aleatorias");

// Definición de formaciones disponibles por número de jugadores
const formaciones = {
  4: [
    { nombre: "1-2-1", distribucion: [1, 2, 1] },
    { nombre: "1-1-2", distribucion: [1, 1, 2] },
    { nombre: "1-1-1-1", distribucion: [1, 1, 1, 1] },
  ],
  5: [
    { nombre: "1-3-1", distribucion: [1, 3, 1] },
    { nombre: "1-2-2", distribucion: [1, 2, 2] },
    { nombre: "1-1-3", distribucion: [1, 1, 3] },
    { nombre: "1-2-1-1", distribucion: [1, 2, 1, 1] },
    { nombre: "1-1-2-1", distribucion: [1, 1, 2, 1] },
  ],
  6: [
    { nombre: "1-4-1", distribucion: [1, 4, 1] },
    { nombre: "1-3-2", distribucion: [1, 3, 2] },
    { nombre: "1-2-3", distribucion: [1, 2, 3] },
    { nombre: "1-2-2-1", distribucion: [1, 2, 2, 1] },
    { nombre: "1-1-3-1", distribucion: [1, 1, 3, 1] },
    { nombre: "1-2-1-2", distribucion: [1, 2, 1, 2] },
  ],
  7: [
    { nombre: "1-5-1", distribucion: [1, 5, 1] },
    { nombre: "1-4-2", distribucion: [1, 4, 2] },
    { nombre: "1-3-3", distribucion: [1, 3, 3] },
    { nombre: "1-3-2-1", distribucion: [1, 3, 2, 1] },
    { nombre: "1-2-3-1", distribucion: [1, 2, 3, 1] },
    { nombre: "1-2-2-2", distribucion: [1, 2, 2, 2] },
    { nombre: "1-1-3-2", distribucion: [1, 1, 3, 2] },
    { nombre: "1-1-4-1", distribucion: [1, 1, 4, 1] },
  ],
};

// Mapeo de roles según la cantidad de líneas en la formación
const rolesByLine = {
  3: ["Arquero", "Defensor", "Delantero"],
  4: ["Arquero", "Defensor", "Mediocampista", "Delantero"],
};

// Función para obtener un entero aleatorio
const getRandomInt = (max) => Math.floor(Math.random() * max);

// Función para seleccionar una formación aleatoria
const formacionAleatoria = (cantJugadoresEquipo) => {
  const formaciones_disponibles = formaciones[cantJugadoresEquipo];
  return formaciones_disponibles[getRandomInt(formaciones_disponibles.length)];
};

// Función para asignar posiciones a los jugadores según la distribución de la formación
const asignarPosiciones = (distribucionEquipo, equipo) => {
  const equipoDisponible = [...equipo];
  const equipoConPosiciones = [];
  const cantidadLineas = distribucionEquipo.length;
  const roles = rolesByLine[cantidadLineas] || [];

  roles.forEach((rol, idx) => {
    const cantidad = distribucionEquipo[idx];
    for (let i = 0; i < cantidad; i++) {
      const jugadorIndex = getRandomInt(equipoDisponible.length);
      const jugador = equipoDisponible.splice(jugadorIndex, 1)[0];
      equipoConPosiciones.push(`${jugador}: ${rol}`);
    }
  });

  return equipoConPosiciones;
};

// Función para crear el elemento DOM de un equipo
const crearEquipoElemento = (nombre, equipo, formacion = { nombre: "Sin formación" }) => {
  const equipoDiv = document.createElement("div");
  equipoDiv.classList.add("equipo");

  const equipoTitle = document.createElement("h3");
  equipoTitle.textContent = `${nombre} - Formación: ${formacion.nombre}`;

  const equipoList = document.createElement("ul");
  equipo.forEach((jugador) => {
    const li = document.createElement("li");
    li.textContent = jugador;
    equipoList.appendChild(li);
  });

  equipoDiv.appendChild(equipoTitle);
  equipoDiv.appendChild(equipoList);

  return equipoDiv;
};

// Evento al hacer clic en el botón de submit
submit.addEventListener("click", (e) => {
  e.preventDefault();

  const nombres_array = textarea.value.trim().split(/\s+/);

  const numJugadores = parseInt(numJugadoresSelect.value, 10); // Se pasa `10` como radix para asegurar que la cadena se interprete como un número decimal.
  const esFormacionAleatoria = formacionAleatoriaCheckbox.checked;
  const esPosicionesAleatorias = posicionesAleatoriasCheckbox.checked;

  // Validación de cantidad de jugadores
  if (nombres_array.length < numJugadores * 2) {
    equipoContainer.innerHTML = `
      <div class="error-mensaje">
        <p>No hay suficientes jugadores. Necesitas al menos ${numJugadores * 2} nombres para formar dos equipos de ${numJugadores} jugadores.</p>
        <p>Actualmente tienes ${nombres_array.length} nombres en total.</p>
      </div>
    `;
    return;
  }

  // División de jugadores en dos equipos
  const equipo1 = nombres_array.filter((_, index) => index % 2 === 0).slice(0, numJugadores);
  const equipo2 = nombres_array.filter((_, index) => index % 2 === 1).slice(0, numJugadores);

  equipoContainer.innerHTML = "";

  if (esFormacionAleatoria) {
    const formacionEquipo1 = formacionAleatoria(numJugadores);
    const formacionEquipo2 = formacionAleatoria(numJugadores);

    const equipos = [equipo1, equipo2];
    const formacionesSeleccionadas = [formacionEquipo1, formacionEquipo2];
    
    // Asignar posiciones aleatorias si está seleccionado
    if (esPosicionesAleatorias) {
      equipos.forEach((equipo, idx) => {
        equipos[idx] = asignarPosiciones(formacionesSeleccionadas[idx].distribucion, equipo);
      });
    }

    // Crear y agregar los elementos de los equipos al contenedor
    equipos.forEach((equipo, idx) => {
      const equipoElement = crearEquipoElemento(`Equipo ${idx + 1}`, equipo, formacionesSeleccionadas[idx]);
      equipoContainer.appendChild(equipoElement);
    });
  } else {
    // Si no se selecciona formación aleatoria, mostrar los equipos sin formación
    ["Equipo 1", "Equipo 2"].forEach((nombre, idx) => {
      const equipoElement = crearEquipoElemento(nombre, [equipo1, equipo2][idx]);
      equipoContainer.appendChild(equipoElement);
    });
  }
});