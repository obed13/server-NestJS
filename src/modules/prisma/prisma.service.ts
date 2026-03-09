import {
    Injectable,
    Logger,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from 'prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { envs } from 'src/config';

@Injectable()
export class PrismaService extends PrismaClient{ 
    constructor() {
        const adapter = new PrismaPg({ connectonString: envs.DATABASE_URL });
        super({ adapter });
    }
}
