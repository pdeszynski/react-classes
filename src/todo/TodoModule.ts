import { Module } from '@nestjs/common';
import { TodoResolver } from './resolvers/TodoResolver';

@Module({
    providers: [TodoResolver]
})
export class TodoModule {}
