fun_words = ["geocache","golf","computer","python","ruby","javascript","go","rust"]

def print_upper_words(words, must_start_with):
    """Prints each word in a list of words."""

    for word in words:
        for char in must_start_with:
            if word[0].lower() == char:
                print(word.upper())

print_upper_words(fun_words, {"g","r"})