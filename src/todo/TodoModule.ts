import { Module } from '@nestjs/common';
import { TodoController } from './controller/TodoController';
import { TodoResolver } from './resolvers/TodoResolver';
import { Storage } from './services';
import { MemoryStorage } from './storage/MemoryStorage';

@Module({
    controllers: [TodoController],
    providers: [TodoResolver, MemoryStorage, {
        provide: Storage,
        useClass: MemoryStorage
    }],
})
export class TodoModule {}
