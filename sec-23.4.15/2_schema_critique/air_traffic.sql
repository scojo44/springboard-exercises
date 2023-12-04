-- from the terminal run:
-- psql < air_traffic.sql
DROP DATABASE IF EXISTS air_traffic;
CREATE DATABASE air_traffic;
\c air_traffic

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30)
);

CREATE TABLE airlines (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE cities (
  airport_code CHAR(3) PRIMARY KEY,
  name TEXT,
  region TEXT,
  country INT NOT NULL REFERENCES countries ON DELETE CASCADE
);

CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  customer INT NOT NULL REFERENCES customers ON DELETE CASCADE,
  seat TEXT NOT NULL,
  departure TIMESTAMP NOT NULL,
  arrival TIMESTAMP NOT NULL,
  airline INT NOT NULL REFERENCES airlines ON DELETE CASCADE,
  takeoff_from CHAR(3) NOT NULL REFERENCES cities ON DELETE CASCADE,
  land_at CHAR(3) NOT NULL REFERENCES cities ON DELETE CASCADE
);

INSERT INTO countries (name)
VALUES
  ('Brazil'),
  ('Chile'),
  ('China'),
  ('France'),
  ('Japan'),
  ('Mexico'),
  ('Morocco'),
  ('UAE'),
  ('United States'),
  ('United Kingdom');

INSERT INTO cities (airport_code, name, region, country)
VALUES -- Airport codes are made up
  ('SAO', 'Sao Paulo', NULL, 1),
  ('STG', 'Santiago', NULL, 2),
  ('BJG', 'Beijing', NULL, 3),
  ('PRS', 'Paris', NULL, 4),
  ('TKY', 'Tokyo', NULL, 5),
  ('MXC', 'Mexico City', NULL, 6),
  ('CSB', 'Casablanca', NULL, 7),
  ('DBI', 'Dubai', NULL, 8),
  ('CDR', 'Cedar Rapids', 'IA', 9),
  ('CHR', 'Charlotte', 'NC', 9),
  ('CHI', 'Chicago', 'IL', 9),
  ('LAX', 'Los Angeles', 'CA', 9),
  ('VGS', 'Las Vegas', 'NV', 9),
  ('NOR', 'New Orleans', 'LA', 9),
  ('NYC', 'New York City', 'NY', 9),
  ('SEA', 'Seattle', 'WA', 9),
  ('WDC', 'Washington', 'DC', 9),
  ('LDN', 'London', NULL, 10);

INSERT INTO airlines (name)
VALUES
  ('Air China'),
  ('American Airlines'),
  ('Avianca Brasil'),
  ('British Airways'),
  ('Delta'),
  ('TUI Fly Belgium'),
  ('United');

INSERT INTO customers (first_name, last_name)
VALUES
  ('Jennifer', 'Finch'),
  ('Thadeus', 'Gathercoal'),
  ('Sonja', 'Pauley'),
  ('Waneta', 'Skeleton'),
  ('Berkie', 'Wycliff'),
  ('Alvin', 'Leathes'),
  ('Cory', 'Squibbes');

INSERT INTO tickets (customer, seat, departure, arrival, airline, takeoff_from, land_at)
VALUES
  (1, '33B', '2018-04-08 09:00:00', '2018-04-08 12:00:00', 7, 'WDC', 'SEA'),
  (2, '8A', '2018-12-19 12:45:00', '2018-12-19 16:15:00', 4, 'TKY', 'LDN'),
  (3, '12F', '2018-01-02 07:00:00', '2018-01-02 08:03:00', 5, 'LAX', 'VGS'),
  (1, '20A', '2018-04-15 16:50:00', '2018-04-15 21:00:00', 5, 'SEA', 'MXC'),
  (4, '23D', '2018-08-01 18:30:00', '2018-08-01 21:50:00', 6, 'PRS', 'CSB'),
  (2, '18C', '2018-10-31 01:15:00', '2018-10-31 12:55:00', 1, 'DBI', 'BJG'),
  (5, '9E', '2019-02-06 06:00:00', '2019-02-06 07:47:00', 7, 'NYC', 'CHR'),
  (6, '1A', '2018-12-22 14:42:00', '2018-12-22 15:56:00', 2, 'CDR', 'CHI'),
  (5, '32B', '2019-02-06 16:28:00', '2019-02-06 19:18:00', 2, 'CHR', 'NOR'),
  (7, '10D', '2019-01-20 19:30:00', '2019-01-20 22:45:00', 3, 'SAO', 'STG');

-- Query to return the original info
SELECT c.first_name, c.last_name, t.seat, t.departure, t.arrival, a.name as airline, y.name AS take_off_from, z.name AS land_at FROM tickets t
JOIN customers c ON t.customer=c.id
JOIN airlines a ON t.airline=a.id
JOIN cities y ON t.takeoff_from=y.airport_code
JOIN cities z ON t.land_at=z.airport_code;

-- INSERT INTO tickets (customer, seat, departure, arrival, airline, takeoff_from, land_at)
-- VALUES
--   ('Jennifer', 'Finch', '33B', '2018-04-08 09:00:00', '2018-04-08 12:00:00', 'United', 'Washington DC', 'United States', 'Seattle', 'United States'),
--   ('Thadeus', 'Gathercoal', '8A', '2018-12-19 12:45:00', '2018-12-19 16:15:00', 'British Airways', 'Tokyo', 'Japan', 'London', 'United Kingdom'),
--   ('Sonja', 'Pauley', '12F', '2018-01-02 07:00:00', '2018-01-02 08:03:00', 'Delta', 'Los Angeles', 'United States', 'Las Vegas', 'United States'),
--   ('Jennifer', 'Finch', '20A', '2018-04-15 16:50:00', '2018-04-15 21:00:00', 'Delta', 'Seattle', 'United States', 'Mexico City', 'Mexico'),
--   ('Waneta', 'Skeleton', '23D', '2018-08-01 18:30:00', '2018-08-01 21:50:00', 'TUI Fly Belgium', 'Paris', 'France', 'Casablanca', 'Morocco'),
--   ('Thadeus', 'Gathercoal', '18C', '2018-10-31 01:15:00', '2018-10-31 12:55:00', 'Air China', 'Dubai', 'UAE', 'Beijing', 'China'),
--   ('Berkie', 'Wycliff', '9E', '2019-02-06 06:00:00', '2019-02-06 07:47:00', 'United', 'New York', 'United States', 'Charlotte', 'United States'),
--   ('Alvin', 'Leathes', '1A', '2018-12-22 14:42:00', '2018-12-22 15:56:00', 'American Airlines', 'Cedar Rapids', 'United States', 'Chicago', 'United States'),
--   ('Berkie', 'Wycliff', '32B', '2019-02-06 16:28:00', '2019-02-06 19:18:00', 'American Airlines', 'Charlotte', 'United States', 'New Orleans', 'United States'),
--   ('Cory', 'Squibbes', '10D', '2019-01-20 19:30:00', '2019-01-20 22:45:00', 'Avianca Brasil', 'Sao Paolo', 'Brazil', 'Santiago', 'Chile');