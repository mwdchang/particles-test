const R_MAJOR = 5;
const R_MINOR = 2.2;

/**
 * Initialize data buffers
 *
 * @param size: number
 * @param vertices: Floata32[]
 * @param speeds: Float32[]
 * @param colors: Float32[]
**/
export const initialize = (size, vertices, speeds, colors) => {
  for (let i = 0; i < size; i++) {
    if (Math.random() < 0.5) {
      vertices[i * 3] = 3.0 + Math.random() * 0.5;
      vertices[i * 3 + 1] = 3.0 + Math.random() * 0.5;
      vertices[i * 3 + 2] = Math.random() * 0.3;

      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 0;

    } else {
      vertices[i * 3] = -3.0 + Math.random() * 0.5;
      vertices[i * 3 + 1] = -3.0 + Math.random() * 0.5;
      vertices[i * 3 + 2] = Math.random() * 0.3;

      colors[i * 3] = 0;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }

    speeds[i * 3] = -0.08 * Math.random() * 0.16;
    speeds[i * 3 + 1] = -0.08 + Math.random() * 0.16;
    speeds[i * 3 + 2] = -0.08 + Math.random() * 0.16;
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

  // https://math.stackexchange.com/questions/4380905/how-can-i-determine-if-a-point-x-y-z-is-within-a-torus-r-r#:~:text=Some%20basic%20trigonometry%20shows%20that,)2%2B%CB%86z2.&text=or%20(R%E2%88%92%E2%88%9A%CB%86x,%2Bz2%3Cr2.
  const p = pointsData.geometry.attributes.position.array;
  const calc = (idx) => {
    const tmp = R_MAJOR - Math.sqrt(p[idx * 3] * p[idx * 3] + p[idx * 3 + 1] * p[idx * 3 + 1]);
    return tmp * tmp + p[idx * 3 + 2] * p[idx * 3 + 2];

    // return (R_MAJOR - Math.sqrt(p[idx * 3] * p[idx * 3] + p[idx * 3 + 1] * p[idx * 3 + 1])) *
    //        (R_MAJOR - Math.sqrt(p[idx * 3] * p[idx * 3] + p[idx * 3 + 1] * p[idx * 3 + 1])) + p[idx * 3 + 2] * p[idx * 3 + 2];
  }

  let r2 = 0;
  for (let i = 0; i < size; i++) {
    p[i * 3] += speeds[i * 3];
    if (calc(i) > R_MINOR * R_MINOR) {
      p[i * 3] -= speeds[i * 3];
      speeds[i * 3] = -speeds[ i * 3];
      continue;
    }

    p[i * 3 + 1] += speeds[i * 3 + 1];
    if (calc(i) > R_MINOR * R_MINOR) {
      p[i * 3 + 1] -= speeds[i * 3 + 1];
      speeds[i * 3 + 1] = -speeds[ i * 3 + 1];
      continue;
    }

    p[i * 3 + 2] += speeds[i * 3 + 2];
    if (calc(i) > R_MINOR * R_MINOR) {
      p[i * 3 + 2] -= speeds[i * 3 + 2];
      speeds[i * 3 + 2] = -speeds[ i * 3 + 2];
      continue;
    }




    /*
    positions[i * 3] += speeds[i * 3];
    r2 = positions[i * 3] * positions[i * 3] + positions[i * 3 + 1] * positions[i * 3 + 1];
    if (r2 < INNER_R * INNER_R  || r2 > OUTER_R * OUTER_R) {
      positions[i * 3] -= speeds[ i * 3 ];
      speeds[i * 3] = -speeds[ i * 3];
      continue;
    }

    positions[i * 3 + 1] += speeds[i * 3 + 1];
    r2 = positions[i * 3] * positions[i * 3] + positions[i * 3 + 1] * positions[i * 3 + 1];
    if (r2 < INNER_R * INNER_R || r2 > OUTER_R * OUTER_R) {
      positions[i * 3 + 1] -= speeds[ i * 3 + 1];
      speeds[i * 3 + 1] = -speeds[ i * 3 + 1];
    }

    positions[i * 3 + 2] += speeds[i * 3 + 2];
    r2 = (positions[i * 3 + 1] - offset) * (positions[i * 3 + 1] - offset) + positions[i * 3 + 2] * positions[i * 3 + 2];
    if (r2 > THICK_R * THICK_R) {
      positions[i * 3 + 2] -= speeds[ i * 3 + 2];
      speeds[i * 3 + 2] = -speeds[ i * 3 + 2];
    }
    */
  }
}
