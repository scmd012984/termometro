import { supabase } from "./supabase.js";

export async function guardarCiudad(nombre, lat, lon) {
  const { error } = await supabase
    .from("ciudades_favoritas")
    .insert({ nombre, lat, lon });
  if (error) throw new Error(error.message);
}

export async function cargarFavoritas() {
  const { data, error } = await supabase
    .from("ciudades_favoritas")
    .select();
  if (error) throw new Error(error.message);
  return data;
}