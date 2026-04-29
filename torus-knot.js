const R_MAJOR = 4;
const R_TUBE = 0.8;
const P = 2; // Windings around the major axis
const Q = 3; // Windings around the through-hole

/**
 * Initialize data buffers for a Torus Knot
 *
 * @param size: number
 * @param vertices: Float32Array
 * @param speeds: Float32Array
 * @param colors: Float32Array
**/
export const initialize = (size, vertices, speeds, colors) => {
  const initialVec = [0.06, 0.06, 0.06];

  for (let i = 0; i < size; i++) {
    // Distribute initially along the trefoil path
    const t = Math.random() * Math.PI * 2;
    const r = R_MAJOR * (2 + Math.cos(Q * t)) * 0.5;
    vertices[i * 3] = r * Math.cos(P * t);
    vertices[i * 3 + 1] = r * Math.sin(P * t);
    vertices[i * 3 + 2] = R_MAJOR * Math.sin(Q * t) * 0.5;

    speeds[i * 3] = (Math.random() - 0.5) * initialVec[0];
    speeds[i * 3 + 1] = (Math.random() - 0.5) * initialVec[1];
    speeds[i * 3 + 2] = (Math.random() - 0.5) * initialVec[2];

    // Colors: Royal Purple and Gold
    if (Math.random() > 0.4) {
      colors[i * 3] = 0.5;     // R
      colors[i * 3 + 1] = 0;   // G
      colors[i * 3 + 2] = 1;   // B (Purple)
    } else {
      colors[i * 3] = 1;       // R
      colors[i * 3 + 1] = 0.8; // G
      colors[i * 3 + 2] = 0;   // B (Gold)
    }
  }
}

/**
 * Update particle positions for the Torus Knot
**/
export const update = (pointsData, vertices, speeds, colors) => {
  const positions = pointsData.geometry.attributes.position.array;
  const size = positions.length / 3;

  // Approximate distance to the torus knot curve
  // We sample 't' to find the closest point on the parametric curve
  const getMinDistSq = (x, y, z) => {
    let minDistSq = Infinity;
    const samples = 16; // Balance precision and performance
    for (let j = 0; j < samples; j++) {
      const t = (j / samples) * Math.PI * 2;
      const r = R_MAJOR * (2 + Math.cos(Q * t)) * 0.5;
      const tx = r * Math.cos(P * t);
      const ty = r * Math.sin(P * t);
      const tz = R_MAJOR * Math.sin(Q * t) * 0.5;

      const dx = x - tx;
      const dy = y - ty;
      const dz = z - tz;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < minDistSq) minDistSq = d2;
    }
    return minDistSq;
  }

  const exceed = (idx) => {
    const d2 = getMinDistSq(positions[idx * 3], positions[idx * 3 + 1], positions[idx * 3 + 2]);
    return d2 > R_TUBE * R_TUBE;
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
