import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
@Injectable()
export class UtilsService {
  getUuid() {
    return randomUUID();
  }
}
