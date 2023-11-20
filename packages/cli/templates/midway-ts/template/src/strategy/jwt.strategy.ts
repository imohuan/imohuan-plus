import { CustomStrategy, PassportStrategy } from '@midwayjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Config } from '@midwayjs/decorator';

@CustomStrategy()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  @Config('jwt')
  jwtConfig;

  // jwt策略，验证token的内容，可以用于登录或者判断其他
  async validate(payload) {
    return payload;
  }

  getStrategyOptions(): any {
    return {
      secretOrKey: this.jwtConfig.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };
  }
}
