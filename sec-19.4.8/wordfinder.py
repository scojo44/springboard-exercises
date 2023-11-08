"""Word Finder random word generator."""
from random import choice

class WordFinder:
    """Get random words from a dictionary.

    >>> wf = WordFinder("animals.txt")
    5 words read

    >>> wf.random() in {"cat", "dog", "horse", "deer", "bear"}
    True
    """
    def __init__(self, word_file_path):
        """Read the words from the given word file
        - word_file_path: Text file containing words"""
        with open(word_file_path, "r") as file:
            self.words = self.parse_word_file(file)

        self.word_file = word_file_path
        print(len(self.words), "words read")

    def parse_word_file(self, file):
        """Parse the word text file"""
        return [line.strip() for line in file]

    def random(self):
        """Returns a random word"""
        return choice(self.words)

# wf = WordFinder("words.txt")

# for i in range(20):
#   print(wf.random())

# print(wf)