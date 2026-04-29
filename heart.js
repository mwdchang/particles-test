const SCALE = 4;

/**
 * Initialize data buffers for a 3D Heart
 *
 * @param size: number
 * @param vertices: Float32Array
 * @param speeds: Float32Array
 * @param colors: Float32Array
**/
export const initialize = (size, vertices, speeds, colors) => {
  const initialVec = [0.04, 0.04, 0.04];

  for (let i = 0; i < size; i++) {
    // Start particles near the center of the heart
    vertices[i * 3] = (Math.random() - 0.5) * 0.5;
    vertices[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
    vertices[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

    speeds[i * 3] = (Math.random() - 0.5) * initialVec[0];
    speeds[i * 3 + 1] = (Math.random() - 0.5) * initialVec[1];
    speeds[i * 3 + 2] = (Math.random() - 0.5) * initialVec[2];

    // Heart colors: Shades of red, pink, and deep crimson
    const r = 0.8 + Math.random() * 0.2;
    const g = Math.random() * 0.2;
    const b = 0.2 + Math.random() * 0.3;

    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }
}

/**
 * Update particle positions for the 3D Heart
 * 
 * @param pointsData: Three.Points
 * @param vertices: Float32Array
 * @param speeds: Float32Array
 * @param colors: Float32Array
**/
export const update = (pointsData, vertices, speeds, colors) => {
  const positions = pointsData.geometry.attributes.position.array;
  const size = positions.length / 3;

  const exceed = (idx) => {
    // Normalize coordinates for the heart equation
    const x = positions[idx * 3] / SCALE;
    const y = positions[idx * 3 + 1] / SCALE;
    const z = positions[idx * 3 + 2] / SCALE;

    const x2 = x * x;
    const y2 = y * y;
    const z2 = z * z;
    const y3 = y2 * y;

    // Taubin heart surface equation: (x^2 + (9/4)z^2 + y^2 - 1)^3 - x^2y^3 - (9/80)z^2y^3 <= 0
    const a = x2 + (9 / 4) * z2 + y2 - 1;
    const val = a * a * a - x2 * y3 - (9 / 80) * z2 * y3;

    return val > 0;
  }

  for (let i = 0; i < size; i++) {
    // Update X
    positions[i * 3] += speeds[i * 3];
    if (exceed(i)) {
      positions[i * 3] -= speeds[i * 3];
      speeds[i * 3] = -speeds[i * 3];
    }

    // Update Y
    positions[i * 3 + 1] += speeds[i * 3 + 1];
    if (exceed(i)) {
      positions[i * 3 + 1] -= speeds[i * 3 + 1];
      speeds[i * 3 + 1] = -speeds[i * 3 + 1];
    }

    // Update Z
    positions[i * 3 + 2] += speeds[i * 3 + 2];
    if (exceed(i)) {
      positions[i * 3 + 2] -= speeds[i * 3 + 2];
      speeds[i * 3 + 2] = -speeds[i * 3 + 2];
    }
  }
}
