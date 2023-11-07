def find_factors(num):
    """Find factors of num, in increasing order.

    >>> find_factors(10)
    [1, 2, 5, 10]

    >>> find_factors(11)
    [1, 11]

    >>> find_factors(111)
    [1, 3, 37, 111]

    >>> find_factors(321421)
    [1, 293, 1097, 321421]
    """
    factors = []
    x = 1

    while x <= num/2: # check all numbers up to half of num
        if num % x == 0:
            factors.append(x)
        x += 1

    factors.append(num) # Cut the time in half just by manually appending num
    return factors