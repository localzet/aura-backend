import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AxiosService } from './axios.service';

@Global()
@Module({
    imports: [CqrsModule],
    providers: [AxiosService],
    exports: [AxiosService],
})
export class AxiosModule {
}
