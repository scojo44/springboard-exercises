def same_frequency(num1, num2):
    """Do these nums have same frequencies of digits?
    
        >>> same_frequency(551122, 221515)
        True
        
        >>> same_frequency(321142, 3212215)
        False
        
        >>> same_frequency(1212, 2211)
        True
    """
    return count_frequency(num1) == count_frequency(num2)

def count_frequency(x):
    s = str(x)
    return {digit: s.count(digit) for digit in s}
