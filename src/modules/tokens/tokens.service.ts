import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CreateTokenInterface } from './interfaces';

@Injectable()
export class TokensService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    private readonly randomToken = () => Math.floor(1000000 + Math.random() * 9000000).toString();

    async generateToken({
        userId,
        type,
        ttl = 900000,
    }: CreateTokenInterface) {
        return await this.cacheManager.set(`token:${type}:user:${userId}`, { userId, type, token: this.randomToken() }, ttl);
    }
}
