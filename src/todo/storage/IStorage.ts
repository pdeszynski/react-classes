import { Todo } from "../models/Todo";

export default interface IStorage<T extends any, K extends keyof T> {

    find(id: T[K]): T;
    
    add(item: T): T;

    remove(id: T[K]): T;

    count(): number;

    all(): T[]
}
