HamPath
=======

A library for generating random looking Hamiltonian paths on a grid.

![Examples image](examples.png "Examples")

Use
---

To generate a 2D Hamiltonian path object:

```javascript
import { saw3 } from 'saw';
const path = saw3({ 
    width: 12, // Optional. Width of the grid (Default: 4)
    height: 12, // Optional. Height of the grid (Default: 4)
    seed: "12345678" // Optional. Passing a seed will always produce the same pseudorandom result.
}); 
```

The `path` object generated has the form:
 
```javascript
path = {
    start : [1, 3], // Coordinates of the start of the path
    end : [2, 6], // Coordinates of the end of the path
    data : [[1, 3], ... [2, 6]] // Sequence of nodes along the path
}
```

To generate a 3D Hamiltonian path object:

```javascript
import { saw2 } from 'saw';
const path = saw3({ 
    width: 12, // Optional. Width of the grid (Default: 4)
    height: 12, // Optional. Height of the grid (Default: 4)
    depth: 12 // Optional. Depth of the grid (Default: 4)
    seed: "12345678" // Optional. Passing a seed will always produce the same pseudorandom result.
}); 
```

The `path` object generated has the form:
 
```javascript
path = {
    start : [1, 3, 1], // Coordinates of the start of the path
    end : [2, 6, 4], // Coordinates of the end of the path
    data : [[1, 3, 1], ... [2, 6, 4]] // Sequence of nodes along the path
}
```

License
-------

[WTFPL](http://www.wtfpl.net/)