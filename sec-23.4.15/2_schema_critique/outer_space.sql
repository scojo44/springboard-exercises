-- from the terminal run:
-- psql < outer_space.sql
DROP DATABASE IF EXISTS outer_space;
CREATE DATABASE outer_space;
\c outer_space

CREATE TABLE galaxies (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE stars (
  id SERIAL PRIMARY KEY,
  name TEXT,
  galaxy INT NOT NULL REFERENCES galaxies ON DELETE CASCADE
);

CREATE TABLE planets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  orbital_period_in_years FLOAT NOT NULL,
  star INT NOT NULL REFERENCES stars ON DELETE CASCADE
);

CREATE TABLE moons (
  id SERIAL PRIMARY KEY,
  name TEXT,
  planet INT NOT NULL REFERENCES planets
);

INSERT INTO galaxies (name)
VALUES ('Milky Way'), ('Andromeda'), ('Eye of Sauron');

INSERT INTO stars (name, galaxy)
VALUES
  ('The Sun', 1),
  ('Proxima Centauri', 1),
  ('Gliese 876', 1);

INSERT INTO planets (name, orbital_period_in_years, star)
VALUES
  ('Earth', 1.00, 1),
  ('Mars', 1.88, 1),
  ('Venus', 0.62, 1),
  ('Neptune', 164.8, 1),
  ('Proxima Centauri b', 0.03, 2),
  ('Gliese 876 b', 0.23, 3);

INSERT INTO moons (name, planet)
VALUES
  ('The Moon', 1),
  ('Phobos', 2),
  ('Deimos', 2),
  ('Naiad', 4),
  ('Thalassa', 4),
  ('Despina', 4),
  ('Galatea', 4),
  ('Larissa', 4),
  ('S/2004 N 1', 4),
  ('Proteus', 4),
  ('Triton', 4),
  ('Nereid', 4),
  ('Halimede', 4),
  ('Sao', 4),
  ('Laomedeia', 4),
  ('Psamathe', 4),
  ('Neso', 4);

-- Query to return the original info
SELECT DISTINCT p.name, p.orbital_period_in_years, p.star, s.galaxy, ARRAY(
  SELECT m2.name FROM moons m2
  JOIN planets p2 ON m2.planet = p2.id
  WHERE m2.planet = p.id
) AS moons
FROM planets p
LEFT JOIN moons m ON p.id=m.planet
JOIN stars s ON p.star=s.id
JOIN galaxies g ON s.galaxy=g.id
ORDER BY p.star;

-- INSERT INTO planets (name, orbital_period_in_years, orbits_around, galaxy, moons)
-- VALUES
--   ('Earth', 1.00, 'The Sun', 'Milky Way', '{"The Moon"}'),
--   ('Mars', 1.88, 'The Sun', 'Milky Way', '{"Phobos", "Deimos"}'),
--   ('Venus', 0.62, 'The Sun', 'Milky Way', '{}'),
--   ('Neptune', 164.8, 'The Sun', 'Milky Way', '{"Naiad", "Thalassa", "Despina", "Galatea", "Larissa",
--       "S/2004 N 1", "Proteus", "Triton", "Nereid", "Halimede", "Sao", "Laomedeia", "Psamathe", "Neso"}'),
--   ('Proxima Centauri b', 0.03, 'Proxima Centauri', 'Milky Way', '{}'),
--   ('Gliese 876 b', 0.23, 'Gliese 876', 'Milky Way', '{}');