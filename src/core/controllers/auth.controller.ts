import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ChangePassword } from '../interfaces/interfaces';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import * as express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() changePassword: ChangePassword, @Req() req: express.Request) {
    // Inyectar el ID del usuario autenticado desde el token
    const user = (req as any).user;
    changePassword.id = user?._id;

    return this.authService.changePassword(changePassword);
  }
}
