import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { CreateTodoDto } from "../Dto/CreateTodoDto";
import { RenameTodoDto } from "../Dto/RenameTodoDto";
import { Todo } from "../models/Todo";
import { Storage } from "../services";
import IStorage from "../storage/IStorage";

@Controller('/todos')
export class TodoController {
    constructor(
        @Inject(Storage) private readonly storage: IStorage<Todo, 'id'>,
    ) {}
    @Get(':id')
    public find(@Param('id') id: number): Todo {
        return this.storage.find(id);
    }

    @Get()
    public all(): Todo[] {
        return this.storage.all();
    }

    @Post()
    public create(@Body() createTodoDto: CreateTodoDto): Todo {
        const todo = new Todo(this.storage.count() + 1, createTodoDto.title, new Date(), false);

        this.storage.add(todo);

        return todo;
    }

    @Put(':id/done')
    public done(@Param('id') id: number): Todo {
        const todo = this.storage.find(id);
        if (!todo) throw new NotFoundException();
        todo.markDone();

        return todo;
    }

    @Put(':id/undone')
    public undone(@Param('id') id: number): Todo {
        const todo = this.storage.find(id);
        if (!todo) throw new NotFoundException();
        todo.markUndone();

        return todo;
    }

    @Put(':id/rename')
    public rename(@Param('id') id: number, @Body() renameTodoDto: RenameTodoDto): Todo {
        const todo = this.storage.find(id);
        if (!todo) throw new NotFoundException();

        todo.rename(renameTodoDto.title);

        return todo;
    }

    @Delete(':id')
    public delete(@Param('id') id: number): Todo {
        const todo = this.storage.remove(id);
        if (!todo) throw new NotFoundException();

        return todo;
    }
}
