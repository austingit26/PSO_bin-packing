class Bin {
  constructor(width, height, density) {
    this.width = width;
    this.height = height;
    this.density = density;
    this.items = [];
    this.calculateDensity(); // Calculate density upon initialization
  }

  add_item(item) {
    this.items.push(item);
    this.calculateDensity(); // Recalculate density after adding an item
  }

  calculateDensity() {
    let totalArea = this.width * this.height;
    let occupiedArea = this.items.reduce(
      (area, item) => area + item.width * item.height,
      0
    );
    this.density = occupiedArea / totalArea; // Calculate density
  }
}

class Item {
  constructor(name, x, y, width, height) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.binIndex = -1;
    this.rotate = false;
  }
}

export function solveBinPacking(binSize, items) {
  // Initialize particles
  const particles = [];
  const numParticles = 50; // Number of particles in the swarm
  const maxIterations = 50; // Maximum number of iterations
  let c1 = 2; // Cognitive coefficient
  let c2 = 2; // Social coefficient
  let w = 0.5; // Inertia weight

  for (let i = 0; i < numParticles; i++) {
    const initialPosition = setInitialPosition(binSize, items);
    const initialFitness = evaluateFitness(initialPosition);

    const particle = {
      position: JSON.parse(JSON.stringify(initialPosition)),
      velocity: generateRandomVelocity(initialPosition),
      bestPosition: JSON.parse(JSON.stringify(initialPosition)),
      bestFitness: initialFitness,
    };

    particles.push(particle);
  }

  // Find the global best position and fitness
  let globalBestPosition = particles[0].position.slice();
  let globalBestFitness = evaluateFitness(globalBestPosition);

  // Main loop
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    for (let particle of particles) {
      // Update particle velocity and position
      for (let i = 0; i < particle.velocity.length; i++) {
        const r1 = Math.random();
        const r2 = Math.random();

        // Update velocity
        const dx1 = c1 * r1 * (particle.bestPosition[i] - particle.position[i]);
        const dx2 = c2 * r2 * (globalBestPosition[i] - particle.position[i]);
        const dy1 = c1 * r1 * (particle.bestPosition[i] - particle.position[i]);
        const dy2 = c2 * r2 * (globalBestPosition[i] - particle.position[i]);

        // Update velocity using an extensible object
        const newVelocity = {
          x: w * particle.velocity[i].x + dx1 + dx2,
          y: w * particle.velocity[i].y + dy1 + dy2,
        };

        particle.velocity[i] = newVelocity;
      }

      // Evaluate fitness of the current position
      particle.fitness = evaluateFitness(particle.position);

      //heuristic function generating new improved solutions
      const newPosition = updateParticlePosition(particle.position);

      // Evaluate fitness of the new position
      const newFitness = evaluateFitness(newPosition);

      if (newFitness > particle.fitness) {
        // Update position
        particle.position = newPosition;
      }

      // Update particle's best position and fitness
      if (particle.fitness > particle.bestFitness) {
        particle.bestPosition = particle.position.map((pos) => ({ ...pos }));
        particle.bestFitness = particle.fitness;
      }

      // Update global best position and fitness
      if (particle.fitness > globalBestFitness) {
        globalBestPosition = particle.position.map((pos) => ({ ...pos }));
        globalBestFitness = particle.fitness;
      }

      //early termination on loop
      if (particle.fitness === 1) return globalBestPosition;
    }

    // Update the inertia weight
    w -= 0.7 / maxIterations;
  }


  return globalBestPosition;
}

/*======================= HELPER FUNCTIONS =======================*/
function updateParticlePosition(solution) {
  const bins = solution.map((bin) => ({ ...bin }));
  let arrangedBins = rearrangeItems(bins);

  return arrangedBins;
}

function rearrangeItems(bins) {
  const arrangedBins = [];
  let currentBin = { ...bins[0], items: [], matrix: createMatrix(bins[0]) };

  bins.forEach((bin) => {
    bin.items.forEach((item) => {
      let placed = false;
      let rotate = item.rotate;

      while (!placed) {
        let canPlace = false;

        for (let y = 0; y < currentBin.binHeight; y++) {
          for (let x = 0; x < currentBin.binWidth; x++) {
            canPlace = tryPlacingItem(item, currentBin.matrix, x, y, rotate);

            if (canPlace) {
              updateBin(currentBin, item, x, y, rotate);
              placed = true;
              break;
            }
          }

          if (canPlace) {
            break;
          }
        }

        if (!placed) {
          // Try placing the item with rotation if it cannot fit on its original orientation
          if (!rotate) {
            rotate = true;
          } else {
            const binDensity = calculateBinDensity(currentBin);
            currentBin.binDensity = binDensity;
            arrangedBins.push(currentBin);
            currentBin = { ...bin, items: [], matrix: createMatrix(bin) };
            rotate = item.rotate; // Reset rotation state
          }
        }
      }
    });
  });

  if (currentBin.items.length > 0) {
    const binDensity = calculateBinDensity(currentBin);
    currentBin.binDensity = binDensity;
    arrangedBins.push(currentBin);
  }

  return arrangedBins;
}

