mod todo;

use todo::{Todo, TodoApp};
use std::sync::{Mutex, MutexGuard};

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command


struct AppState {
    app: Mutex<TodoApp>,
}
fn main() {
    let app = TodoApp::new().unwrap();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_todos,
            new_todo,
            update_todo,
        ])
        .manage(AppState {
            app: Mutex::from(app),
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


#[tauri::command]
fn greet(name: &str) -> String {
    let greet_str = format!("Hello, {}! You've been greeted from Rust!", name);
    println!("request to get");
    greet_str
}

#[tauri::command]
fn get_todos(app_store: tauri::State<AppState>) -> Vec<Todo> {
    let app: MutexGuard<TodoApp> = app_store.app.lock().unwrap();
    let todos = app.get_todos().unwrap();
    println!("{:#?}", todos);
    todos
}

#[tauri::command]
fn new_todo(todo: Todo, app_store: tauri::State<AppState>) -> bool {
    let app: MutexGuard<TodoApp> = app_store.app.lock().unwrap();
    let is_created = app.new_todo(todo);
    is_created
}

#[tauri::command]
fn update_todo(todo: Todo, app_store: tauri::State<AppState>) -> bool {
    let app: MutexGuard<TodoApp> = app_store.app.lock().unwrap();
    let is_update: bool = app.update_todo(todo);
    is_update
}