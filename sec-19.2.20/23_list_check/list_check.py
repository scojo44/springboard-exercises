def list_check(lst):
    """Are all items in lst a list?

        >>> list_check([[1], [2, 3]])
        True

        >>> list_check([[1], "nope"])
        False
    """
    result = True
    for item in lst:
        result = result and isinstance(item, list)
    return result