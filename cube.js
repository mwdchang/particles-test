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
  const initialVec = [0.06, 0.06, 0.02];

  for (let i = 0; i < speeds.length; i++) {
    vertices[i] = 0.4 - Math.random() * 0.8;
    speeds[i] = initialVec[i % 3] - 0.02 + Math.random() * 0.04;
    colors[i * 3] = 0;
  }

  for (let i = 0; i < size; i++) {
    colors[i * 3 + 0] = Math.random();
    colors[i * 3 + 1] = Math.random();
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
  // const c = pointsData.geometry.attributes.color.array;

  for (let i = 0; i < positions.length; i++) {
    positions[ i ] += speeds[i];
    if (positions[i] >= BOUND) {
      positions[i] = BOUND;
      speeds[i] = -speeds[i];
      // c[i] = Math.random();
    } else if (positions[i] <= -BOUND) {
      positions[i] = -BOUND;
      speeds[i] = -speeds[i];
      // c[i] = 0.5;
    }
  }
}
