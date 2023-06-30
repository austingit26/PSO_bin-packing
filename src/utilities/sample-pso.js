class Bin {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.items = [];
  }

  add_item(item) {
    this.items.push(item);
  }
}

class Item {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotate = false;
  }
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

export function binPacking({ binWidth, binHeight }, items) {
  let convertedItems = items.map((item) => {
    return new Item(0, 0, item.itemWidth, item.itemHeight);
  });

  let bins = initialize_particle(convertedItems, binWidth, binHeight);

  let arrangedItems = bins.map((bin) => {
    let itemData = bin.items.map((item) => {
      return {
        name: item.name,
        width: item.rotate ? item.height : item.width,
        height: item.rotate ? item.width : item.height,
        x: item.x,
        y: item.y,
        rotate: item.rotate,
      };
    });

    let binDensity =
      bin.items.reduce(
        (accumulator, item) => accumulator + item.width * item.height,
        0
      ) /
      (bin.width * bin.height);

    return {
      binWidth: bin.width,
      binHeight: bin.height,
      items: itemData,
      binDensity: binDensity,
    };
  });

  return arrangedItems;
}
