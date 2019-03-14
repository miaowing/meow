import { Module } from '@nestjs/common';
import { FeignModule } from '@nestcloud/feign';
import { BootModule } from '@nestcloud/boot';
import { LoggerModule } from '@nestcloud/logger';
import * as controllers from './controllers';
import * as clients from './clients';
import * as services from './services';
import { components } from './utils/ProviderUtils';

@Module({
  imports: [
    LoggerModule.register(),
    BootModule.register(__dirname, `configs/config.yaml`),
    FeignModule.register({}),
  ],
  controllers: components(controllers),
  providers: components(clients, services),
})
export class AppModule {
}
