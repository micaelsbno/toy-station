import { Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { CheckConflictsRequest } from "./app.types";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/check_conflicts")
  checkConflicts(request: CheckConflictsRequest): { success: boolean } {
    return { success: this.appService.checkRoute(request) };
  }
}
