//create a class with fields egisterDto.password, registerDto.username, registerDto.email, registerDto.firstname, registerDto.lastname

import { IsEmail, IsNotEmpty } from 'class-validator';

//add a decorator to the class to make it a dto
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;
}
