import { Body, Controller, Get , Post} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly UserService: UsersService) {}
  
}
