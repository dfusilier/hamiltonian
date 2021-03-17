import Random from 'canvas-sketch-util/random';

export const simpleSaw3 = ({ width, height, depth }) => {
  
  const path = {};
  
  // Matrix where data[z][y][x] is the position
  // of next point in the path [x, y, z]
  const data = [];

  const xMax = width - 1;
  const yMax = height - 1;
  const zMax = depth - 1;

  const incrementX = (x, y, z) =>  
    x < xMax ? [x + 1, y, z] : undefined;
    
  const decrementX = (x, y, z) =>
    x > 0 ? [x - 1, y, z] : undefined;
    
  const incrementY = (x, y, z) => 
    y < yMax ? [x, y + 1, z] : undefined;
    
  const decrementY = (x, y, z) => 
    y > 0 ? [x, y - 1, z] : undefined;
    
  const incrementZ = (x, y, z) => 
    z < zMax ? [x, y, z + 1] : undefined;
  
  const step = (x, y, z) => {
    const shiftZ = incrementZ;
    let shiftY, shiftX;
    if (z % 2 === 0) {
      shiftY = incrementY;
      shiftX = y % 2 === 0 ? incrementX : decrementX;
    } else {
      shiftY = decrementY;
      shiftX = y % 2 === 0 ? decrementX : incrementX;
    };
    return shiftX(x, y, z) || shiftY(x, y, z) || shiftZ(x, y, z) || [-1, -1, -1];
  };
  
  for (let z = 0; z <= zMax; z++) {
    data.push([]);
    for (let y = 0; y <= yMax; y++) {
      data[z].push([]);
      for (let x = 0; x <= xMax; x++) {
        data[z][y].push(step(x, y, z));
      };
    };
  };
  path.start = [0, 0, 0];

  // Determine the end point
  if (zMax % 2 === 0) {
    if (yMax % 2 === 0) {
      path.end = [width - 1, height - 1, depth - 1];
    } else {
      path.end = [0, height - 1, depth - 1];
    }
  } else {
    path.end = [0, 0, depth - 1];
  }
  path.data = data;
  path.width = width;
  path.height = height;
  return path;
};

const convertToSequence3 = (path) => {
  const data = path.data;
  const sequence = [];
  let curr;
  let next = [...path.start];
  do {
    curr = [...next];
    sequence.push([...curr]);
    next = [...data[curr[2]][curr[1]][curr[0]]];
  } while (next[0] !== -1 || next[1] !== -1 || next[2] !== -1);
  return { ...path, data: sequence };
};

const step3 = (path, random) => {
  let start = [...path.start];
  let end = [...path.end];
  let data = [...path.data];
  const depth = data.length;
  const height = data[0].length;
  const width = data[0][0].length;
  const xMax = width - 1;
  const yMax = height - 1;
  const zMax = depth - 1;
  
  // Randomize possible directions
  const dirs = random.shuffle([
    [1, 0, 0], [-1, 0, 0], 
    [0, 1, 0], [ 0, -1, 0],
    [0, 0, 1], [ 0, 0, -1]
  ]); 

  // Pick the first direction that won't take us outside the grid
  // or in the direction the start is already connected to.
  const dir = dirs.find(dir => 
    !(
      start[0] + dir[0] < 0 || 
      start[0] + dir[0] > xMax || 
      start[1] + dir[1] < 0 || 
      start[1] + dir[1] > yMax || 
      start[2] + dir[2] < 0 || 
      start[2] + dir[2] > zMax
    ) && !(
      data[start[2]][start[1]][start[0]][0] === start[0] + dir[0] && 
      data[start[2]][start[1]][start[0]][1] === start[1] + dir[1] && 
      data[start[2]][start[1]][start[0]][2] === start[2] + dir[2]
    )
  );

  // Make a note of the old start connection
  const oldStart = [...data[start[2]][start[1]][start[0]]];

  // Connect the old start point in the new direction
  data[start[2]][start[1]][start[0]] = [
    start[0] + dir[0],
    start[1] + dir[1],
    start[2] + dir[2]
  ];

  // From the old start, follow the path and reverse 
  // the connections until the new start is reached
  let last = [...start];
  let curr = [...start];
  let next = [...oldStart];
  
  while (
    next[0] !== start[0] + dir[0] || 
    next[1] !== start[1] + dir[1] || 
    next[2] !== start[2] + dir[2]
  ) {
    last = [...curr];
    curr = [...next];
    next = [...data[curr[2]][curr[1]][curr[0]]];
    data[curr[2]][curr[1]][curr[0]] = [...last];
  }
  start = [...curr];
  return { start, end, data };
}

const reverse3 = (path) => {
  const data = [...path.data];
  let start = [...path.start];
  let end = [...path.end];
  let last = [...start];
  let curr = [...start];
  let next = [...data[start[2]][start[1]][start[0]]];
  data[start[2]][start[1]][start[0]] = [-1, -1, -1];

  do {
    last = [...curr];
    curr = [...next];
    next = [...data[curr[2]][curr[1]][curr[0]]];
    data[curr[2]][curr[1]][curr[0]] = [...last];
  } while (next[0] !== -1 || next[1] !== -1 || next[2] !== -1);

  end = [...start];
  start = [...curr];

  return { start, end, data };
}

/* Returns a random looking 3D Hamiltonian path.
* Notes: First generates a basic Hamiltonian path then performs a series of randomizing steps.
* The number of steps has been set to width^2 * height^2 * 0.1 which is generally large enough
* to create a random looking path. The path is periodically reversed since the step function
* only moves the start point, allowing both start and end points to be somewhat randomized */
export const hampath3 = ({
  width = 4,
  height = 4,
  depth = 4,
  seed
}) => {
  let path = simpleSaw3({ width, height, depth });
  const random = Random.createRandom(seed);

  for (let i = 0; i < width * width * height * height * depth * depth * 0.1; i++) {
    if ((i + 1) % Math.max(width, height, depth) === 0) {
      path = reverse3(path);
    }
    path = step3(path, random);
  };
  return convertToSequence3(path);
};
