// export function solveBinPacking(binSize, items) {
//   // Initialize particles
//   const particles = [];
//   const numParticles = 50; // Number of particles in the swarm
//   const maxIterations = 50; // Maximum number of iterations
//   let c1 = 2; // Cognitive coefficient
//   let c2 = 2; // Social coefficient
//   let w = 0.7; // Inertia weight

//   // Generate initial bins
//   let bins = generateInitialBins(items, binSize);
//   for (let i = 0; i < numParticles; i++) {
//     const initialPosition = generateInitialBins(items, binSize);
//     const initialFitness = evaluateFitness(
//       initialPosition,
//       items,
//       binSize,
//       initialPosition.length
//     );

//     const particle = {
//       position: initialPosition,
//       velocity: generateRandomSolution(items),
//       bestPosition: initialPosition.slice(),
//       bestFitness: initialFitness,
//     };

//     if (initialFitness < particle.bestFitness) {
//       particle.bestPosition = particle.position.slice();
//       particle.bestFitness = initialFitness;
//     }

//     particles.push(particle);
//   }

//   // Find the global best position and fitness
//   let globalBestPosition = particles[0].position.slice();
//   let globalBestFitness = evaluateFitness(
//     globalBestPosition,
//     items,
//     binSize,
//     bins
//   );

//   for (let iteration = 0; iteration < maxIterations; iteration++) {
//     for (let particle of particles) {
//       // Initialize the best position as a copy of the current position
//       if (!particle.bestPosition) {
//         particle.bestPosition = particle.position.map((pos) => ({ ...pos }));
//         particle.bestFitness = particle.fitness;
//       }

//       // Update particle velocity and position
//       for (let i = 0; i < particle.velocity.length; i++) {
//         const r1 = Math.random();
//         const r2 = Math.random();

//         // Update velocity
//         const dx1 =
//           c1 * r1 * (particle.bestPosition[i].x - particle.position[i].x);
//         const dx2 =
//           c2 * r2 * (globalBestPosition[i].x - particle.position[i].x);
//         const dy1 =
//           c1 * r1 * (particle.bestPosition[i].y - particle.position[i].y);
//         const dy2 =
//           c2 * r2 * (globalBestPosition[i].y - particle.position[i].y);

//         // Update velocity using an extensible object
//         const newVelocity = {
//           x: w * particle.velocity[i].x + dx1 + dx2,
//           y: w * particle.velocity[i].y + dy1 + dy2,
//         };

//         particle.velocity[i] = newVelocity;

//         // Update position
//         const newPosition = particle.position.map((pos) => ({ ...pos }));
//         newPosition[i].x += particle.velocity[i].x;
//         newPosition[i].y += particle.velocity[i].y;
//         particle.position = newPosition;
//       }

//       // Ensure positions are within bounds
//       enforceBounds(particle.position, binSize, items);

//       // Apply local search mechanisms
//       for (let particle of particles) {
//         // Apply 2-opt local search
//         twoOptLocalSearch(particle.position, items, binSize, bins);

//         // Apply 3-opt local search
//         threeOptLocalSearch(particle.position, items, binSize, bins);
//       }

//       // 2-opt Local Search
//       function twoOptLocalSearch(positions, items, binSize, bins) {
//         const numItems = items.length;

//         for (let i = 0; i < numItems - 1; i++) {
//           for (let j = i + 1; j < numItems; j++) {
//             const swapPositions = twoOptSwap(positions[i], positions[j]);
//             const newFitness = evaluateFitness(positions, items, binSize, bins);

//             if (newFitness < particle.bestFitness) {
//               positions[i] = swapPositions[0];
//               positions[j] = swapPositions[1];
//               particle.bestPosition = particle.position.slice();
//               particle.bestFitness = newFitness;
//             }
//           }
//         }
//       }

//       // Perform a 2-opt swap on two positions
//       function twoOptSwap(position1, position2) {
//         const tempX = position1.x;
//         const tempY = position1.y;
//         position1.x = position2.x;
//         position1.y = position2.y;
//         position2.x = tempX;
//         position2.y = tempY;

