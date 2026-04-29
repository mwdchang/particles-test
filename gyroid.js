const BOUND = 6;
const FREQ = Math.PI / 4; // Controls the density of the gyroid cells

/**
 * Initialize data buffers for a Gyroid volume
 *
 * @param size: number
 * @param vertices: Float32Array
 * @param speeds: Float32Array
 * @param colors: Float32Array
**/
export const initialize = (size, vertices, speeds, colors) => {
  const initialVec = [0.05, 0.05, 0.05];

  for (let i = 0; i < size; i++) {
    // Start particles in a small central cluster
    vertices[i * 3] = (Math.random() - 0.5) * 2;
    vertices[i * 3 + 1] = (Math.random() - 0.5) * 2;
    vertices[i * 3 + 2] = (Math.random() - 0.5) * 2;

    speeds[i * 3] = (Math.random() - 0.5) * initialVec[0];
    speeds[i * 3 + 1] = (Math.random() - 0.5) * initialVec[1];
    speeds[i * 3 + 2] = (Math.random() - 0.5) * initialVec[2];

    // Gyroid colors: Cybernetic Cyan and Lime
    if (Math.random() > 0.5) {
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 0.8; // Cyan
    } else {
      colors[i * 3] = 0.5;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 0; // Lime
    }
  }
}

/**
 * Update particle positions for the Gyroid
**/
export const update = (pointsData, vertices, speeds, colors) => {
  const positions = pointsData.geometry.attributes.position.array;
  const size = positions.length / 3;

  const exceed = (idx) => {
    const x = positions[idx * 3];
    const y = positions[idx * 3 + 1];
    const z = positions[idx * 3 + 2];

    // Boundary box check
    if (Math.abs(x) > BOUND || Math.abs(y) > BOUND || Math.abs(z) > BOUND) return true;

    // Gyroid surface: sin(x)cos(y) + sin(y)cos(z) + sin(z)cos(x)
    // We use a threshold to give the surface "thickness"
    const val = Math.sin(x * FREQ) * Math.cos(y * FREQ) + 
                Math.sin(y * FREQ) * Math.cos(z * FREQ) + 
                Math.sin(z * FREQ) * Math.cos(x * FREQ);

    return Math.abs(val) > 0.6; // Higher value = thinner walls
  }

  for (let i = 0; i < size; i++) {
    for (let axis = 0; axis < 3; axis++) {
      positions[i * 3 + axis] += speeds[i * 3 + axis];
      if (exceed(i)) {
        positions[i * 3 + axis] -= speeds[i * 3 + axis];
        speeds[i * 3 + axis] = -speeds[i * 3 + axis];
      }
    }
  }
}
