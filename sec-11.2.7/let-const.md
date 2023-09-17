let & const Exercise
====================

    var PI = 3.14;
    PI = 42; // stop me from doing this!

becomes

    const PI = 3.14;
    PI = 42; // TypeError!

Quiz
----
> What is the difference between var and let?

var is function-scoped and let is block-scoped.  
var allows redeclaring variables while let does not.  
var declarations are hoisted while let's declarations take effect where they appear in code.

> What is the difference between var and const?

Same as the differene between var and let except const constants can't be changed.

> What is the difference between let and const?

let variables can be reassigned while const constants are read-only.

> What is hoisting?

The JavaScript compiler's habit of looking ahead for var declarations and setting them to undefined at the beginning of the function scope.  The variable exists but is undefined until it is assigned a value, even if the declaration and assignment happen on the same line.