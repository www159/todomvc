use serde::{Serialize, Deserialize};
use std::sync::{Mutex, MutexGuard};

use crate::applications::todo::TodoApp;

// global TodoApp managed by tauri
pub struct AppState {
    pub app: Mutex<TodoApp>,
}

// data model used both frontend and controller
#[derive(Serialize, Deserialize, Debug)]
pub struct Todo {
    pub id: String,
    pub label: String,
    pub done: bool,
    pub is_delete: bool,
}

#[tauri::command]
pub fn get_todos(app_store: tauri::State<AppState>) -> Vec<Todo> {
    let app: MutexGuard<TodoApp> = app_store.app.lock().unwrap();
    let todos = app.get_all().unwrap();
    // println!("{:#?}", todos);
    todos
}

#[tauri::command]
pub fn new_todo(todo: Todo, app_store: tauri::State<AppState>) -> bool {
    let app: MutexGuard<TodoApp> = app_store.app.lock().unwrap();
    let is_created = app.insert(todo);
    is_created
}

#[tauri::command]
pub fn update_todo(todo: Todo, app_store: tauri::State<AppState>) -> bool {
    let app: MutexGuard<TodoApp> = app_store.app.lock().unwrap();
    let is_update: bool = app.update(todo);
    is_update
}