import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Auth } from "../entities/auth.entity";
import { Repository } from "typeorm";
import { UserData } from "src/interface/interface";
import { UnauthorizedException } from "@nestjs/common";

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(Auth)
        private userRepo: Repository<Auth>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET!
        })
    }

    async validate(payload: UserData){
        const user = await this.userRepo.findOneBy({id: payload.id})
        if(user){
            const {password, passwordConfirm, ...restData} = user
            return restData
        }
        else{
            throw new UnauthorizedException("non autoriser")
        }
    }
}