import { buscarCiudad, obtenerTemperaturas } from "./api.js";
import { pintarGrafico, pintarFavoritas, mostrarCargando, mostrarError, limpiarEstado, mostrarNotificacion } from "./render.js";
import { guardarCiudad, cargarFavoritas } from "./db.js";

const $input = document.getElementById("input-ciudad");
const $boton = document.getElementById("btn-buscar");
const $btnGuardar = document.getElementById("btn-guardar");

let cargando = false;
let guardando = false;

// La ciudad que hay AHORA en pantalla. Dentro de manejarBusqueda, la
// variable ⁠ ciudad ⁠ es local: nace y muere dentro de la función. Cuando
// pulses «guardar» ya no existiría, así que la copiamos aquí.
let ciudadActual = null;

async function manejarBusqueda() {
  const consulta = $input.value.trim();
  if (!consulta || cargando) return;

  cargando = true;
  mostrarCargando(consulta);

  try {
    const ciudad = await buscarCiudad(consulta);

    const temps = await obtenerTemperaturas(ciudad.lat, ciudad.lon);

    if (!temps || temps.length === 0) {
      throw new Error("No hay datos de temperatura para esa ciudad");
    }

    ciudadActual = ciudad;
    pintarGrafico(ciudad, temps);
    limpiarEstado();
  } catch (error) {
    mostrarError(error.message || "Error al obtener los datos");
  } finally {
    cargando = false;
  }
}

$boton.addEventListener("click", manejarBusqueda);

$input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") manejarBusqueda();
});

async function refrescarFavoritas() {
  try {
    const favoritas = await cargarFavoritas();
    pintarFavoritas(favoritas);
  } catch {
    // Las favoritas son opcionales; no bloquean la búsqueda ni el botón guardar
  }
}

$btnGuardar.addEventListener("click", async () => {
  if (!ciudadActual || guardando) return;

  guardando = true;
  $btnGuardar.disabled = true;

  try {
    await guardarCiudad(ciudadActual.nombre, ciudadActual.lat, ciudadActual.lon);
    mostrarNotificacion("Ciudad guardada en tus favoritas");
    await refrescarFavoritas();
  } catch (error) {
    mostrarNotificacion(error.message || "No se pudo guardar la ciudad", true);
  } finally {
    guardando = false;
    $btnGuardar.disabled = false;
  }
});

refrescarFavoritas();