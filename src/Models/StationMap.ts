import { StationBranch } from "src/app.schema";

class Station {
  name: string;
  connections: Station[] = [];
  parent: boolean;

  constructor(name: string, parent?: Station) {
    this.name = name;
  }

  addChild(child: Station) {
    this.connections.push(child);
  }
}

export class StationMap {
  stationMap: Map<string, Station>;
  rootName: string;

  buildTree(data: StationBranch[], rootName: string) {
    const nodeMap = new Map();

    for (const item of data) {
      const { start, end } = item;

      if (!nodeMap.has(start)) {
        nodeMap.set(start, new Station(start));
      }
      if (!nodeMap.has(end)) {
        nodeMap.set(end, new Station(end));
      }

      const parentNode = nodeMap.get(start);
      const childNode = nodeMap.get(end);

      parentNode.addChild({ ...childNode, parent: false }); // Add forward connection
      childNode.addChild({ ...parentNode, parent: true }); // Add backward connection
    }

    this.rootName = rootName;
    return nodeMap;
  }

  constructor(branches: StationBranch[], rootName: string) {
    this.stationMap = this.buildTree(branches, rootName);
  }

  get(name: string) {
    return this.stationMap.get(name);
  }
}
