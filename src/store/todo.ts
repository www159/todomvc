import { atom } from "jotai";
import { Todo } from "../types/todo";

export const filterType = atom<"all" | "completed" | "active">("all")

export const todosAtom = atom<Todo[]>([]);

export const filterAtom = atom(get => {
    const todos = get(todosAtom);
    return todos.filter(todo => {
        if(get(filterType) === "all") return true;
        return todo.done === (get(filterType) === 'completed')
    })
})

export const numLeftAtom = atom(get => {
    const todos = get(filterAtom);
    if(get(filterType) === "all") {
        return todos.filter(todo => todo.done === false).length;
    }
    else {
        return todos.length;
    }
})

export const anyTodosDone = atom(get => {
    const todos = get(todosAtom);
    return todos.some(todo => todo.done);
})