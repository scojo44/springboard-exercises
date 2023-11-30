-- write your queries here

-- Join the two tables so that every column and record appears,
-- regardless of whether or not there is an owner_id
SELECT * FROM owners o
FULL JOIN vehicles v ON o.id = v.owner_id;

-- Count the number of cars for each owner.
-- Display the owners first_name, last_name and count of vehicles.
-- The first_name should be ordered in ascending order.
SELECT first_name, last_name, count(owner_id) FROM owners o
FULL JOIN vehicles v ON o.id = v.owner_id
GROUP BY first_name, last_name
ORDER BY first_name;

-- Count the number of cars for each owner and display the average
-- price for each of the cars as integers.
-- Display the owners first_name, last_name, average price and count of vehicles.
-- The first_name should be ordered in descending order.
-- Only display results with more than one vehicle and an average price greater than 10000.
SELECT first_name, last_name, round(avg(price)) AS average_price, count(owner_id)
FROM owners o
JOIN vehicles v ON o.id = v.owner_id
GROUP BY first_name, last_name
HAVING count(owner_id) >= 2 AND avg(price) > 10000
ORDER BY first_name DESC;