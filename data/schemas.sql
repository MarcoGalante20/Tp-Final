create table relojes (
	id serial primary key,
	marca int not null REFERENCES marcas(id),
	nombre varchar(50) not null,
	mecanismo varchar(50) not null default 'Cuarzo',
	material varchar(50) not null default 'Acero-inox',
	imagen varchar(200),
	resistencia_agua int not null default 30,
	diametro int not null,
	precio int not null,
	sexo char
);


create table marcas (
	id serial primary key,
	imagen varchar(200) not null
);

create table usuarios (
	id serial primary key,
	nombre varchar(50) not null,
	contrasenia varchar(50) not null,
	sexo char,
	edad int,
	precio_buscado int
);


create table resenias (
	id serial primary key,
	id_reloj int not null REFERENCES relojes (id),
	id_usuario int not null REFERENCES usuarios (id),
	titulo varchar(50),
	resenia text not null,
	calificacion int not null,
	fecha date not null,
	meses_de_uso int not null
);
 

create table relojes_usuarios (
	id_usuario int not null REFERENCES usuarios (id),
	id_reloj int not null REFERENCES relojes (id)
);


create table extras_reloj (
	id_reloj int not null REFERENCES relojes (id),
	atributo varchar(50) not null
);


INSERT INTO marcas(imagen) VALUES 
	('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZWOJNh_QN9wy735YRBL7M7ZWQTNFMw0fl2g&s');

INSERT INTO relojes (nombre, marca, mecanismo, material, resistencia_agua, diametro, precio, sexo) VALUES 
	(1, 'Forester', 'Cuarzo', 'Plástico', 100, 38, 90000, 'M'), 
	(1, 'Edifice EFV-100', 'Cuarzo', 'Acero inox', 100, 41, 170000, 'M');

INSERT INTO extras_reloj (id_reloj, atributo) VALUES 
	(1, 'Aventurero'), (1, 'Resistente'), (2, 'Deportivo'), (2, 'Elegante');

INSERT INTO relojes_usuarios (id_usuario, id_reloj) VALUES 
	(1, 2), (2, 1);

INSERT INTO usuarios (nombre, contrasenia, sexo, edad, precio_buscado) VALUES
	('Marco12', 'Boquitael+grande', 'M', 19, 120000),
	('Juanfran', 'Calamardexvida', 'M', 19, 300000);

INSERT INTO resenias (titulo, resenia, calificacion, fecha, meses_de_uso, id_reloj, id_usuario) VALUES 
	(1, 2, 'Un tanque en miniatura, impresionante', 'Su diseño simple pero atractivo, sumado a su estilo lo hacen un reloj resistente y muy recomendable', 5, '2025-05-12', 8),
	(2, 1, 'El mejor para el día a día', 'Elegante, resistente, simple y no es caro. Qué más querés pedir?' 5, '2024-11-09', 7);
