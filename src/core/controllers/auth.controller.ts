import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ChangePassword } from '../interfaces/interfaces';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() changePassword: ChangePassword, ) {
    return this.authService.changePassword(changePassword);
  }
}