function updateBin(bin, item, x, y, rotate) {
  const { width, height } = rotate
    ? { width: item.height, height: item.width }
    : item;
  const newItem = { ...item, x, y, width, height, rotate };
  bin.items.push(newItem);

  for (let i = y; i < y + height; i++) {
    for (let j = x; j < x + width; j++) {
      bin.matrix[i][j] = newItem;
    }
  }
}

function createMatrix(bin) {
  const matrix = Array.from(Array(bin.binHeight), () =>
    Array(bin.binWidth).fill(0)
  );
  return matrix;
}

function calculateBinDensity(bin) {
  const filledArea = bin.items.reduce((area, item) => {
    return area + item.width * item.height;
  }, 0);

  const binArea = bin.binWidth * bin.binHeight;

  const binDensity = filledArea / binArea;

  return binDensity;
}

function tryPlacingItem(item, matrix, x, y, rotate) {
  const { width, height } = rotate
    ? { width: item.height, height: item.width }
    : item;
  const binHeight = matrix.length;
  const binWidth = matrix[0].length;

  // Check if the item exceeds the boundaries of the bin
  if (x + width > binWidth || y + height > binHeight) {
    return false;
  }

  // Check if the item overlaps with any previously placed items
  for (let i = y; i < y + height; i++) {
    for (let j = x; j < x + width; j++) {
      if (matrix[i][j] !== 0) {
        return false;
      }
    }
  }

  return true;
}

function generateRandomVelocity(items) {
  const velocity = [];
  for (let i = 0; i < items.length; i++) {
    const dx = Math.random() > 0.5 ? 1 : -1;
    const dy = Math.random() > 0.5 ? 1 : -1;
    velocity.push({ x: dx, y: dy, binIndex: -1 });
  }
  return velocity;
}

function evaluateFitness(solution) {
  let densityWeight = 0;
  for (let i = 0; i < solution.length; i++) {
    densityWeight += solution[i].binDensity;
  }

  const fitness = densityWeight / solution.length;
  return fitness;
}

function can_place_item(bin, item) {
  if (item.x + item.width > bin.width || item.y + item.height > bin.height) {
    return false;
  }

  for (let existing_item of bin.items) {
    if (
      item.x < existing_item.x + existing_item.width &&
      item.x + item.width > existing_item.x &&
      item.y < existing_item.y + existing_item.height &&
      item.y + item.height > existing_item.y
    ) {
      return false;
    }
  }

  return true;
}

function place_items(items, bin_width, bin_height) {
  let bin = new Bin(bin_width, bin_height);

  items.sort((a, b) => b.width - a.width);

  let max_failed_attempts = 20;

  for (let item of items) {
    let placed = false;
    let failed_attempts = 0;

    while (!placed) {
      item.x = Math.floor(Math.random() * (bin_width - item.width + 1));
      item.y = 0;
      item.rotate = false;

      if (can_place_item(bin, item)) {
        bin.add_item(item);
        placed = true;
      } else {
        item.rotate = true;

        if (can_place_item(bin, item)) {
          bin.add_item(item);
          placed = true;
        } else {
          item.rotate = false; // Reset rotation flag

          for (let existing_item of bin.items) {
            item.y = existing_item.y + existing_item.height;

            if (can_place_item(bin, item)) {
              bin.add_item(item);
              placed = true;
              break;
            }
          }

          failed_attempts++;
          if (failed_attempts >= max_failed_attempts) {
            break;
          }
        }
      }
    }
  }

  let remaining_items = items.filter((item) => !bin.items.includes(item));

  return [bin, remaining_items];
}

function initialize_particle(items, bin_width, bin_height) {
  let bins = [];
  let remaining_items = items;

  while (remaining_items.length > 0) {
    let [bin, itemsLeft] = place_items(remaining_items, bin_width, bin_height);
    bins.push(bin);
    remaining_items = itemsLeft;
  }

  return bins;
}

function setInitialPosition(binSize, items) {
  let convertedItems = items.map((item) => {
    return new Item(item.itemName, 0, 0, item.itemWidth, item.itemHeight);
  });

  let bins = initialize_particle(
    convertedItems,
    binSize.binWidth,
    binSize.binHeight
  );

  let initial_solution = [];

  for (let bin of bins) {
    let itemData = bin.items.map((item) => {
      return {
        name: item.name,
        width: item.width,
        height: item.height,
        x: item.x,
        y: item.y,
        rotate: item.rotate,
      };
    });

    let formattedBin = {
      binWidth: bin.width,
      binHeight: bin.height,
      items: itemData,
      binDensity: bin.density,
    };

    initial_solution.push(formattedBin);
  }

  return initial_solution;
}
