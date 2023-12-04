-- from the terminal run:
-- psql < music.sql

DROP DATABASE IF EXISTS music;
CREATE DATABASE music;
\c music

CREATE TABLE artists (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE albums (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  release_date DATE NOT NULL,
  artist INT NOT NULL REFERENCES artists ON DELETE CASCADE
);

CREATE TABLE songs
(
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  duration_in_seconds INTEGER NOT NULL,
  release_date DATE NOT NULL,
  album INT NOT NULL REFERENCES albums ON DELETE CASCADE
);

CREATE TABLE song_artists (
  id SERIAL PRIMARY KEY,
  song INT NOT NULL REFERENCES songs ON DELETE CASCADE,
  artist INT NOT NULL REFERENCES artists ON DELETE CASCADE
);

CREATE TABLE song_producers (
  id SERIAL PRIMARY KEY,
  song INT NOT NULL REFERENCES songs ON DELETE CASCADE,
  producer INT NOT NULL REFERENCES artists ON DELETE CASCADE
);

CREATE TABLE playlist
(
  id SERIAL PRIMARY KEY,
  song INT NOT NULL REFERENCES songs ON DELETE CASCADE
);

INSERT INTO artists (name)
VALUES
  ('Al Shux'),
  ('Alicia Keys'),
  ('Avril Lavigne'),
  ('Benjamin Rice'),
  ('Benny Blanco'),
  ('Boyz II Men'),
  ('Bradley Cooper'),
  ('Christina Aguilera'),
  ('Cirkut'),
  ('Darkchild'),
  ('Destiny''s Child'),
  ('Dust Brothers'),
  ('Hanson'),
  ('Jay Z'),
  ('Juicy J'),
  ('Katy Perry'),
  ('Lady Gaga'),
  ('Mariah Carey'),
  ('Maroon 5'),
  ('Max Martin'),
  ('Nickelback'),
  ('Queen'),
  ('Rick Parashar'),
  ('Roy Thomas Baker'),
  ('Shellback'),
  ('Stephen Lironi'),
  ('The Matrix'),
  ('Various Artists'),
  ('Walter Afanasieff');

INSERT INTO albums (name, release_date, artist)
VALUES
  ('A Night at the Opera', '11-21-1975', 22),
  ('A Star Is Born OST', '10-05-2018', 28),
  ('Daydream', '09-26-1995', 18),
  ('Hands All Over', '09-15-2010', 19),
  ('Let Go', '06-04-2002', 3),
  ('Middle of Nowhere', '05-06-1997', 13),
  ('Prism', '10-18-2013', 16),
  ('Silver Side Up', '09-11-2001', 21),
  ('The Blueprint 3', '09-08-2009', 14),
  ('The Writing''s on the Wall', '07-14-1999', 11);

INSERT INTO songs (title, duration_in_seconds, release_date, album)
VALUES
  ('Bohemian Rhapsody', 355, '10-31-1975', 1),
  ('Complicated', 244, '05-14-2002', 5),
  ('Dark Horse', 215, '12-17-2013', 7),
  ('How You Remind Me', 223, '08-21-2001', 8),
  ('MMMBop', 238, '04-15-1997', 6),
  ('Moves Like Jagger', 201, '06-21-2011', 4),
  ('New York State of Mind', 276, '10-20-2009', 9),
  ('One Sweet Day', 282, '11-14-1995', 3),
  ('Say My Name', 240, '11-07-1999', 10),
  ('Shallow', 216, '09-27-2018', 2);

INSERT INTO song_artists (song, artist)
VALUES
  (5, 13),
  (1, 22),
  (8, 18),
  (8, 6),
  (10, 17),
  (10, 7),
  (4, 21),
  (7, 14),
  (7, 2),
  (3, 16),
  (3, 15),
  (6, 19),
  (6, 8),
  (2, 3),
  (9, 11);

INSERT INTO song_producers (song, producer)
VALUES
  (5, 12),
  (5, 26),
  (1, 24),
  (8, 29),
  (10, 4),
  (4, 23),
  (7, 1),
  (3, 20),
  (3, 9),
  (6, 25),
  (6, 5),
  (2, 27),
  (9, 10);

INSERT INTO playlist (song)
VALUES (5), (1), (8), (10), (4), (7), (3), (6), (2), (9);

-- Query to return the original info
SELECT DISTINCT p.id, s.title AS song, s.duration_in_seconds, s.release_date, ARRAY(
  SELECT a2.name FROM song_artists sa2
  JOIN artists a2 ON sa2.artist=a2.id
  WHERE sa2.song = s.id
) AS artists,
cd.name AS album, ARRAY(
  SELECT a2.name FROM song_producers sp2
  JOIN artists a2 ON sp2.producer=a2.id
  WHERE sp2.song = s.id
) AS producers
FROM playlist p
JOIN songs s on p.song=s.id
JOIN albums cd on s.album=cd.id
JOIN song_artists sa on sa.song=s.id
JOIN song_producers sp on sp.song=s.id
JOIN artists a on sa.artist=a.id
ORDER BY p.id;

-- INSERT INTO songs (title, duration_in_seconds, release_date, artists, album, producers)
  -- ('MMMBop', 238, '04-15-1997', '{"Hanson"}', 'Middle of Nowhere', '{"Dust Brothers", "Stephen Lironi"}'),
  -- ('Bohemian Rhapsody', 355, '10-31-1975', '{"Queen"}', 'A Night at the Opera', '{"Roy Thomas Baker"}'),
  -- ('One Sweet Day', 282, '11-14-1995', '{"Mariah Cary", "Boyz II Men"}', 'Daydream', '{"Walter Afanasieff"}'),
  -- ('Shallow', 216, '09-27-2018', '{"Lady Gaga", "Bradley Cooper"}', 'A Star Is Born', '{"Benjamin Rice"}'),
  -- ('How You Remind Me', 223, '08-21-2001', '{"Nickelback"}', 'Silver Side Up', '{"Rick Parashar"}'),
  -- ('New York State of Mind', 276, '10-20-2009', '{"Jay Z", "Alicia Keys"}', 'The Blueprint 3', '{"Al Shux"}'),
  -- ('Dark Horse', 215, '12-17-2013', '{"Katy Perry", "Juicy J"}', 'Prism', '{"Max Martin", "Cirkut"}'),
  -- ('Moves Like Jagger', 201, '06-21-2011', '{"Maroon 5", "Christina Aguilera"}', 'Hands All Over', '{"Shellback", "Benny Blanco"}'),
  -- ('Complicated', 244, '05-14-2002', '{"Avril Lavigne"}', 'Let Go', '{"The Matrix"}'),
  -- ('Say My Name', 240, '11-07-1999', '{"Destiny''s Child"}', 'The Writing''s on the Wall', '{"Darkchild"}');