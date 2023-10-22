import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { AppModule } from "./../src/app.module";
import { INestApplication } from "@nestjs/common";
import { exampleRequest } from "./app.service.spec";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/check_route (POST)", () => {
    return request(app.getHttpServer())
      .post("/check_route")
      .send(exampleRequest)
      .expect(200)
      .expect({ success: false });
  });

  it("/check_route (POST) with invalid data", () => {
    return request(app.getHttpServer())
      .post("/check_route")
      .send({
        station_graph: [{ start: "StartA", end: "Central" }],
        routes: [{ start: "StartA", end: "Central", occupied: false }],
      })
      .expect(400);
  });
});
