CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE marcas (
	id_marca SERIAL PRIMARY KEY,
	nombre VARCHAR(20) NOT NULL UNIQUE,
	imagen VARCHAR(200)
);

CREATE TABLE relojes (
	id_reloj SERIAL PRIMARY KEY,
	id_marca INT REFERENCES marcas (id_marca) ON DELETE CASCADE,
	nombre VARCHAR(50) NOT NULL,
	mecanismo VARCHAR(50) NOT NULL,
	material VARCHAR(50) NOT NULL,
	imagen VARCHAR(200),
	resistencia_agua INT NOT NULL,
	diametro INT NOT NULL,
	precio INT NOT NULL,
	sexo CHAR NOT NULL
);

CREATE TABLE usuarios (
	id_usuario SERIAL PRIMARY KEY,
	nombre VARCHAR(50) NOT NULL UNIQUE,
	hash_contrasenia VARCHAR(255) NOT NULL,
	rol VARCHAR(20) DEFAULT 'usuario',
	sexo CHAR,
	precio_buscado INT
);

CREATE TABLE resenias (
	id_resenia SERIAL PRIMARY KEY,
	id_reloj INT REFERENCES relojes (id_reloj) ON DELETE CASCADE,
	id_usuario INT REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
	titulo VARCHAR(50),
	resenia TEXT NOT NULL,
	calificacion INT NOT NULL,
	fecha DATE NOT NULL,
	meses_de_uso INT NOT NULL
);

CREATE TABLE relojes_favoritos_usuarios (
	id_usuario INT REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
	id_reloj INT REFERENCES relojes (id_reloj) ON DELETE CASCADE,
	PRIMARY KEY (id_usuario, id_reloj)
);

CREATE TABLE relojes_vistos_usuarios (
	antiguedad SERIAL PRIMARY KEY,
	id_usuario INT REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
	id_reloj INT REFERENCES relojes (id_reloj) ON DELETE CASCADE
);


INSERT INTO marcas (nombre, imagen) VALUES
	('Casio', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZWOJNh_QN9wy735YRBL7M7ZWQTNFMw0fl2g&s'),
	('Seiko', 'https://example.com/seiko.jpg'),
	('Citizen', 'https://example.com/citizen.jpg'),
	('Timex', 'https://example.com/timex.jpg'),
	('Rolex', 'https://example.com/rolex.jpg'),
	('Omega', 'https://example.com/omega.jpg');

INSERT INTO relojes (id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo) VALUES 
	(2, 'Seiko 5', 'Automático', 'Acero Inoxidable', 100, 42, 120000, 'M'),
	(2, 'Prospex Diver', 'Automático', 'Titanio', 200, 44, 250000, 'M'),
	(3, 'Eco-Drive', 'Solar', 'Acero Inoxidable', 100, 40, 180000, 'M'),
	(3, 'Promaster', 'Solar', 'Titanio', 200, 45, 300000, 'M'),
	(1, 'Tiffany', 'Cuarzo', 'Plástico', 100, 38, 100000, 'M'),
	(4, 'Weekender', 'Cuarzo', 'Latón', 30, 38, 40000, 'M'),
	(4, 'Expedition Scout', 'Cuarzo', 'Plástico', 50, 42, 50000, 'M'),
	(1, 'pls pls pls', 'Cuarzo', 'Plástico', 100, 38, 100000, 'M'),
	(5, 'Submariner', 'Automático', 'Oro', 300, 40, 1500000, 'M'),
	(5, 'Datejust', 'Automático', 'Acero Inoxidable', 100, 36, 1300000, 'M'),
	(1, 'Forester', 'Cuarzo', 'Plástico', 100, 38, 100000, 'M'),
	(1, 'Edifice EFV-100', 'Cuarzo', 'Plástico', 100, 39, 100000, 'M'),
	(6, 'Speedmaster', 'Mecánico', 'Acero Inoxidable', 50, 42, 500000, 'M'),
	(6, 'Seamaster', 'Automático', 'Acero Inoxidable', 300, 42, 700000, 'M');

INSERT INTO usuarios (nombre, hash_contrasenia, rol, sexo, precio_buscado) VALUES
	('Marco12', '$2b$10$a.ngcApdpiEi0d/iZn6beekAMGaQYwmgBiSSccp4ic5EDE8k969T6', 'admin', 'M', 120000),
	('Juanfran', '2b$10$K4hkXMuG7rI28hGkybKkBuQ4VK1ELm6zNx7QkBOdfhdK3t4oP1pQi', 'admin', 'M', 300000),
	('Ana', '2b$10$K4hkXMuG7rI28hGkybKkBuQ4VK1ELm6zNx7QkBOdfhdK3t4oP1pQi', 'usuario', 'F', 150000),
	('Luis', '2b$10$K4hkXMuG7rI28hGkybKkBuQ4VK1ELm6zNx7QkBOdfhdK3t4oP1pQi', 'usuario', 'M', 500000),
	('Sofía', '2b$10$K4hkXMuG7rI28hGkybKkBuQ4VK1ELm6zNx7QkBOdfhdK3t4oP1pQi', 'usuario', 'F', 200000),
	('Carlos', '2b$10$K4hkXMuG7rI28hGkybKkBuQ4VK1ELm6zNx7QkBOdfhdK3t4oP1pQi', 'usuario', 'M', 1000000),
	('Marta', '2b$10$K4hkXMuG7rI28hGkybKkBuQ4VK1ELm6zNx7QkBOdfhdK3t4oP1pQi', 'usuario', 'F', 70000);

INSERT INTO relojes_favoritos_usuarios (id_usuario, id_reloj) VALUES 
	(1, 5), 
	(1, 8), 
	(1, 11);

INSERT INTO relojes_vistos_usuarios (id_usuario, id_reloj) VALUES 
	(1, 5), 
	(1, 8), 
	(1, 11);

INSERT INTO resenias (id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso) VALUES
	(1, 2, 'Un tanque en miniatura, impresionante', 'Su diseño simple pero atractivo, sumado a su estilo lo hacen un reloj resistente y muy recomendable', 5, '2025-05-12', 8),
	(2, 1, 'El mejor para el día a día', 'Elegante, resistente, simple y no es caro. Qué más querés pedir?', 5, '2024-11-09', 7),
	(3, 3, 'Clásico y confiable', 'Lo uso todos los días, nunca me falla.', 5, '2025-01-15', 12),
	(4, 4, 'Perfecto para exteriores', 'Ideal para caminatas y actividades al aire libre.', 4, '2025-02-20', 6),
	(5, 5, 'Buena relación calidad/precio', 'No esperaba tanto por este precio.', 4, '2024-12-10', 10),
	(7, 6, 'Una joya', 'Elegancia y calidad incomparables.', 5, '2024-09-05', 24),
	(9, 7, 'El mejor cronógrafo', 'Preciso y hermoso.', 5, '2025-04-30', 18);


CREATE MATERIALIZED VIEW busqueda_relojes AS
	SELECT
		r.id_reloj,
		marcas.nombre AS marca,
		marcas.id_marca AS id_marca,
		r.nombre,
		r.mecanismo,
		r.material,
		r.imagen,
		r.resistencia_agua,
		r.diametro,
		r.precio,
		r.sexo,
		LOWER(r.nombre || ' ' || marcas.nombre || ' ' || r.mecanismo || ' ' || r.material) AS propiedades
	FROM relojes r
	JOIN marcas ON r.id_marca = marcas.id_marca;

CREATE INDEX index_trig_relojes ON busqueda_relojes USING GIN (propiedades gin_trgm_ops);
