import { StationMap } from "./StationMap";

describe("StationMaps", () => {
  const isChildStation = (station) => {
    return station.parent === false;
  };

  it("should build a node tree when given a list of branches", () => {
    const stationGraph = [
      { start: "Point_A", end: "Station" },
      { start: "Station", end: "Point_B" },
    ];

    const stationMap = new StationMap(stationGraph, "Point_A");

    const point_b = stationMap.get("Point_A").connections[0].connections[1];
    expect(point_b.name).toBe("Point_B");
  });

  it("should handle mutiple branches converging and diverging", () => {
    const stationGraph = [
      { start: "Point_A", end: "Station" },
      { start: "Station", end: "Point_B" },
      { start: "Station", end: "Point_C" },
      { start: "Point_C", end: "Station_2" },
      { start: "Point_B", end: "Station_2" },
      { start: "Station_2", end: "Point_D" },
    ];

    const stationMap = new StationMap(stationGraph, "Point_A");

    const point_d = stationMap
      .get("Point_A")
      .connections.filter(isChildStation)[0]
      .connections.filter(isChildStation)[0]
      .connections.filter(isChildStation)[0]
      .connections.filter(isChildStation)[0];
    expect(point_d.name).toBe("Point_D");
    const point_c = stationMap
      .get("Point_A")
      .connections.filter(isChildStation)[0]
      .connections.filter(isChildStation)[1];
    expect(point_c.name).toBe("Point_C");
  });

  it("should handle a loop", () => {
    const stationGraph = [
      { start: "Point_A", end: "Station" },
      { start: "Station", end: "Point_B" },
      { start: "Point_B", end: "Station" },
    ];

    const stationMap = new StationMap(stationGraph, "Point_A");

    const point_b = stationMap
      .get("Point_A")
      .connections.filter(isChildStation)[0]
      .connections.filter(isChildStation)[0];
    expect(point_b.name).toBe("Point_B");
  });
});
