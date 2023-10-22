import { Injectable } from '@nestjs/common';
import { CheckConflictsRequest } from './app.types';

@Injectable()
export class AppService {
  checkRoute(request: CheckConflictsRequest): boolean {
    return true;
  }
}
