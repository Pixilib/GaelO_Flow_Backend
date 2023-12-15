import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { RegisterDto } from './register-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    ) {}

  async signIn(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      userId: user.id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }


  async register(registerDto: RegisterDto): Promise<Object> {
    const { username, email } = registerDto;

    // Check if user already exists
    const userExists = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExists) {
      throw new ConflictException('A user already exist with this username or email');
    }

    const newUser = this.usersRepository.create(registerDto);
    const savedUser = await this.usersRepository.save(newUser);

    //return just id
    return {id: savedUser.id};
  }
  //TODO: add a job for send a mail to the user with a link to confirm his account

}


