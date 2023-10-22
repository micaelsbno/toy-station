import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { UseZodGuard } from "nestjs-zod";
import { CheckConflictsRequest } from "./app.schema";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/check_route")
  @HttpCode(200)
  @UseZodGuard("body", CheckConflictsRequest)
  checkConflicts(@Body() request: CheckConflictsRequest): { success: boolean } {
    return { success: this.appService.checkRoute(request) };
  }
}
