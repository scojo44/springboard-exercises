CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30),
  home_town VARCHAR(30) NOT NULL,
  birthdate DATETIME NOT NULL
);

CREATE TABLE referees (
  id SERIAL PRIMARY KEY,
  person INT REFERENCES people ON DELETE CASCADE,
);
CREATE TABLE seasons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
);
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL,
  location VARCHAR(30) NOT NULL,
  stadium VARCHAR(30)
);
CREATE TABLE positions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL,
);
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  person INT REFERENCES people NOT NULL ON DELETE CASCADE,
  team INT REFERENCES teams ON DELETE SET NULL,
  position INT REFERENCES positions ON DELETE SET NULL
);
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  gametime DATETIME NOT NULL,
  name VARCHAR(50), -- league semifinal, Chicken Bowl, etc.
  status VARCHAR(30) NOT NULL DEFAULT 'future', -- ongoing, completed, postponed, etc.
  referee INT REFERENCES referees NOT NULL ON DELETE SET NULL,
  season INT REFERENCES seasons NOT NULL ON DELETE CASCADE,
  away_team INT REFERENCES teams NOT NULL ON DELETE CASCADE,
  home_team INT REFERENCES teams NOT NULL ON DELETE CASCADE
);
CREATE TABLE lineups (
  id SERIAL PRIMARY KEY,
  position INT REFERENCES positions NOT NULL ON DELETE SET NULL,
  match INT REFERENCES matches NOT NULL ON DELETE CASCADE,
  player INT REFERENCES players NOT NULL ON DELETE SET NULL,
  team INT REFERENCES teams NOT NULL ON DELETE SET NULL
);
CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  game_minutes INT NOT NULL,
  match INT REFERENCES matches NOT NULL ON DELETE CASCADE,
  lineup_position INT REFERENCES lineups NOT NULL ON DELETE CASCADE
);
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  match INT REFERENCES matches NOT NULL ON DELETE CASCADE,
  winning_team INT REFERENCES teams NOT NULL ON DELETE SET NULL,
  away_score INT NOT NULL,
  home_score INT NOT NULL
);