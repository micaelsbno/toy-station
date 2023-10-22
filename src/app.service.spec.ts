import { AppService } from "./app.service";

export const exampleRequest = {
  station_graph: [
    { start: "Station West", end: "Entry Signal West" },
    { start: "Entry Signal West", end: "Point 1" },
    { start: "Point 1", end: "Exit Signal West 1" },
    { start: "Point 1", end: "Exit Signal West 2" },
    { start: "Exit Signal West 1", end: "Exit Signal East 1" },
    { start: "Exit Signal West 2", end: "Exit Signal East 2" },
    { start: "Exit Signal East 1", end: "Point 2" },
    { start: "Exit Signal East 2", end: "Point 2" },
    { start: "Point 2", end: "Entry Signal East" },
    { start: "Entry Signal East", end: "Station East" },
  ],
  routes: [
    {
      start: "Entry Signal West",
      end: "Exit Signal East 1",
      occupied: false,
    },
    {
      start: "Entry Signal West",
      end: "Exit Signal East 2",
      occupied: false,
    },
    { start: "Exit Signal East 1", end: "Station East", occupied: false },
    { start: "Exit Signal East 2", end: "Station East", occupied: false },
    {
      start: "Entry Signal East",
      end: "Exit Signal West 1",
      occupied: false,
    },
    {
      start: "Entry Signal East",
      end: "Exit Signal West 2",
      occupied: false,
    },
    { start: "Exit Signal West 1", end: "Station West", occupied: true },
    { start: "Exit Signal West 2", end: "Station West", occupied: false },
  ],
  check_route: { start: "Entry Signal West", end: "Exit Signal East 2" },
};

describe("StationGraphChecker", () => {
  it("should return false if route is not allowed", () => {
    const stationGraphService = new AppService();

    const result = stationGraphService.checkRoute(exampleRequest);

    expect(result).toBe(false);
  });

  it("returs true in a simple scenario", () => {
    const stationGraphService = new AppService();

    const result = stationGraphService.checkRoute({
      station_graph: [
        { start: "StartA", end: "Central" },
        { start: "Central", end: "PointEnd" },
      ],
      routes: [
        {
          start: "StartA",
          end: "Central",
          occupied: true,
        },
      ],
      check_route: {
        start: "Central",
        end: "PointEnd",
      },
    });

    expect(result).toBe(true);
  });

  it("returns true in a complex scenario", () => {
    // flowchart LR
    //   StartA -- >> --- Central -- >> --- PointEnd
    //   StartB -- >> --- PointB -- >> --- Central
    //   StartC -- >> --- PointC1 -- >> --- PointC2 -- >> --- Central
    //   StartD -- >> --- PointD1 -- >> --- PointD2 -- >> --- Central
    const stationGraphService = new AppService();

    const result = stationGraphService.checkRoute({
      station_graph: [
        { start: "StartA", end: "Central" },
        { start: "Central", end: "PointEnd" },
        { start: "StartB", end: "PointB" },
        { start: "PointB", end: "Central" },
        { start: "StartC", end: "PointC1" },
        { start: "PointC1", end: "PointC2" },
        { start: "PointC2", end: "Central" },
        { start: "StartD", end: "PointD1" },
        { start: "PointD1", end: "PointD2" },
        { start: "PointD2", end: "Central" },
      ],
      routes: [
        {
          start: "StartA",
          end: "Central",
          occupied: true,
        },
        {
          start: "StartB",
          end: "PointEnd",
          occupied: true,
        },
        {
          start: "StartC",
          end: "PointEnd",
          occupied: true,
        },
      ],
      check_route: {
        start: "StartD",
        end: "PointD2",
      },
    });

    expect(result).toBe(true);
  });

  it("returns false in a complex scenarion", () => {
    // flowchart LR
    //   StartA -- >> --- Central -- >> --- PointEnd
    //   StartB -- >> --- PointB -- >> --- Central
    //   StartC -- >> --- PointC1 -- >> --- PointC2 -- >> --- Central
    //   StartD -- >> --- PointD1 -- >> --- PointD2 -- >> --- Central
    const stationGraphService = new AppService();

    const result = stationGraphService.checkRoute({
      station_graph: [
        { start: "StartA", end: "Central" },
        { start: "Central", end: "PointEnd" },
        { start: "StartB", end: "PointB" },
        { start: "PointB", end: "Central" },
        { start: "StartC", end: "PointC1" },
        { start: "PointC1", end: "PointC2" },
        { start: "PointC2", end: "Central" },
        { start: "StartD", end: "PointD1" },
        { start: "PointD1", end: "PointD2" },
        { start: "PointD2", end: "Central" },
      ],
      routes: [
        {
          start: "StartA",
          end: "Central",
          occupied: true,
        },
        {
          start: "StartB",
          end: "PointEnd",
          occupied: true,
        },
        {
          start: "StartC",
          end: "PointEnd",
          occupied: true,
        },
      ],
      check_route: {
        start: "StartD",
        end: "PointEnd",
      },
    });

    expect(result).toBe(false);
  });

  it("handles both directions, but main path will always be in the order of the array passed to create the map", () => {
    // flowchart LR
    //   Central -- <> --- PointA -- <> --- End
    //   Central -- <> --- PointB -- <> --- End

    const stationGraphService = new AppService();

    const result = stationGraphService.checkRoute({
      station_graph: [
        { start: "Central", end: "PointA" },
        { start: "PointA", end: "End" },
        { start: "Central", end: "PointB" },
        { start: "PointB", end: "End" },
      ],
      routes: [
        {
          start: "Central",
          end: "End",
          occupied: true,
        },
      ],
      check_route: {
        start: "End",
        end: "Central",
      },
    });

    expect(result).toBe(false);
  });

  it("handles both directions, doesnt collide because goes through different exit", () => {
    // flowchart LR
    //   Central -- <> --- PointA -- <> --- End
    //   Central -- <> --- PointB -- <> --- End

    const stationGraphService = new AppService();

    const result = stationGraphService.checkRoute({
      station_graph: [
        { start: "Central", end: "PointA" },
        { start: "PointA", end: "End" },
        { start: "Central", end: "PointB" },
        { start: "PointB", end: "End" },
      ],
      routes: [
        {
          start: "Central",
          end: "End",
          occupied: true,
        },
      ],
      check_route: {
        start: "End",
        end: "PointA",
      },
    });

    expect(result).toBe(false);
  });
});
