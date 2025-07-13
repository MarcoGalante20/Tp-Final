create table marcas (
	id_marca serial primary key,
	nombre varchar(20),
	imagen varchar(200)
);

create table relojes (
	id_reloj serial primary key,
	id_marca int REFERENCES marcas (id_marca) ON DELETE CASCADE,
	nombre varchar(50) not null,
	mecanismo varchar(50) not null default 'Cuarzo',
	material varchar(50) not null default 'Acero-inox',
	imagen varchar(200),
	resistencia_agua int not null default 30,
	diametro int not null,
	precio int not null,
	sexo char
);

create table usuarios (
	id_usuario serial primary key,
	nombre varchar(50) not null,
	contrasenia varchar(50) not null,
	sexo char,
	edad int,
	precio_buscado int
);


create table resenias (
	id_resenia serial primary key,
	id_reloj int REFERENCES relojes (id_reloj) ON DELETE CASCADE,
	id_usuario int REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
	titulo varchar(50),
	resenia text not null,
	calificacion int not null,
	fecha date not null,
	meses_de_uso int not null
);


create table relojes_usuarios (
	id_usuario int REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
	id_reloj int REFERENCES relojes (id_reloj) ON DELETE CASCADE
);


create table extras_reloj (
	id_reloj int REFERENCES relojes (id_reloj) ON DELETE CASCADE,
	atributo varchar(50) not null
);

INSERT INTO marcas (nombre, imagen) VALUES
	('Casio', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZWOJNh_QN9wy735YRBL7M7ZWQTNFMw0fl2g&s'),
	('Seiko', 'https://example.com/seiko.jpg'),
	('Citizen', 'https://example.com/citizen.jpg'),
	('Timex', 'https://example.com/timex.jpg'),
	('Rolex', 'https://example.com/rolex.jpg'),
	('Omega', 'https://example.com/omega.jpg');

INSERT INTO relojes (id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo) VALUES
	(1, 'Forester', 'Cuarzo', 'Plástico', 100, 38, 90000, 'M'), 
	(1, 'Edifice EFV-100', 'Cuarzo', 'Acero-inox', 100, 41, 170000, 'M'),
	(2, 'Seiko 5', 'Automático', 'Acero-inox', 100, 42, 120000, 'M'),
	(2, 'Prospex Diver', 'Automático', 'Titanio', 200, 44, 250000, 'M'),
	(3, 'Eco-Drive', 'Solar', 'Acero-inox', 100, 40, 180000, 'M'),
	(3, 'Promaster', 'Solar', 'Titanio', 200, 45, 300000, 'M'),
	(4, 'Weekender', 'Cuarzo', 'Latón', 30, 38, 40000, 'M'),
	(4, 'Expedition Scout', 'Cuarzo', 'Plástico', 50, 42, 50000, 'M'),
	(5, 'Submariner', 'Automático', 'Oro', 300, 40, 1500000, 'M'),
	(5, 'Datejust', 'Automático', 'Acero-inox', 100, 36, 1300000, 'M'),
	(6, 'Speedmaster', 'Mecánico', 'Acero-inox', 50, 42, 500000, 'M'),
	(6, 'Seamaster', 'Automático', 'Acero-inox', 300, 42, 700000, 'M');

INSERT INTO extras_reloj (id_reloj, atributo) VALUES
	(1, 'Aventurero'), 
	(1, 'Resistente'), 
	(2, 'Deportivo'), 
	(2, 'Elegante'),
	(3, 'Clásico'),
	(3, 'Resistente al agua'),
	(4, 'Deportivo'),
	(4, 'Buena luminosidad'),
	(5, 'Casual'),
	(5, 'Económico'),
	(6, 'Aventurero'),
	(6, 'Con brújula'),
	(7, 'Lujo'),
	(7, 'Duradero'),
	(8, 'Prestigioso'),
	(8, 'Diseño clásico'),
	(9, 'Cronógrafo'),
	(9, 'Alta precisión'),
	(10, 'Buceo'),
	(10, 'Elegante');

INSERT INTO usuarios (nombre, contrasenia, sexo, edad, precio_buscado) VALUES
	('Marco12', 'Boquitael+grande', 'M', 19, 120000),
	('Juanfran', 'Calamardexvida', 'M', 19, 300000),
	('Ana', 'pass123', 'F', 25, 150000),
	('Luis', 'contraseña', 'M', 32, 500000),
	('Sofía', 'abcd1234', 'F', 28, 200000),
	('Carlos', 'qwerty', 'M', 40, 1000000),
	('Marta', 'zxcvbn', 'F', 35, 70000);

INSERT INTO relojes_usuarios (id_usuario, id_reloj) VALUES 
	(1, 2), 
	(2, 1),
	(3, 3),
	(4, 4),
	(5, 5),
	(6, 7),
	(7, 9);

INSERT INTO resenias (id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso) VALUES
	(1, 2, 'Un tanque en miniatura, impresionante', 'Su diseño simple pero atractivo, sumado a su estilo lo hacen un reloj resistente y muy recomendable', 5, '2025-05-12', 8),
	(2, 1, 'El mejor para el día a día', 'Elegante, resistente, simple y no es caro. Qué más querés pedir?', 5, '2024-11-09', 7),
	(3, 3, 'Clásico y confiable', 'Lo uso todos los días, nunca me falla.', 5, '2025-01-15', 12),
	(4, 4, 'Perfecto para exteriores', 'Ideal para caminatas y actividades al aire libre.', 4, '2025-02-20', 6),
	(5, 5, 'Buena relación calidad/precio', 'No esperaba tanto por este precio.', 4, '2024-12-10', 10),
	(7, 6, 'Una joya', 'Elegancia y calidad incomparables.', 5, '2024-09-05', 24),
	(9, 7, 'El mejor cronógrafo', 'Preciso y hermoso.', 5, '2025-04-30', 18);
