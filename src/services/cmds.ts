import { invoke } from "@tauri-apps/api";
import { Todo } from "../types/todo";

export const getTodos = async () =>
    invoke<Todo[]>("get_todos")

export const newTodo = async (todo: Todo) => 
    invoke<boolean>("new_todo", { todo })

export const updateTodo = async (todo: Todo) => 
    invoke<boolean>("update_todo", { todo })