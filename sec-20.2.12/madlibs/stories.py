"""Madlibs Stories."""

class Story:
    """Madlibs story.

    To  make a story, pass a list of prompts, and the text
    of the template.

        >>> s = Story(["noun", "verb"],
        ...     "I love to {verb} a good {noun}.")

    To generate text from a story, pass in a dictionary-like thing
    of {prompt: answer, prompt: answer):

        >>> ans = {"verb": "eat", "noun": "mango"}
        >>> s.generate(ans)
        'I love to eat a good mango.'
    """

    def __init__(self, id, title, words, text):
        """Create story with words and template text."""
        self.id = id
        self.title = title
        self.prompts = words
        self.template = text

    def generate(self, answers):
        """Substitute answers into text."""

        text = self.template

        for (key, val) in answers.items():
            text = text.replace("{" + key + "}", val)

        return text

# Here's a story to get you started
stories = [
    Story(1, "Long Ago",
        ["place", "noun", "verb", "adjective", "plural_noun"],
        """Once upon a time in a long-ago {place}, there lived a
          large {adjective} {noun}. It loved to {verb} {plural_noun}."""
    ),
    Story(2, "Sometimes",
        ["verb1", "plural_noun", "verb2"],
        """Sometimes I {verb1} with my {plural_noun}, sometimes we just {verb2}."""
    ),
    Story(3, "Here's the Fix",
        ["verb1", "verb2", "noun"],
        """Not {verb1}ing?  Un{verb2} the {noun} and {verb2} it back in."""
    ),
    Story(4, "The Fact",
        ["verb", "noun"],
        """The fact that no one {verb}s you doesn't mean you're a {noun}"""
    ),
    Story(5, "How I Grew Up",
        ["plural_noun", "verb", "noun"],
        """I grew up with six {plural_noun}.  That's how I learned to {verb}:
        waiting for the {noun}."""
    )
]