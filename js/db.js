const { createClient } = window.supabase;

const supabase = createClient(
  "https://riszrqkyojucwbbqwkas.supabase.co",
  "sb_publishable_fRGsufn3a9QTy2th-o2TgA_er1Ulsdx"
);

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
