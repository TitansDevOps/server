import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from '@modules/mail/entities/mail.entity';
import { MailService } from '@modules/mail/mail.service';
import { MailController } from '@modules/mail/mail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Mail])],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService, TypeOrmModule.forFeature([Mail])],
})
export class MailModule {}
