import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTokenInterface, PayloadTokenInterface, RevokeTokenInterface } from './interfaces';
import { AuthorizationToken } from 'src/common/enums';

@Injectable()
export class TokensService {

    private readonly randomToken = () => Math.floor(1000000 + Math.random() * 9000000).toString();

    private readonly getKey = ({ type, userId }: { type: AuthorizationToken, userId: string }) => `token:${type}:user:${userId}`;

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async generateToken({ userId, type, ttl = 900000 }: CreateTokenInterface) {
        try {
            return await this.cacheManager.set(
                this.getKey({ type, userId }),
                { userId, type, token: this.randomToken() },
                ttl
            );
        } catch (error) {
            throw new BadRequestException('There was an error.');
        }
    }

    async validateToken({ userId, type, token }: PayloadTokenInterface) {
        try {
            const payload: PayloadTokenInterface | undefined = await this.cacheManager.get<PayloadTokenInterface>(
                this.getKey({ type, userId })
            );

            if (!payload || payload.token !== token) {
                throw new UnauthorizedException('Invalid or expired token.');
            }

            return payload;
        } catch (error) {
            throw new BadRequestException('There was an error.');
        }
    }

    async revokeToken({ userId, type }: RevokeTokenInterface): Promise<boolean> {
        try {
            return await this.cacheManager.del(
                this.getKey({ type, userId })
            );
        } catch (error) {
            throw new BadRequestException('There was an error.');
        }
    }
}
