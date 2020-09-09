import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Todo {
  @Field(type => Int)
  private id: number;

  @Field({ nullable: false })
  private title: string;

  @Field({ nullable: false })
  private createdAt: Date;

  @Field({ nullable: false })
  private done: boolean;

  markDone() {
      this.done = true;
  }

  markUndone() {
      this.done = false;
  }

  rename(withTitle: string) {
      this.title = withTitle;
  }

  constructor(id: number, title: string, createdAt: Date, done = false) {
      this.id = id;
      this.title = title;
      this.createdAt = createdAt;
      this.done = done;
  }
}
