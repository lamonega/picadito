const textarea = document.getElementById("textarea");
const submit = document.getElementById("submit");
const equipoContainer = document.getElementById("equipo-container");
const numJugadoresSelect = document.getElementById("num-jugadores");
const formacionAleatoriaCheckbox = document.getElementById(
  "formacion-aleatoria"
);
const posicionesAleatoriasCheckbox = document.getElementById(
  "posiciones-aleatorias"
);

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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function formacionAleatoria(cantJugadoresEquipo) {
  let formaciones_disponibles = formaciones[cantJugadoresEquipo];
  return formaciones_disponibles[getRandomInt(formaciones_disponibles.length)];
}

function asignarPosiciones(distribucionEquipo, equipo) {
  let equipoDisponible = [...equipo];
  let equipoConPosiciones = [];

  function seleccionarJugador() {
    if (equipoDisponible.length === 0) return null;
    const indiceAleatorio = getRandomInt(equipoDisponible.length);
    return equipoDisponible.splice(indiceAleatorio, 1)[0];
  }

  const cantidadLineas = distribucionEquipo.length;

  if (cantidadLineas === 3) {
    const arquero = seleccionarJugador();
    equipoConPosiciones.push(`${arquero}: Arquero`);

    for (let i = 0; i < distribucionEquipo[1]; i++) {
      const defensor = seleccionarJugador();
      equipoConPosiciones.push(`${defensor}: Defensor`);
    }

    for (let i = 0; i < distribucionEquipo[2]; i++) {
      const delantero = seleccionarJugador();
      equipoConPosiciones.push(`${delantero}: Delantero`);
    }
  } else if (cantidadLineas === 4) {
    const arquero = seleccionarJugador();
    equipoConPosiciones.push(`${arquero}: Arquero`);

    for (let i = 0; i < distribucionEquipo[1]; i++) {
      const defensor = seleccionarJugador();
      equipoConPosiciones.push(`${defensor}: Defensor`);
    }

    for (let i = 0; i < distribucionEquipo[2]; i++) {
      const mediocampista = seleccionarJugador();
      equipoConPosiciones.push(`${mediocampista}: Mediocampista`);
    }

    for (let i = 0; i < distribucionEquipo[3]; i++) {
      const delantero = seleccionarJugador();
      equipoConPosiciones.push(`${delantero}: Delantero`);
    }
  }

  return equipoConPosiciones;
}

function crearEquipoElemento(nombre, equipo, formacion) {
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
}

submit.addEventListener("click", (e) => {
  e.preventDefault();

  let nombres_string = textarea.value.trim();
  let nombres_array = nombres_string.split(" ");

  let numJugadores = parseInt(numJugadoresSelect.value);
  let esFormacionAleatoria = formacionAleatoriaCheckbox.checked;
  let esPosicionesAleatorias = posicionesAleatoriasCheckbox.checked;

  let equipo1 = nombres_array
    .filter((_, index) => index % 2 === 0)
    .slice(0, numJugadores);
  let equipo2 = nombres_array
    .filter((_, index) => index % 2 === 1)
    .slice(0, numJugadores);

  equipoContainer.innerHTML = "";

  let formacionEquipo1, formacionEquipo2;

  // Generar formaciones aleatorias solo si el checkbox está marcado
  if (esFormacionAleatoria) {
    formacionEquipo1 = formacionAleatoria(numJugadores);
    formacionEquipo2 = formacionAleatoria(numJugadores);

    // Asignar posiciones aleatorias si está seleccionado
    if (esPosicionesAleatorias) {
      equipo1 = asignarPosiciones(formacionEquipo1.distribucion, equipo1);
      equipo2 = asignarPosiciones(formacionEquipo2.distribucion, equipo2);
    }

    const equipo1Element = crearEquipoElemento(
      "Equipo 1",
      equipo1,
      formacionEquipo1
    );
    const equipo2Element = crearEquipoElemento(
      "Equipo 2",
      equipo2,
      formacionEquipo2
    );

    equipoContainer.appendChild(equipo1Element);
    equipoContainer.appendChild(equipo2Element);
  } else {
    // Si no se selecciona formación aleatoria, mostrar los equipos sin formación
    const equipo1Element = crearEquipoElemento("Equipo 1", equipo1, {
      nombre: "Sin formación",
    });
    const equipo2Element = crearEquipoElemento("Equipo 2", equipo2, {
      nombre: "Sin formación",
    });

    equipoContainer.appendChild(equipo1Element);
    equipoContainer.appendChild(equipo2Element);
  }
});
