import {IsString } from 'class-validator';

export class ChangePasswordDto{

    @IsString()
    token: string;
    
    @IsString()
    newPassword: string;

}