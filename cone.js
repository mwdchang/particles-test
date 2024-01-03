// https://stackoverflow.com/questions/12826117/how-can-i-detect-if-a-point-is-inside-a-cone-or-not-in-3d-space
const TIP = [0, 6, 0];
const DIR = [0, -1, 0];
const RADIUS = 5;
const H = 6;

/**
 * Initialize data buffers
 *
 * @param size: number
 * @param vertices: Floata32[]
 * @param speeds: Float32[]
 * @param colors: Float32[]
**/
export const initialize = (size, vertices, speeds, colors) => {
  const initialVec = [0.00, 0.06, 0.00];

  for (let i = 0; i < size; i++) {
    vertices[i * 3] = 0;
    vertices[i * 3 + 1] = 1.0;
    vertices[i * 3 + 2] = 0;

    speeds[i * 3 + 0] = initialVec[0] - 0.04 + Math.random() * 0.08;
    speeds[i * 3 + 1] = initialVec[1] - 0.03 + Math.random() * 0.06;
    speeds[i * 3 + 2] = initialVec[2] - 0.04 + Math.random() * 0.08;

    colors[i * 3] = 0.1;
    colors[i * 3 + 1] = (100 + Math.random() * 156) / 256;
    colors[i * 3 + 2] = 0;
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
    const x = positions[idx * 3] - TIP[0];
    const y = positions[idx * 3 + 1] - TIP[1];
    const z = positions[idx * 3 + 2] - TIP[2];

    const coneDist = x * DIR[0] + y * DIR[1] + z * DIR[2];
    const coneRadius = RADIUS * (coneDist / H);

    if (coneDist > H || coneDist < 0) return true;

    const xx = positions[idx * 3 + 0] - TIP[0] - coneDist * DIR[0];
    const yy = positions[idx * 3 + 1] - TIP[1] - coneDist * DIR[1];
    const zz = positions[idx * 3 + 2] - TIP[2] - coneDist * DIR[2];

    return xx * xx + yy * yy + zz * zz > coneRadius * coneRadius;
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