//         return [position1, position2];
//       }

//       // 3-opt Local Search
//       function threeOptLocalSearch(positions, items, binSize, bins) {
//         const numItems = items.length;

//         for (let i = 0; i < numItems - 2; i++) {
//           for (let j = i + 1; j < numItems - 1; j++) {
//             for (let k = j + 1; k < numItems; k++) {
//               const newPositions = threeOptSwap(
//                 positions[i],
//                 positions[j],
//                 positions[k]
//               );
//               const newFitness = evaluateFitness(
//                 positions,
//                 items,
//                 binSize,
//                 bins
//               );

//               if (newFitness < particle.bestFitness) {
//                 positions[i] = newPositions[0];
//                 positions[j] = newPositions[1];
//                 positions[k] = newPositions[2];
//                 particle.bestPosition = particle.position.slice();
//                 particle.bestFitness = newFitness;
//               }
//             }
//           }
//         }
//         return [positions[i], positions[j], positions[k]];
//       }

//       // Perform a 3-opt swap on three positions
//       function threeOptSwap(position1, position2, position3) {
//         const tempX = position1.x;
//         const tempY = position1.y;
//         position1.x = position2.x;
//         position1.y = position2.y;
//         position2.x = position3.x;
//         position2.y = position3.y;
//         position3.x = tempX;
//         position3.y = tempY;

//         return [position1, position2, position3];
//       }

//       // Update particle's best position and fitness
//       const fitness = evaluateFitness(newPosition, items, binSize, bins);

//       if (fitness < particle.bestFitness) {
//         particle.bestPosition = newPosition.map((pos) => ({ ...pos }));
//         particle.bestFitness = fitness;
//       }

//       // Update global best position and fitness
//       if (fitness < globalBestFitness) {
//         globalBestPosition = newPosition.map((pos) => ({ ...pos }));
//         globalBestFitness = fitness;
//       }
//     }

//     // Update inertia weight
//     w -= (0.7 - 0.4) / maxIterations;
//   }

//   // Extract x and y coordinates from positions
//   const positionsWithCoordinates = globalBestPosition.map((position) => ({
//     x: position.x,
//     y: position.y,
//   }));

//   // Construct bins based on the final best position
//   const arrangedBins = constructBins(globalBestPosition, binSize, items);

//   // Calculate the density of each bin
//   const densities = calculateBinDensities(arrangedBins);

//   // Convert bins to the required format
//   const resultBins = arrangedBins.map((bin, index) => ({
//     id: index + 1,
//     items: bin.items.map((item, itemIndex) => ({
//       id: item.itemId,
//       x: positionsWithCoordinates[itemIndex].x,
//       y: positionsWithCoordinates[itemIndex].y,
//       rotate: positionsWithCoordinates[itemIndex].rotate,
//       width: item.itemWidth,
//       height: item.itemHeight,
//     })),
//     width: bin.width,
//     height: bin.height,
//     density: densities[index],
//   }));

//   return {
//     bins: resultBins,
//     fitness: globalBestFitness,
//   };
// }

// /* Helper Functions */

// // Generate initial bins using First Fit algorithm
// function generateInitialBins(items, binSize) {
//   const bins = [];

//   for (let item of items) {
//     let binFound = false;

//     for (let bin of bins) {
//       const canFit = checkFit(bin, bin.items, item);

//       if (canFit) {
//         bin.items.push(item);
//         binFound = true;
//         break;
//       }
//     }

//     if (!binFound) {
//       const bin = {
//         width: binSize.binWidth,
//         height: binSize.binHeight,
//         items: [item],
//       };
//       bins.push(bin);
//     }
//   }

//   return bins;
// }

// function enforceBounds(positions, binSize, items) {
//   for (let i = 0; i < positions.length; i++) {
//     const position = positions[i];
//     const item = items[i];

//     if (position.x < 0) {
//       position.x = 0;
//     } else if (position.x + item.width > binSize.width) {
//       position.x = binSize.width - item.width;
//     }

