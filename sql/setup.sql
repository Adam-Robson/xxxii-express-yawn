-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR
);

CREATE TABLE restaurants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR NOT NULL,
  cuisine VARCHAR NOT NULL,
  cost INT NOT NULL,
  image VARCHAR,
  website VARCHAR
);

CREATE TABLE reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  restaurant_id BIGINT NOT NULL,
  stars INT NOT NULL,
  detail VARCHAR NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

INSERT INTO
  users (email, password_hash, first_name, last_name)
VALUES
  (
    'alvin@example.com',
    'notarealpasswordhash',
    'Alvin',
    'A'
  ),
  (
    'bob@example.com',
    'notarealpasswordhash',
    'Bob',
    'B'
  ),
  (
    'carole@example.com',
    'notarealpasswordhash',
    'Carole',
    'C'
  );

INSERT INTO
  restaurants (name, cuisine, cost, image, website)
VALUES
  (
    'Pip''s Original',
    'American',
    1,
    'https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg',
    'http://www.PipsOriginal.com'
  ),
  (
    'Mucca Osteria',
    'Italian',
    3,
    'https://media-cdn.tripadvisor.com/media/photo-m/1280/13/af/df/89/duck.jpg',
    'http://www.muccaosteria.com'
  ),
  (
    'Mediterranean Exploration Company',
    'Mediterranean',
    2,
    'https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/f2/e5/0c/dinner.jpg',
    'http://www.mediterraneanexplorationcompany.com/'
  ),
  (
    'Salt & Straw',
    'American',
    2,
    'https://media-cdn.tripadvisor.com/media/photo-o/0d/d6/a1/06/chocolate-gooey-brownie.jpg',
    'https://saltandstraw.com/pages/nw-23'
  );

INSERT INTO
  reviews (user_id, restaurant_id, stars, detail)
VALUES
  (1, 1, 5, 'Best restaurant ever!'),
  (2, 1, 1, 'Terrible service.'),
  (3, 1, 4, 'It was fine.');
