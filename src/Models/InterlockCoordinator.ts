import { ActiveTrain } from "./ActiveTrain";
import { StationMap } from "./StationMap";

export class InterlockCoordinator {
  currentTrains: Array<ActiveTrain> = [];
  stationMap: StationMap;

  constructor(stationMap: StationMap) {
    this.stationMap = stationMap;
  }

  addActiveTrain(newTrain: ActiveTrain) {
    newTrain.setShortestPath(this.stationMap);
    if (!newTrain.shortestPath) {
      throw new Error("No path found");
    }

    for (const activeTrain of this.currentTrains) {
      for (const stationIdx in newTrain.shortestPath) {
        if (
          activeTrain.shortestPath[stationIdx]?.name ===
          newTrain.shortestPath[stationIdx]?.name
        ) {
          throw new Error("Path conflict");
        }
      }
    }
    this.currentTrains.push(newTrain);
  }
}
