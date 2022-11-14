import { Module } from '@nestjs/common';
import { CoreGateway } from './core.gateway';

@Module({
  providers: [CoreGateway]
})
export class CoreModule {}
