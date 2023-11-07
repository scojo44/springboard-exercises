def reverse_vowels(s):
    """Reverse vowels in a string.

    Characters which are not vowels do not change position in string, but all
    vowels (y is not a vowel), should reverse their order.

    >>> reverse_vowels("Hello!")
    'Holle!'

    >>> reverse_vowels("Tomatoes")
    'Temotaos'

    >>> reverse_vowels("Reverse Vowels In A String")
    'RivArsI Vewols en e Streng'

    reverse_vowels("aeiou")
    'uoiea'

    reverse_vowels("why try, shy fly?")
    'why try, shy fly?''
    """
    i = 0
    result = ""
    reversed_vowels = [c for c in s if c.lower() in "aeiou"]
    reversed_vowels.reverse()

    for c in s:
        if c.lower() in "aeiou":
            result += reversed_vowels[i]
            i += 1
        else:
            result += c

    return result