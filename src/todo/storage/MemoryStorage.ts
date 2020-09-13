import { Todo } from "../models/Todo";
import IStorage from "./IStorage";

export class MemoryStorage implements IStorage<Todo, 'id'> {
    private items: Todo[] = [];

    public find(id: number): Todo {
        return this.items[id - 1];
    }

    public add(item: Todo): Todo {
        this.items.push(item);
        return item;
    }

    public remove(id: number): Todo {
        const item = this.items[id - 1];

        if (!item) return null;

        delete this.items[id - 1];

        return item;
    }

    public count(): number {
        return this.items.length;
    }

    public all(): Todo[] {
        return this.items;
    }
}
