CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30),
  birthdate DATETIME NOT NULL
);

CREATE TABLE clinics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  location VARCHAR(100),
  founding DATETIME
);

CREATE TABLE conditions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL,
  description TEXT,
  scientific_paper VARCHAR(30),
  cure VARCHAR(30)
);

CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  person INT UNIQUE REFERENCES people NOT NULL,
  primary_doctor INT REFERENCES doctors ON DELETE SET NULL,
  insurance VARCHAR(30)
);

CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  person INT UNIQUE REFERENCES people NOT NULL ON DELETE CASCADE,
  clinic INT REFERENCES clinics NOT NULL ON DELETE SET NULL,
  specialty VARCHAR(30),
  graduation_year INT,
  college VARCHAR(30)
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  when DATETIME UNIQUE NOT NULL,
  patient INT REFERENCES patients NOT NULL ON DELETE CASCADE,
  doctor INT REFERENCES doctors NOT NULL ON DELETE SET NULL,
  clinic INT REFERENCES clinics NOT NULL ON DELETE SET NULL
);

CREATE TABLE diagnoses (
  id SERIAL PRIMARY KEY,
  note TEXT,
  appointment INT REFERENCES appointments NOT NULL ON DELETE CASCADE,
  condition INT REFERENCES conditions NOT NULL ON DELETE CASCADE
);