const R_MAJOR = 4;
const R_TUBE = 0.8;
const P = 2; // Windings around the major axis
const Q = 3; // Windings around the through-hole

const SAMPLES = 120;
const curvePoints = new Float32Array(SAMPLES * 3);

// Pre-calculate the curve points once to avoid trig in the update loop
for (let i = 0; i < SAMPLES; i++) {
  const t = (i / SAMPLES) * Math.PI * 2;
  const r = R_MAJOR * (2 + Math.cos(Q * t)) * 0.5;
  curvePoints[i * 3] = r * Math.cos(P * t);
  curvePoints[i * 3 + 1] = r * Math.sin(P * t);
  curvePoints[i * 3 + 2] = R_MAJOR * Math.sin(Q * t) * 0.5;
}

/**
 * Initialize data buffers for a Torus Knot
**/
export const initialize = (size, vertices, speeds, colors) => {
  const initialVec = [0.06, 0.06, 0.06];

  for (let i = 0; i < size; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = R_MAJOR * (2 + Math.cos(Q * t)) * 0.5;
    vertices[i * 3] = r * Math.cos(P * t);
    vertices[i * 3 + 1] = r * Math.sin(P * t);
    vertices[i * 3 + 2] = R_MAJOR * Math.sin(Q * t) * 0.5;

    speeds[i * 3] = (Math.random() - 0.5) * initialVec[0];
    speeds[i * 3 + 1] = (Math.random() - 0.5) * initialVec[1];
    speeds[i * 3 + 2] = (Math.random() - 0.5) * initialVec[2];

    if (Math.random() > 0.4) {
      colors[i * 3] = 0.5; colors[i * 3 + 1] = 0; colors[i * 3 + 2] = 1; // Purple
    } else {
      colors[i * 3] = 1; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0; // Gold
    }
  }
}

/**
 * Update particle positions for the Torus Knot (Optimized)
**/
export const update = (pointsData, vertices, speeds, colors) => {
  const positions = pointsData.geometry.attributes.position.array;
  const size = positions.length / 3;

  const getMinDistSq = (x, y, z) => {
    let minDistSq = Infinity;
    
    // The XY angle corresponds to P*t. We can find the target t very quickly.
    let phi = Math.atan2(y, x);
    if (phi < 0) phi += Math.PI * 2;

    // Since phi = P*t, t = (phi + k*2pi) / P. There are P possible t values.
    for (let k = 0; k < P; k++) {
      const tTarget = (phi + k * Math.PI * 2) / P;
      const indexBase = Math.floor((tTarget / (Math.PI * 2)) * SAMPLES);
      
      // Check only a few neighbor points around the expected index
      for (let o = -3; o <= 3; o++) {
        const idx = (indexBase + o + SAMPLES) % SAMPLES;
        const dx = x - curvePoints[idx * 3];
        const dy = y - curvePoints[idx * 3 + 1];
        const dz = z - curvePoints[idx * 3 + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < minDistSq) minDistSq = d2;
      }
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
