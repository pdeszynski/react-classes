import { Resolver, Args, Int, Query, Mutation, Subscription } from "@nestjs/graphql";
import { Todo } from "../models/Todo";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

@Resolver(of => Todo)
export class TodoResolver {
    private todoList: Todo[] = []
  constructor(
    // TODO: services    
  ) {}

  @Query(returns => Todo)
  async todo(@Args('id', { type: () => Int }) id: number) {
    return this.todoList[id - 1] || null;
  }

  @Mutation(returns => Todo)
  createTodo(@Args('title', { type: () => String }) title: string): Todo {
        const todo = new Todo(this.todoList.length + 1, title, new Date(), false);
        this.todoList.push(todo);
        pubsub.publish('todoAdded', { todoAdded: todo });
        return todo;
  }

  @Mutation(returns => Todo)
  deleteTodo(@Args('id', { type: () => Int }) id: number): Todo {
    const todo = this.todoList[id - 1];
    if (!todo) return null;

    delete this.todoList[id]; // I do not use splice or side effect free approach as if using slice ids would change
    pubsub.publish('todoDeleted', { todoDeleted: todo });
    return todo;
  }

  @Mutation(returns => Todo)
  done(@Args('id', { type: () => Int }) id: number): Todo {
    const todo = this.todoList[id - 1];
    if (!todo) return null;

    todo.markDone();
    pubsub.publish('todoChanged', { todoChanged: todo });
    return todo;
  }

  @Mutation(returns => Todo)
  undone(@Args('id', { type: () => Int }) id: number): Todo {
    const todo = this.todoList[id - 1];
    if (!todo) return null;

    todo.markUndone();
    pubsub.publish('todoChanged', { todoChanged: todo });
    return todo;
  }

  @Query(returns => [Todo])
  todos(): Array<Todo> {
    return this.todoList;
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
