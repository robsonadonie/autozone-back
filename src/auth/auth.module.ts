import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Person } from 'src/person/entities/person.entity';
import { PersonService } from 'src/person/person.service';
import { JwtStrategy } from './strategie/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Auth,
      Person
    ]),
    PassportModule.register({
      defaultStrategy: "jwt"
    }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: "5h"}
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,PersonService,JwtStrategy],
})
export class AuthModule {}
