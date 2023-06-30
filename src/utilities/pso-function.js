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
    this.density =
      this.items.reduce(
        (accumulator, item) => accumulator + item.width * item.height,
        0
      ) /
      (this.width * this.height);
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
  const numParticles = 100; // Number of particles in the swarm
  const maxIterations = 100; // Maximum number of iterations
  let c1 = 2; // Cognitive coefficient
  let c2 = 2; // Social coefficient
  let w = 0.8; // Inertia weight

  for (let i = 0; i < numParticles; i++) {
    const initialPosition = setInitialPosition(binSize, items);
    const initialFitness = evaluateFitness(initialPosition);

    const particle = {
      position: initialPosition.map((pos) => ({ ...pos })),
      velocity: generateRandomVelocity(initialPosition),
      bestPosition: initialPosition.map((pos) => ({ ...pos })),
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

        // Update best position
        if (particle.fitness > particle.bestFitness) {
          particle.bestPosition = particle.position.map((pos) => ({ ...pos }));
          particle.bestFitness = particle.fitness;
        }
      }
      // Apply local search mechanisms
      twoOptLocalSearch(particle.position);
      threeOptLocalSearch(particle.position);

      // Update position
      const newPosition = particle.position.map((pos) => {
        const items = pos.items.map((item) => {
          return {
            name: item.name,
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
            rotate: item.rotate,
          };
        });

        const binWidth = pos.binWidth;
        const binHeight = pos.binHeight;
        const binDensity = pos.binDensity;

        return { items, binWidth, binHeight, binDensity };
      });

      particle.position = newPosition;

      // Evaluate fitness of the current position
      particle.fitness = evaluateFitness(particle.position);

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
    }

    // Update the inertia weight
    w -= 0.45 / maxIterations;
  }

  // Format the final result to match the initial position format
  return globalBestPosition;
}

/*======================= HELPER FUNCTIONS =======================*/
function twoOptLocalSearch(position) {
  const improvedPosition = position.map((bin) => {
    const items = bin.items;
    const newItems = twoOptSwap(items);
    return { ...bin, items: newItems };
  });

  return improvedPosition;
}

function twoOptSwap(items) {
  const newItems = [...items];

  for (let i = 0; i < newItems.length - 1; i++) {
    for (let j = i + 1; j < newItems.length; j++) {
      const swappedItems = swapItems(newItems[i], newItems[j]);
      const isValid = validateItems(swappedItems);

      if (isValid) {
        newItems[i] = swappedItems[0];
        newItems[j] = swappedItems[1];
      }
    }
  }

  return newItems;
}

function swapItems(item1, item2) {
  const newItem1 = { ...item1 };
  const newItem2 = { ...item2 };

  // Swap positions
  const tempX = newItem1.x;
  const tempY = newItem1.y;
  newItem1.x = newItem2.x;
  newItem1.y = newItem2.y;
  newItem2.x = tempX;
  newItem2.y = tempY;

  return [newItem1, newItem2];
}

function validateItems(items) {
  const positions = new Set();

  for (let item of items) {
    for (let i = item.x; i < item.x + item.width; i++) {
      for (let j = item.y; j < item.y + item.height; j++) {
        const position = `${i},${j}`;

        if (positions.has(position)) {
          return false; // Overlapping positions, not valid
        }

        positions.add(position);
      }
    }
  }

  return true; // Valid positions, no overlap
}

function threeOptLocalSearch(position) {
  const improvedPosition = position.map((bin) => {
    const items = bin.items;
    const newItems = threeOptSwap(items);
    return { ...bin, items: newItems };
  });

  return improvedPosition;
}

function threeOptSwap(items) {
  const newItems = [...items];

  for (let i = 0; i < newItems.length - 2; i++) {
    for (let j = i + 1; j < newItems.length - 1; j++) {
      for (let k = j + 1; k < newItems.length; k++) {
        const swappedItems = swapThreeItems(
          newItems[i],
          newItems[j],
          newItems[k]
        );
        const isValid = validateItems(swappedItems);

        if (isValid) {
          newItems[i] = swappedItems[0];
          newItems[j] = swappedItems[1];
          newItems[k] = swappedItems[2];
        }
      }
    }
  }

  return newItems;
}

function swapThreeItems(item1, item2, item3) {
  const newItem1 = { ...item1 };
  const newItem2 = { ...item2 };
  const newItem3 = { ...item3 };

  // Swap positions
  const tempX1 = newItem1.x;
  const tempY1 = newItem1.y;
  newItem1.x = newItem2.x;
  newItem1.y = newItem2.y;
  newItem2.x = newItem3.x;
  newItem2.y = newItem3.y;
  newItem3.x = tempX1;
  newItem3.y = tempY1;

  return [newItem1, newItem2, newItem3];
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
  let totalWidth = 0;
  let maxHeight = 0;

  items.sort((a, b) => b.width - a.width);

  for (let item of items) {
    if (totalWidth + item.width <= bin_width && item.height <= bin_height) {
      item.x = totalWidth;
      item.y = 0;
      item.rotate = false;

      if (can_place_item(bin, item)) {
        bin.add_item(item);

        totalWidth += item.width;
        if (item.height > maxHeight) {
          maxHeight = item.height;
        }
      }
    } else {
      item.rotate = true;

      if (totalWidth + item.height <= bin_width && item.width <= bin_height) {
        item.x = totalWidth;
        item.y = 0;

        if (can_place_item(bin, item)) {
          bin.add_item(item);

          totalWidth += item.height;
          if (item.width > maxHeight) {
            maxHeight = item.width;
          }
        }
      }
    }
  }

  let remaining_items = items.filter((item) => !bin.items.includes(item));

  return [bin, remaining_items, totalWidth, maxHeight];
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
  console.log("initial_solution", JSON.stringify(initial_solution));
  return initial_solution;
}
