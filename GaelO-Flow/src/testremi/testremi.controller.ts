import { Controller, Get } from '@nestjs/common';
import { TestremiService } from './testremi.service';

@Controller('testremi')
export class TestremiController {
    constructor(private readonly TestremiService: TestremiService ){

    }

    @Get()
    helloRemi(): string {
        return this.TestremiService.helloRemi();
    }
  

}
