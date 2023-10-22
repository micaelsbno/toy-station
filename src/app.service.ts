import { Injectable } from "@nestjs/common";
import { CheckConflictsRequest } from "./app.schema";
import { StationMap } from "./Models/StationMap";
import { InterlockCoordinator } from "./Models/InterlockCoordinator";
import { ActiveTrain } from "./Models/ActiveTrain";

@Injectable()
export class AppService {
  checkRoute(request: CheckConflictsRequest): boolean {
    const stationMap = new StationMap(
      request.station_graph,
      request.station_graph[0].start
    );

    const coordinator = new InterlockCoordinator(stationMap);

    for (const route of request.routes) {
      if (route.occupied) {
        const activeTrain = new ActiveTrain(route.start, route.end);
        try {
          coordinator.addActiveTrain(activeTrain);
        } catch (e) {
          console.log("Error: ", e);
          return false;
        }
      }
    }

    const { start, end } = request.check_route;
    try {
      coordinator.addActiveTrain(new ActiveTrain(start, end));
    } catch (e) {
      console.log("Error: ", e);
      return false;
    }
    return true;
  }
}
