const BOUND = 6;

/**
 * Initialize data buffers
 *
 * @param size: number
 * @param vertices: Floata32[]
 * @param speeds: Float32[]
 * @param colors: Float32[]
**/
export const initialize = (size, vertices, speeds, colors) => {
  const initialVec = [0.03, 0.03, 0.01];

  for (let i = 0; i < size; i++) {
    vertices[i * 3] = 0.1 - Math.random() * 0.2;
    vertices[i * 3 + 1] = 0.1 - Math.random() * 0.2;
    vertices[i * 3 + 2] = 0.1 - Math.random() * 0.2;

    speeds[i * 3] = initialVec[0] - 0.02 + Math.random() * 0.04;
    speeds[i * 3 + 1] = initialVec[1] - 0.02 + Math.random() * 0.04;
    speeds[i * 3 + 2] = initialVec[2] - 0.02 + Math.random() * 0.04;

    colors[i * 3] = 30;
    colors[i * 3 + 1] = (i % 255) / 256;
    colors[i * 3 + 2] = (i % 256) / 256;
  }
}

/**
 * @param pointsData: Three.Points
 * @param vertices: Floata32[]
 * @param speeds: Float32[]
 * @param colors: Float32[]
**/
export const update = (pointsData, vertices, speeds, colors) => {
  const positions = pointsData.geometry.attributes.position.array;
  const size = positions.length / 3;

  const exceed = (idx) => {
    return BOUND * BOUND < 
      positions[idx * 3] * positions[idx * 3] + 
      positions[idx * 3 + 1] * positions[idx * 3 + 1] + 
      positions[idx * 3 + 2] * positions[idx * 3 + 2]; 
  }

  for (let i = 0; i < size; i++) {
    positions[i * 3] += speeds[i * 3];
    if (exceed(i)) { 
      positions[i * 3] -= speeds[i * 3];
      speeds[i * 3] = -speeds[i * 3];
      continue;
    }

    positions[i * 3 + 1] += speeds[i * 3 + 1];
    if (exceed(i)) { 
      positions[i * 3 + 1] -= speeds[i * 3 + 1];
      speeds[i * 3 + 1] = -speeds[i * 3 + 1];
      continue;
    }

    positions[i * 3 + 2] += speeds[i * 3 + 2];
    if (exceed(i)) { 
      positions[i * 3 + 2] -= speeds[i * 3 + 2];
      speeds[i * 3 + 2] = -speeds[i * 3 + 2];
      continue;
    }
  }
}
