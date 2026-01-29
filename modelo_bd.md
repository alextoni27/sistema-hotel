# Modelo de Base de Datos — Sistema de alquiler mensual

Descripción: Modelo para un sistema donde un propietario alquila habitaciones mes a mes en 2 casas. Cada casa tiene 3 pisos y cada piso 5 cuartos. El precio varía según el tamaño/tipo de cuarto.

**Entidades principales**

- **House**: Casas del propietario.
- **Floor**: Pisos dentro de una casa.
- **Room**: Cuartos (pertenecen a un piso y a una casa).
- **RoomType**: Tipo/tamaño del cuarto (ej: Pequeño, Mediano, Grande) con precio base.
- **Tenant**: Inquilinos (personas que alquilan).
- **Lease**: Contrato de alquiler (vincula un `Tenant` con un `Room`, con inicio y fin, precio mensual y estado).
- **Payment**: Pagos realizados por periodos mensuales.

---

**Tablas y campos (esquema sugerido SQL)**

```sql
-- Casas
CREATE TABLE House (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL, -- p.ej. 'Casa A' o dirección
  address VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active', -- active/inactive
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pisos
CREATE TABLE Floor (
  id INT PRIMARY KEY AUTO_INCREMENT,
  house_id INT NOT NULL,
  number INT NOT NULL, -- 1,2,3
  description VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active', -- active/inactive
  FOREIGN KEY (house_id) REFERENCES House(id)
);

-- Tipos de cuarto (tamaño y precio base)
CREATE TABLE RoomType (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL, -- 'S' 'M' 'L'
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active', -- active/inactive
  base_price DECIMAL(10,2) NOT NULL -- precio base por mes
);

-- Cuartos
CREATE TABLE Room (
  id INT PRIMARY KEY AUTO_INCREMENT,
  house_id INT NOT NULL,
  floor_id INT NOT NULL,
  number INT NOT NULL, -- número o identificador en el piso (1..5)
  code VARCHAR(50), -- opcional: 'A-1-01' (house-floor-room)
  room_type_id INT NOT NULL,
  area_m2 DECIMAL(6,2),
  current_status VARCHAR(20) DEFAULT 'available', -- available/occupied/maintenance
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (house_id, floor_id, number),
  FOREIGN KEY (house_id) REFERENCES House(id),
  FOREIGN KEY (floor_id) REFERENCES Floor(id),
  FOREIGN KEY (room_type_id) REFERENCES RoomType(id)
);

-- Inquilinos
CREATE TABLE Tenant (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  document VARCHAR(50), -- DNI, pasaporte, etc.
  phone VARCHAR(50),
  email VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active', -- active/inactive
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contratos / Alquileres (mes a mes)
CREATE TABLE Lease (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  room_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE, -- puede ser NULL si es contrato abierto
  monthly_price DECIMAL(10,2) NOT NULL, -- precio acordado (puede tomar base_price de RoomType)
  deposit DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'active', -- active/terminated/pending
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES Tenant(id),
  FOREIGN KEY (room_id) REFERENCES Room(id)
);

-- Pagos mensuales
CREATE TABLE Payment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lease_id INT NOT NULL,
  period_start DATE NOT NULL, -- por ejemplo 2026-02-01
  period_end DATE NOT NULL, -- por ejemplo 2026-02-28
  amount DECIMAL(10,2) NOT NULL,
  paid_at DATETIME, -- fecha de pago
  method VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending', -- pending/paid/overdue
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lease_id) REFERENCES Lease(id)
);
```

---

**Relaciones clave**

- `House 1..N Floor`
- `Floor 1..N Room`
- `RoomType 1..N Room`
- `Tenant 1..N Lease`
- `Room 1..N Lease` (histórico de contratos por cuarto)
- `Lease 1..N Payment`

---

**Ejemplo de datos iniciales**

- `House`: (1, 'Casa 1', 'Dirección 1'), (2, 'Casa 2', 'Dirección 2')
- `Floor`: crear 3 pisos por casa (number 1..3)
- `Room`: por cada piso crear 5 cuartos (number 1..5), asignar `room_type_id`
- `RoomType`: (1,'S','Pequeño', base_price=150.00), (2,'M','Mediano', base_price=250.00), (3,'L','Grande', base_price=350.00)

---

**Índices y restricciones recomendadas**

- Índice único en `Room (house_id, floor_id, number)` para evitar duplicados.
- Índice en `Lease(room_id)` y en `Lease(tenant_id)` para búsquedas rápidas.
- Índice en `Payment(lease_id, period_start)` para consultas por periodo.
- Validar que `period_end` >= `period_start` y `monthly_price` >= 0.

---

**Notas / consideraciones**

- Se modela `monthly_price` en `Lease` para conservar el precio acordado aun si `RoomType.base_price` cambia.
- Si quieres reglas complejas (descuentos, cargos extras, cobros prorrateados), añadir tablas `Charge` o `Adjustment` vinculadas a `Lease` o `Payment`.
- Para manejo de disponibilidad y calendario, considerar una vista o tabla `RoomAvailability` que derive del estado del `Lease`.

---

Si quieres, puedo:
- Generar las migraciones SQL completas.
- Crear un diagrama ER visual (PNG/SVG).
- Implementar CRUD básico en el stack que prefieras (Node/Python/Laravel).

``` 
```