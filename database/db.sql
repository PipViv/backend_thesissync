CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    carrera INTEGER NOT NULL,
    celular VARCHAR(20) NOT NULL,
    passwd VARCHAR(100) NOT NULL
);

CREATE TABLE tokens (
	id SERIAL PRIMARY KEY,
	usuario VARCHAR(100) NOT NULL,
	refresh_token VARCHAR(255) NOT NULL
)

CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    user_id_public INT,
    user_id_a INT,
    user_id_b INT,
    user_id_tutor INT,
    comentario TEXT,
    title VARCHAR(255),
    fecha_creacion DATE,
    FOREIGN KEY (user_id_public) REFERENCES users(id),
    FOREIGN KEY (user_id_a) REFERENCES users(id),
    FOREIGN KEY (user_id_b) REFERENCES users(id),
    FOREIGN KEY (user_id_tutor) REFERENCES users(id)
);

CREATE TABLE chats(
	id SERIAL PRIMARY KEY,
	message TEXT,
	autor INT,
	doc INT,
	send DATE,
	FOREIGN KEY (autor) REFERENCES users(id),
	FOREIGN KEY (doc) REFERENCES documents(id)
)

CREATE TABLE programs(
	id SERIAL PRIMARY KEY,
	nombre VARCHAR	
);

CREATE TABLE users_programs(
	id SERIAL PRIMARY KEY,
	student INT,
	programd INT,
	FOREIGN KEY (student) REFERENCES users(id),
	FOREIGN KEY (programd) REFERENCES programs(id)
);

CREATE TABLE users_students(
	id SERIAL PRIMARY KEY,
	student INT,
	FOREIGN KEY (student) REFERENCES users(id)
);


CREATE TABLE faculty(
	id SERIAL PRIMARY KEY,
	sede VARCHAR	
);

CREATE TABLE users_faculty(
	id SERIAL PRIMARY KEY,
	teacher INT,
	faculty INT,
	FOREIGN KEY (teacher) REFERENCES users(id),
	FOREIGN KEY (faculty) REFERENCES faculty(id)
);

CREATE TABLE users_teachers(
	id SERIAL PRIMARY KEY,
	usert INT,
	FOREIGN KEY (usert) REFERENCES users(id)
);

CREATE TABLE periods(
	id SERIAL PRIMARY KEY,
	name TEXT,
	start_period DATE,
	tesis_up_end DATE,
	tesis_evaluation_end DATE,
	end_period DATE,
	created DATE
)

CREATE TABLE fotos (
    id SERIAL PRIMARY KEY,
    contenido BYTEA NOT NULL,
	user_id INT,
	FOREIGN KEY (user_id) REFERENCES users(id)

);

CREATE TABLE rols(
	id SERIAL PRIMARY KEY,
	nombre VARCHAR	
);

CREATE TABLE users_rols(
	id SERIAL PRIMARY KEY,
	userd INT,
	rol INT,
	FOREIGN KEY (userd) REFERENCES users(id),
	FOREIGN KEY (rol) REFERENCES rols(id)
);

CREATE TABLE jurado_documents(
	id SERIAL PRIMARY KEY,
	jurado INT,
	tesis INT,
	FOREIGN KEY (jurado) REFERENCES users(id),
	FOREIGN KEY (tesis) REFERENCES documents(id)
);

CREATE TABLE calificacion(
	id SERIAL PRIMARY KEY,
	calificacion DOUBLE PRECISION,
	investigacion DOUBLE PRECISION,
	documento DOUBLE PRECISION,
	thesis_id INT,
	
);
CREATE TABLE evaluaciones (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER ,
    investigacion DOUBLE PRECISION,
    ortografia DOUBLE PRECISION,
    bibliografia DOUBLE PRECISION,
    final DOUBLE PRECISION,
	FOREIGN KEY (thesis_id) REFERENCES documents(id)
);