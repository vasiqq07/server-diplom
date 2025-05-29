import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { TelegramService } from './telegram.service';

@Module({
  imports: [PrismaModule],
  providers: [TelegramService],
  exports: [TelegramService]
})
export class TelegramModule {}
