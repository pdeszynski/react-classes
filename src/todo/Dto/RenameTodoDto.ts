import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RenameTodoDto {
    @ApiProperty()
    @IsString()
    public readonly title: string
}
