import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Todo {
  @Field(type => Int)
  id: number;

  @Field({ nullable: false })
  title: string;

  @Field({ nullable: false })
  createdAt: Date;

  @Field({ nullable: false })
  done: boolean;

  markDone() {
      this.done = true;
  }

  markUndone() {
      this.done = false;
  }

  constructor(id: number, title: string, createdAt: Date, done = false) {
      this.id = id;
      this.title = title;
      this.createdAt = createdAt;
      this.done = done;
  }
}
