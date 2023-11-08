"""Special Word Finder random word generator."""
from wordfinder import WordFinder

class SpecialWordFinder(WordFinder):
    """Get random words from a dictionary while ignoring comments and blank lines.

    >>> swf = SpecialWordFinder("foods.txt")
    6 words read

    >>> swf.random() in {"beef", "chicken", "venison", "apple", "orange", "grape"}
    True
    """
    def parse_word_file(self, file):
        """Returns a list of words from a word text file
        while ignoring comments and blank lines"""
        return [line.strip() for line in file if line.strip() and not line.strip().startswith("#")]

# swf = SpecialWordFinder("foods.txt")

# for i in range(20):
#   print(swf.random())

# print(swf)