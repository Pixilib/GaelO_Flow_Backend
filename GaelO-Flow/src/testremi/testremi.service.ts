import { Injectable } from '@nestjs/common';

@Injectable()
export class TestremiService {
    helloRemi(): string {
        return 'Hello Remi!';
    }
}
