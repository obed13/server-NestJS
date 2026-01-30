import { Body, Controller, Post } from '@nestjs/common';
import * as interfaces from '../users/interfaces';
import { EmailsService } from '../emails/emails.service';

@Controller('test')
export class TestController {
    constructor(private readonly emails: EmailsService) { }

    @Post()
    async test() {
        return await this.emails.sendEmail({
            to: ["obekcdr@hotmail.com"],
            subject: "hello world prueba",
            html: "<strong>it works!</strong>",
        });
    }
}
