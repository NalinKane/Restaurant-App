# Restaurant finder feedback

## script.js

Try and keep things well organised within files.

That could involve keeping things a bit more modular. E.g. keep map
functions and initialisation in a map.js file. Weather in it's own script file etc.

This will enable you as a team to work on your own files in git
without necessarily conflicting with each other.

`for` loops are good but `forEach` methods on arrays are 'easier'
and more readable. c.f. `function clearResults`

There are some general querySelectors that could be declared once
at the top of the file instead of inside of an onClick callback.
e.g. in `function openModal` and `function closeModal` (and some
others to be hunted down mercilessly)

```  const modalContent = document.querySelector("#modal-content");
```

