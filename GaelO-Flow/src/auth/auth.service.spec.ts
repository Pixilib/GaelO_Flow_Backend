import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, MailService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('verifyToken', () => {
    it('should return the decoded id when the token is valid', async () => {
      // Arrange
      const token = 'valid_token';
      const decoded = { id: 123 };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(decoded);

      // Act
      const result = await service.verifyToken(token);

      // Assert
      expect(result).toBe(decoded.id);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
    });

    it('should return null when the token is invalid', async () => {
      // Arrange
      const token = 'invalid_token';

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));

      // Act
      const result = await service.verifyToken(token);

      // Assert
      expect(result).toBeNull();
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
    });
  });
});
