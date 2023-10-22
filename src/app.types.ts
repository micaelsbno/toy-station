export type StationBranch = { start: string; end: string };
export type BranchState = StationBranch & { occupied: boolean };
export type CheckConflictsRequest = {
    // Array that represents a tree of the railway map
    station_graph: Array<StationBranch>;
    // The state of a branch at a given tick
    routes: Array<BranchState>;
    // The route to check
    check_route: StationBranch;
};

class Station {
    name: string;
    children: Array<Station>;
    constructor(name: string) {
        this.name = name;
        this.children = [];
    }
}

export class StationMap {
    stationMap: Map<string, Station>;

    buildTree(data: Array<StationBranch>) {
        const nodeMap = new Map();
        for (const item of data) {
            const { start, end } = item;
            if (!nodeMap.has(start)) {
                nodeMap.set(start, new Station(start));
            }
            if (!nodeMap.has(end)) {
                nodeMap.set(end, new Station(end));
            }
            nodeMap.get(start).children.push(nodeMap.get(end));
        }
        return nodeMap;
    }

    constructor(branches: Array<StationBranch>) {
        this.stationMap = this.buildTree(branches);
    }

    get(name: string) {
        return this.stationMap.get(name);
    }
}

export class ActiveTrain {
    start: string;
    end: string;
    shortestPath: Array<string>;

    findShortestPath(
        tree: StationMap,
        startNodeName: string,
        endNodeName: string,
    ) {
        const visited = new Set();
        const distances = new Map();
        const previousNodes = new Map();

        distances.set(startNodeName, 0);

        const queue = [startNodeName];

        while (queue.length > 0) {
            const currentNodeName = queue.shift();
            const currentNode = tree.get(currentNodeName);

            visited.add(currentNodeName);

            for (const child of currentNode.children) {
                if (!visited.has(child.name)) {
                    const distance = distances.get(currentNodeName) + 1;

                    if (distance < (distances.get(child.name) || Infinity)) {
                        distances.set(child.name, distance);
                        previousNodes.set(child.name, currentNodeName);
                        queue.push(child.name);
                    }
                }
            }
        }

        if (!previousNodes.has(endNodeName)) {
            return null; // No path found
        }

        const path = [];
        let currentNodeName = endNodeName;
        while (currentNodeName !== startNodeName) {
            path.unshift(currentNodeName);
            currentNodeName = previousNodes.get(currentNodeName);
        }
        path.unshift(startNodeName);
        return path;
    }

    constructor(start: string, end: string) {
        this.start = start;
        this.end = end;
    }

    setShortestPath(stationMap: StationMap) {
        this.shortestPath = this.findShortestPath(
            stationMap,
            this.start,
            this.end,
        );
    }
}

class InterlockCoordinator {
    currentTrains: Array<ActiveTrain>;
    stationMap: StationMap;

    constructor() {}

    addActiveTrain(newTrain: ActiveTrain) {
        newTrain.setShortestPath(this.stationMap);
        if (newTrain.shortestPath === null) {
            throw new Error('No path found');
        }

        for (const activeTrain of this.currentTrains) {
            for (const stationIdx in newTrain.shortestPath) {
                if (
                    activeTrain.shortestPath[stationIdx] ===
                    newTrain.shortestPath[stationIdx]
                ) {
                    throw new Error('Path conflict');
                }
            }
        }
        this.currentTrains.push(newTrain);
    }
}
