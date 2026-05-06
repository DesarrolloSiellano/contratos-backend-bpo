import { Global, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { JwtStrategy } from "../strategies/jwt.strategy";

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [PassportModule, JwtStrategy]
})
export class AuthModule {}