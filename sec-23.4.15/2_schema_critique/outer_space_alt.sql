-- Here's an alternate version of the outer_space schema.
-- The heavenly bodies are listed in one table with a body type and the body it orbits.
-- This schema works great since orbits can be nested: Moon > Planet > Star > Galaxy.
-- Even moons are listed so I looked up their orbital periods around their respective planets for completeness.
-- Stars have NULL for orbits_around so the query instead returns the galaxy.

-- from the terminal run:
-- psql < outer_space_alt.sql
DROP DATABASE IF EXISTS outer_space_alt;
CREATE DATABASE outer_space_alt;
\c outer_space_alt

CREATE TABLE object_types (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE galaxies (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE natural_orbiters (
  id SERIAL PRIMARY KEY,
  type INT NOT NULL REFERENCES object_types ON DELETE CASCADE,
  name TEXT NOT NULL,
  orbital_period_in_years FLOAT NOT NULL,
  orbits_around INT REFERENCES natural_orbiters ON DELETE CASCADE, -- If NULL, object only orbits its galaxy
  galaxy INT NOT NULL REFERENCES galaxies ON DELETE CASCADE
);

INSERT INTO object_types (name)
VALUES ('Galaxy'), ('Drawf Galaxy'), ('Star'), ('Planet'), ('Moon'), ('Dwarf Planet'),
  ('Exoplanet'), ('Asteroid'), ('Comet'), ('Black Hole'), ('Quasar'), ('Nebula');

INSERT INTO galaxies (name)
VALUES ('Milky Way'), ('Andromeda'), ('Eye of Sauron');

INSERT INTO natural_orbiters (type, name, orbital_period_in_years, orbits_around, galaxy)
VALUES
  (3, 'The Sun', 250000000.00, NULL, 1),
  (3, 'Proxima Centauri', 250000000.00, NULL, 1),
  (3, 'Gliese 876', 250000000.00, NULL, 1),
  (4, 'Earth', 1.00, 1, 1),
  (4, 'Mars', 1.88, 1, 1),
  (4, 'Venus', 0.62, 1, 1),
  (4, 'Neptune', 164.8, 1, 1),
  (7, 'Proxima Centauri b', 0.03, 2, 1),
  (7, 'Gliese 876 b', 0.23, 3, 1),
  (5, 'The Moon', 0.08, 4, 1),
  (5, 'Phobos', 0.000873, 5, 1),
  (5, 'Deimos', 0.003458, 5, 1),
  (5, 'Naiad', 0.000806, 7, 1),
  (5, 'Thalassa', 0.000853, 7, 1),
  (5, 'Despina', 0.000916, 7, 1),
  (5, 'Galatea', 0.001174, 7, 1),
  (5, 'Larissa', 0.001521, 7, 1),
  (5, 'Hippocamp', 0.002601, 7, 1), -- Formerly S/2004 N 1
  (5, 'Proteus', 0.003073, 7, 1),
  (5, 'Triton', 0.01609, 7, 1),
  (5, 'Nereid', 0.98601, 7, 1),
  (5, 'Halimede', 5.145243, 7, 1),
  (5, 'Sao', 7.990965, 7, 1),
  (5, 'Laomedeia', 8.694456, 7, 1),
  (5, 'Psamathe', 25.050979, 7, 1),
  (5, 'Neso', 26.821821, 7, 1);

-- Query to return the complete list of heavenly bodies
SELECT o.name AS body, t.name AS type, COALESCE((
    SELECT name from natural_orbiters
    WHERE id = o.orbits_around
  ), g.name -- Return the galaxy if body doesn't orbit anything else
) AS orbits_around, o.orbital_period_in_years, g.name AS galaxy, ARRAY(
  SELECT n.name FROM natural_orbiters n
  WHERE n.orbits_around = o.id
) AS satellites
FROM natural_orbiters o
JOIN galaxies g ON o.galaxy=g.id
JOIN object_types t ON o.type=t.id;

-- Query to return the original info. Idenical to the above query except the added WHERE clause.
SELECT o.name AS body, t.name AS type, COALESCE((
    SELECT name from natural_orbiters
    WHERE id = o.orbits_around
  ), g.name -- Return the galaxy if body doesn't orbit anything else
) AS orbits_around, o.orbital_period_in_years, g.name AS galaxy, ARRAY(
  SELECT n.name FROM natural_orbiters n
  WHERE n.orbits_around = o.id
) AS satellites
FROM natural_orbiters o
JOIN galaxies g ON o.galaxy=g.id
JOIN object_types t ON o.type=t.id
WHERE t.name = 'Planet' OR t.name = 'Exoplanet';

-- INSERT INTO planets (name, orbital_period_in_years, orbits_around, galaxy, moons)
-- VALUES
--   ('Earth', 1.00, 'The Sun', 'Milky Way', '{"The Moon"}'),
--   ('Mars', 1.88, 'The Sun', 'Milky Way', '{"Phobos", "Deimos"}'),
--   ('Venus', 0.62, 'The Sun', 'Milky Way', '{}'),
--   ('Neptune', 164.8, 'The Sun', 'Milky Way', '{"Naiad", "Thalassa", "Despina", "Galatea", "Larissa",
--       "Hippocamp", "Proteus", "Triton", "Nereid", "Halimede", "Sao", "Laomedeia", "Psamathe", "Neso"}'),
--   ('Proxima Centauri b', 0.03, 'Proxima Centauri', 'Milky Way', '{}'),
--   ('Gliese 876 b', 0.23, 'Gliese 876', 'Milky Way', '{}');