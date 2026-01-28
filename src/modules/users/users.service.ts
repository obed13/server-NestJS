import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInterface, GetUserInterface, UpdateUserInterface } from './interfaces';
import { BcryptService } from '../bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly bcrypt: BcryptService,
    ) { }

    private async validateEmail(email: string) {

        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { email: true }
        });

        if (!user) return

        throw new BadRequestException('The user is already exist.');
    }

    async create({
        name,
        lastName,
        avatar,
        email,
        backupEmail,
        phone,
        password,
        country,
        language,
        emailConfirm,
        backupEmailConfirm,
        phoneConfirm,
        twoFactorEnabled,
        twoFactorSecret,
        status,
        authProvider,
    }: CreateUserInterface) {
        await this.validateEmail(email);

        return await this.prisma.user.create({
            data: {
                name,
                lastName,
                avatar,
                email,
                backupEmail,
                phone,
                password: await this.bcrypt.hash(password),
                country,
                language,
                emailConfirm,
                backupEmailConfirm,
                phoneConfirm,
                twoFactorEnabled,
                twoFactorSecret,
                status,
                authProvider,
            },
        });
    }

    async update({ id, password, email, ...data }: UpdateUserInterface) {
        const user = await this.findOne({ id });

        if (email) {
            await this.validateEmail(email);
        }

        return await this.prisma.user.update({
            where: { id },
            data: {
                ...data,
                password: password && await this.bcrypt.hash(password),
                email: email && email,
            },
        });
    }

    async findOne({ id, email }: GetUserInterface) {
        const user = await this.prisma.user.findUnique({
            where: { id, email },
        });

        if (!user) throw new NotFoundException('User not found');

        return user;
    }

    async delete(id: string) {
        const user = await this.findOne({ id });

        return await this.prisma.user.delete({
            where: { id },
        });
    }
}
