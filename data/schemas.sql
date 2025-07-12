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
	('Casio', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZWOJNh_QN9wy735YRBL7M7ZWQTNFMw0fl2g&s');


INSERT INTO relojes (id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo) VALUES 
	(1, 'Forester', 'Cuarzo', 'Plástico', 100, 38, 90000, 'M'), 
	(1, 'Edifice EFV-100', 'Cuarzo', 'Acero inox', 100, 41, 170000, 'M');

INSERT INTO extras_reloj (id_reloj, atributo) VALUES 
	(1, 'Aventurero'), (1, 'Resistente'), (2, 'Deportivo'), (2, 'Elegante');
	
INSERT INTO usuarios (nombre, contrasenia, sexo, edad, precio_buscado) VALUES
	('Marco12', 'Boquitael+grande', 'M', 19, 120000),
	('Juanfran', 'Calamardexvida', 'M', 19, 300000);

INSERT INTO relojes_usuarios (id_usuario, id_reloj) VALUES 
	(1, 2), (2, 1);

INSERT INTO resenias (id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso) VALUES 
	(1, 2, 'Un tanque en miniatura, impresionante', 'Su diseño simple pero atractivo, sumado a su estilo lo hacen un reloj resistente y muy recomendable', 5, '2025-05-12', 8),
	(2, 1, 'El mejor para el día a día', 'Elegante, resistente, simple y no es caro. Qué más querés pedir?', 5, '2024-11-09', 7);
