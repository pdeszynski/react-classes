import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTodoDto {
    @ApiProperty()
    @IsString()
    public readonly title: string
}
