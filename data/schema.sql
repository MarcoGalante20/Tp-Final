create table relojes (
	id serial primary key,
	nombre varchar(50) not null,
	marca varchar(50) not null,
	mecanismo varchar(50) not null,
	material varchar(50) not null,
	imagen varchar(200),
	resistencia_agua int not null default 30,
	diametro int not null,
	precio int,
	sexo char
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
	titulo varchar(50),
	resenia text not null,
	calificacion int not null,
	fecha date not null,
	meses_de_uso int not null,
	id_reloj int REFERENCES relojes (id),
	id_usuario int REFERENCES usuarios (id)
);
 

create table relojes_usuarios (
	id_usuario int REFERENCES usuarios (id),
	id_reloj int REFERENCES relojes (id)
);


create table extras_reloj (
	id_reloj int REFERENCES relojes (id),
	atributo varchar(50) not null
);


INSERT INTO relojes (nombre, marca, mecanismo, material, resistencia_agua, diametro, precio, sexo) VALUES 
	('Forester', 'Casio', 'Cuarzo', 'Plástico', 100, 38, 90000, 'M'), 
	('Edifice EFV-100', 'Casio', 'Cuarzo', 'Acero inox', 100, 41, 170000, 'M');

INSERT INTO extras_reloj (id_reloj, atributo) VALUES 
	(1, 'Aventurero'), (1, 'Resistente'), (2, 'Deportivo'), (2, 'Elegante');

INSERT INTO relojes_usuarios (id_usuario, id_reloj) VALUES 
	(1, 2), (2, 1);

INSERT INTO usuarios (nombre, contrasenia, sexo, edad, precio_buscado) VALUES
	('Marco12', 'Boquitael+grande', 'M', 19, 120000),
	('Juanfran', 'Calamardexvida', 'M', 19, 300000);

INSERT INTO resenias (titulo, resenia, calificacion, fecha, meses_de_uso, id_reloj, id_usuario) VALUES 
	('Un tanque en miniatura, impresionante', 'Su diseño simple pero atractivo, sumado a su estilo lo hacen un reloj resistente y muy recomendable', 5, '2025-05-12', 8, 1, 2),
	('El mejor para el día a día', 'Elegante, resistente, simple y no es caro. Qué más querés pedir?' 5, '2024-11-09', 7, 2, 1);
