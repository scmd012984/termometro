-- Crea la tabla de búsquedas
create table busquedas (
  id bigint generated always as identity primary key,
  ciudad text not null,
  temperatura double precision not null,
  creada_en timestamptz default now()
);

-- Activa la seguridad a nivel de fila (RLS)
alter table busquedas enable row level security;

-- Permite leer y escribir desde el frontend (clave publishable)
create policy "lectura y escritura publica"
  on busquedas for all
  to anon using (true) with check (true);