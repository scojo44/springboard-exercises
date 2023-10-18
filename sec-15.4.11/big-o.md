Big-O Notation Practice
=======================

Step One: Simplifying Expressions
---------------------------------
Simplify the following big O expressions as much as possible:

1. O(n + 10) `O(n)`
2. O(100 * n) `O(n)`
3. O(25) `O(1)`
4. O(n^2 + n^3) `O(n^3)`
5. O(n + n + n + n) `O(n)`
6. O(1000 * log(n) + n) `O(n)`
7. O(1000 * n * log(n) + n) `O(n log n)`
8. O(2^n + n^2) `O(2^n)`
9. O(5 + 3 + 1) `O(1)`
10. O(n + n^(1/2) + n^2 + n * log(n)^10) `O(n log(n)^10)` or `O(n^2)` if the last part was supposed to be read as log(n^10)

Step Two: Calculating Time Complexity
-------------------------------------
Determine the time complexities for each of the following functions.

- logUpTo() `O(n)`
- logAtLeast10() `O(n)`
- logAtMost10() `O(1)`
- onlyElementsAtEvenIndex() `O(n)`
- subtotals() `O(n^2)`
- vowelCount() `O(n)`

Part 3 - Short Answer
---------------------
Answer the following questions.

1. True or false: n^2 + n is O(n^2). `True`
2. True or false: n^2 * n is O(n^3). `True`
3. True or false: n^2 + n is O(n). `False`
4. What’s the time complexity of the .indexOf array method? `O(n)`
5. What’s the time complexity of the .includes array method? `O(n)`
6. What’s the time complexity of the .forEach array method? `O(n callback)`
7. What’s the time complexity of the .sort array method? `O(n log n)`
8. What’s the time complexity of the .unshift array method? `O(n)`
9. What’s the time complexity of the .push array method? `O(1)`
10. What’s the time complexity of the .splice array method? `O(n)`
11. What’s the time complexity of the .pop array method? `O(1)`
12. What’s the time complexity of the Object.keys() function? `O(n)`

### BONUS

13. What’s the space complexity of the Object.keys() function? `O(n)`