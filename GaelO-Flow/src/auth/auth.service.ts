import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
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

  async createConfirmationToken(user: User):Promise<string> {
  const payload = 
  { 
    id:user.id, 
    email: user.email 
  };
  return this.jwtService.sign(payload, {
    expiresIn: '24h', // Expiration en 24 heures
  })
}

  async register(registerDto: RegisterDto): Promise<{ status: number; message: string}> {
    const { username, email } = registerDto;

    // Check if user already exists
    const userExists = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExists) {
      throw new ConflictException('A user already exist with this username or email');
    }

    const newUser = this.usersRepository.create(registerDto);
    await this.usersRepository.save(newUser);

    //return HttpResponse code 201
    return {
      status: HttpStatus.CREATED,
      message: 'An email has been sent, confirm your account to login',
  };

  }
  //TODO: add a job for send a mail to the user with a link to confirm his account
}