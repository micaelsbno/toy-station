import { StationMap } from "./StationMap";

export class ActiveTrain {
  start: string;
  end: string;
  shortestPath: Array<{ parent: boolean; name: string }>;

  constructor(start: string, end: string) {
    this.start = start;
    this.end = end;
  }

  detectRouteDirection(
    stationMap: StationMap,
    startNodeName: string,
    endNodeName: string
  ) {
    const visited = new Set();
    const queue = [startNodeName];

    // Perform a breadth-first search to find the endNode
    while (queue.length > 0) {
      const currentNodeName = queue.shift();
      const currentNode = stationMap.get(currentNodeName);

      visited.add(currentNodeName);

      for (const child of currentNode.connections || []) {
        if (!visited.has(child.name)) {
          queue.push(child.name);

          // If the child node matches the endNode, we've found the route
          if (child.name === endNodeName) {
            return "Forward"; // Route goes from start to end
          }
        }
      }

      for (const parent of currentNode.connections.filter(
        (station) => station.parent
      )) {
        if (!visited.has(parent.name)) {
          queue.push(parent.name);

          // If the parent node matches the endNode, we've found the route
          if (parent.name === endNodeName) {
            return "Backward"; // Route goes from end to start
          }
        }
      }
    }

    return "Unknown"; // No route found
  }

  setShortestPath(stationMap: StationMap) {
    const startNodeName = this.start;
    const endNodeName = this.end;

    const direction = this.detectRouteDirection(
      stationMap,
      startNodeName,
      endNodeName
    );

    const visited = new Set();
    const distances = new Map();
    const previousNodes = new Map();

    distances.set(startNodeName, 0);

    const queue = [startNodeName];

    // Keep track of all paths with the same minimum distance
    const paths: { parent: boolean; name: string }[][] = [];
    let minDistance = Infinity;

    while (queue.length > 0) {
      const currentNodeName = queue.shift();
      const currentNode = stationMap.get(currentNodeName);
      visited.add(currentNodeName);

      const connections =
        direction === "Forward"
          ? currentNode.connections.filter((station) => !station.parent)
          : currentNode.connections.filter((station) => station.parent);

      for (const child of connections) {
        // Should check here to filter for direction of travel
        if (!visited.has(child.name)) {
          const distance = distances.get(currentNodeName) + 1;

          if (distance <= (distances.get(child.name) || Infinity)) {
            distances.set(child.name, distance);
            previousNodes.set(child.name, currentNodeName);
            queue.push(child.name);

            if (child.name === endNodeName) {
              // Check if this path is a candidate for the shortest path
              if (distance < minDistance) {
                minDistance = distance;
              }

              if (distance === minDistance) {
                // Construct the path and add it to the list of paths
                const path: { parent: boolean; name: string }[] = [];
                let tempNode = { parent: child.parent, name: child.name };
                while (tempNode.name !== startNodeName) {
                  path.unshift(tempNode);
                  tempNode = {
                    parent: tempNode.parent,
                    name: previousNodes.get(tempNode.name),
                  };
                }
                path.unshift({
                  parent: stationMap.get(startNodeName).parent,
                  name: startNodeName,
                });
                paths.push(path);
              }
            }
          }
        }
      }
    }

    if (paths.length === 0) {
      return null; // No path found
    }

    this.shortestPath = paths[0]; // Sorting and verifying if more applicable path can be done if multiple routes are returned here.
  }
}
