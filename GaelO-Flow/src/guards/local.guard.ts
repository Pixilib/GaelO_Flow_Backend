import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
/**
 * Guard extanding looal Strategy (validation of password in the database)
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
