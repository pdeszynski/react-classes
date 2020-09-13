/* eslint-disable @typescript-eslint/no-unused-vars */
import { Resolver, Args, Int, Query, Mutation, Subscription } from "@nestjs/graphql";
import { Todo } from "../models/Todo";
import { PubSub } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { Storage } from "../services";
import IStorage from "../storage/IStorage";

const pubsub = new PubSub();

@Resolver(of => Todo)
export class TodoResolver {
  constructor(
    @Inject(Storage) private readonly storage: IStorage<Todo, 'id'>,
  ) {}

  @Query(returns => Todo)
  async todo(@Args('id', { type: () => Int }) id: number) {
    return this.storage.find(id) || null;
  }

  @Mutation(returns => Todo)
  createTodo(@Args('title', { type: () => String }) title: string): Todo {
        const todo = new Todo(this.storage.count() + 1, title, new Date(), false);
        this.storage.add(todo);
        pubsub.publish('todoAdded', { todoAdded: todo });
        return todo;
  }

  @Mutation(returns => Todo)
  deleteTodo(@Args('id', { type: () => Int }) id: number): Todo {
    const todo = this.storage.remove(id);
    if (!todo) return null;

    pubsub.publish('todoDeleted', { todoDeleted: todo });
    return todo;
  }

  @Mutation(returns => Todo)
  done(@Args('id', { type: () => Int }) id: number): Todo {
    const todo = this.storage.find(id);
    if (!todo) return null;

    todo.markDone();
    pubsub.publish('todoChanged', { todoChanged: todo });
    return todo;
  }

  @Mutation(returns => Todo)
  undone(@Args('id', { type: () => Int }) id: number): Todo {
    const todo = this.storage.find(id);
    if (!todo) return null;

    todo.markUndone();
    pubsub.publish('todoChanged', { todoChanged: todo });
    return todo;
  }

  @Mutation(returns => Todo)
  rename(
      @Args('id', { type: () => Int }) id: number,
      @Args('title', { type: () => String }) withTitle: string): Todo {
      const todo = this.storage.find(id);
      if (!todo) return null;
      todo.rename(withTitle);
      pubsub.publish('todoChanged', { todoChanged: todo })
      return todo;
  }

  @Query(returns => [Todo])
  todos(): Array<Todo> {
    return this.storage.all();
  }

  @Subscription(returns => Todo)
  todoAdded() {
      return pubsub.asyncIterator('todoAdded');
  }

  @Subscription(returns => Todo)
  todoChanged() {
      return pubsub.asyncIterator('todoChanged')
  }

  @Subscription(returns => Todo)
  todoDeleted() {
      return pubsub.asyncIterator('todoDeleted')
  }
}
