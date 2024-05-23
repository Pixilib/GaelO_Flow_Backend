import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard extanding JWT Strategy (validation of token to a third oauth)
 */
@Injectable()
export class JwtOAuthGuard extends AuthGuard('bearer') {}
