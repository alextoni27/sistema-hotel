-- Migración a Postgres para Supabase
-- Ejecutar en SQL Editor de Supabase (proyecto nuevo)

-- Casas
CREATE TABLE public.house (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pisos
CREATE TABLE public.floor (
  id SERIAL PRIMARY KEY,
  house_id INTEGER NOT NULL REFERENCES public.house(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive'))
);
ALTER TABLE public.floor ADD CONSTRAINT uq_floor_house_number UNIQUE (house_id, number);

-- Tipos de cuarto
CREATE TABLE public.room_type (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  base_price NUMERIC(10,2) NOT NULL
);

-- Cuartos
CREATE TABLE public.room (
  id SERIAL PRIMARY KEY,
  house_id INTEGER NOT NULL REFERENCES public.house(id) ON DELETE CASCADE,
  floor_id INTEGER NOT NULL REFERENCES public.floor(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  code VARCHAR(50),
  room_type_id INTEGER NOT NULL REFERENCES public.room_type(id),
  area_m2 NUMERIC(6,2),
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available','occupied','maintenance')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (house_id, floor_id, number)
);

-- Inquilinos
CREATE TABLE public.tenant (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  document VARCHAR(50),
  phone VARCHAR(50),
  email VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Usuarios (para administración / login)
CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150),
  role VARCHAR(30) NOT NULL DEFAULT 'admin', -- admin|user
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contratos / Alquileres (mes a mes)
CREATE TABLE public.lease (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES public.tenant(id),
  room_id INTEGER NOT NULL REFERENCES public.room(id),
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_price NUMERIC(10,2) NOT NULL,
  deposit NUMERIC(10,2),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','terminated','pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pagos mensuales
CREATE TABLE public.payment (
  id SERIAL PRIMARY KEY,
  lease_id INTEGER NOT NULL REFERENCES public.lease(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  paid_at TIMESTAMPTZ,
  method VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices recomendados
CREATE INDEX IF NOT EXISTS idx_room_house_floor ON public.room(house_id, floor_id);
CREATE INDEX IF NOT EXISTS idx_lease_room ON public.lease(room_id);
CREATE INDEX IF NOT EXISTS idx_lease_tenant ON public.lease(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payment_lease_period ON public.payment(lease_id, period_start);

-- Ejemplos de inserción (opcional)
INSERT INTO public.room_type(code, name, base_price) VALUES
('S','Pequeño',150.00),
('M','Mediano',250.00),
('L','Grande',350.00);

INSERT INTO public.house(name, address) VALUES ('Casa 1','Dirección 1'),('Casa 2','Dirección 2');

-- Crear 3 pisos por casa
INSERT INTO public.floor(house_id, number) VALUES
(1,1),(1,2),(1,3),(2,1),(2,2),(2,3);

-- Ejemplo: crear cuartos (house 1, floor 1)
INSERT INTO public.room(house_id, floor_id, number, code, room_type_id, area_m2) VALUES
(1,1,1,'H1-F1-R1',1,12.5),(1,1,2,'H1-F1-R2',1,11.0),(1,1,3,'H1-F1-R3',2,18.0),(1,1,4,'H1-F1-R4',2,20.0),(1,1,5,'H1-F1-R5',3,28.0);

-- Fin del script
