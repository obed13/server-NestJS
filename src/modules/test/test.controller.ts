import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as interfaces from '../users/interfaces';

@Controller('test')
export class TestController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async test(
        @Body() data: interfaces.CreateUserInterface
    ) {
        return await this.usersService.create(data);
    }
}