//     if (position.y < 0) {
//       position.y = 0;
//     } else if (position.y + item.height > binSize.height) {
//       position.y = binSize.height - item.height;
//     }
//   }
// }

// // Generate a random solution
// function generateRandomSolution(items) {
//   const positions = [];

//   for (let item of items) {
//     positions.push({ ...item, position: { x: 0, y: 0 } });
//   }

//   return positions;
// }

// // Evaluate fitness of a solution
// function evaluateFitness(positions, items, binSize, bins) {
//   // Reset bins
//   bins = [];

//   // Initialize fitness variables
//   let fitness = 0;

//   // Iterate over positions
//   for (let i = 0; i < positions.length; i++) {
//     const position = positions[i];
//     const item = items[i];

//     // Check if item fits in any existing bin along with existing items
//     let binIndex = -1;
//     for (let j = 0; j < bins.length; j++) {
//       const bin = bins[j];
//       const canFit = checkFit(bin, bin.items, item);
//       if (canFit) {
//         binIndex = j;
//         break;
//       }
//     }

//     // If item does not fit in any existing bin, create a new bin
//     if (binIndex === -1) {
//       bins.push({
//         width: binSize.binWidth,
//         height: binSize.binHeight,
//         items: [],
//       });
//       binIndex = bins.length - 1;
//     }

//     // Add item to bin
//     bins[binIndex].items.push(item);
//   }

//   // Calculate fitness based on the number of bins used and the arrangement of items
//   const numBins = bins.length;
//   const maxFitness = binSize.binWidth * binSize.binHeight * numBins;
//   const itemArea = items.reduce((sum, item) => {
//     return sum + item.itemWidth * item.itemHeight;
//   }, 0);

//   fitness = (maxFitness - itemArea) / maxFitness;

//   return fitness;
// }

// // Check if an item can fit in a bin along with existing items, considering rotation
// function checkFit(bin, position, item) {
//   const orientations = [
//     { width: item.itemWidth, height: item.itemHeight, rotate: false },
//     { width: item.itemHeight, height: item.itemWidth, rotate: true },
//   ];

//   for (let orientation of orientations) {
//     if (
//       bin.width >= position.x + orientation.width &&
//       bin.height >= position.y + orientation.height
//     ) {
//       // Check if the item can fit along with existing items in the bin
//       let canFit = true;
//       for (let existingItem of bin.items) {
//         if (
//           position.x + orientation.width > existingItem.x &&
//           existingItem.x + existingItem.itemWidth > position.x &&
//           position.y + orientation.height > existingItem.y &&
//           existingItem.y + existingItem.itemHeight > position.y
//         ) {
//           canFit = false;
//           break;
//         }
//       }

//       if (canFit) {
//         // Item fits in the bin, return true
//         return { fit: true, rotate: orientation.rotate };
//       }
//     }
//   }

//   return { fit: false }; // Item does not fit in the bin, return false
// }

// function constructBins(positions, binSize, items) {
//   // Reset bins
//   const bins = [];

//   // Iterate over positions
//   for (let i = 0; i < positions.length; i++) {
//     const position = positions[i];
//     const item = items[i];

//     // Check if item fits in any existing bin along with existing items
//     let binIndex = -1;
//     for (let j = 0; j < bins.length; j++) {
//       const bin = bins[j];
//       const canFit = checkFit(bin, position, item);
//       if (canFit) {
//         binIndex = j;
//         break;
//       }
//     }

//     // If item does not fit in any existing bin, create a new bin
//     if (binIndex === -1) {
//       bins.push({
//         width: binSize.binWidth,
//         height: binSize.binHeight,
//         items: [],
//       });
//       binIndex = bins.length - 1;
//     }

//     // Add item to bin
//     bins[binIndex].items.push(item);
//   }

//   return bins;
// }

// // Calculate the density of each bin
// function calculateBinDensities(bins) {
//   return bins.map((bin) => {
//     const itemArea = bin.items.reduce((sum, item) => {
//       return sum + item.itemWidth * item.itemHeight;
//     }, 0);
//     const binArea = bin.width * bin.height;
//     return itemArea / binArea;
//   });
// }
