import { buscarCiudad, obtenerTemperaturas } from "./api.js";
import { pintarGrafico, mostrarCargando, mostrarError, limpiarEstado } from "./render.js";
import { guardarCiudad, cargarFavoritas } from "./db.js";

const $input = document.getElementById("input-ciudad");
const $boton = document.getElementById("btn-buscar");
const $botonGuardar = document.getElementById("btn-guardar");
const $listaFavoritas = document.getElementById("lista-favoritas");

let cargando = false;

// La ciudad que hay AHORA en pantalla. Dentro de manejarBusqueda, la
// variable ⁠ ciudad ⁠ es local: nace y muere dentro de la función. Cuando
// pulses «guardar» ya no existiría, así que la copiamos aquí.
let ciudadActual = null;

async function manejarBusqueda() {
  const consulta = $input.value.trim();
  if (!consulta || cargando) return;

  cargando = true;
  mostrarCargando();

  try {
    const ciudad = await buscarCiudad(consulta);
    if (!ciudad) {
      mostrarError("No se encontró la ciudad");
      return;
    }

    const temps = await obtenerTemperaturas(ciudad.latitude, ciudad.longitude);
    ciudadActual = ciudad;
    pintarGrafico(ciudad, temps);
    limpiarEstado();
  } catch (error) {
    mostrarError("Error al obtener los datos");
  } finally {
    cargando = false;
  }
}

$boton.addEventListener("click", manejarBusqueda);

$input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") manejarBusqueda();
});

if ($botonGuardar) {
  $botonGuardar.addEventListener("click", async () => {
    if (!ciudadActual) return;
    await guardarCiudad(ciudadActual.name);
    await cargarFavoritas();
  });
}

// Cargar las favoritas al iniciar la página
cargarFavoritas();