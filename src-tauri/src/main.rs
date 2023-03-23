mod applications;
mod controllers;

use std::sync::{Mutex};


// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command


fn main() {
    let app = applications::todo::TodoApp::new().unwrap();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            //SECTION - test invoke
            controllers::test::greet,
            //~SECTION

            //SECTION - todo items
            controllers::todo::get_todos,
            controllers::todo::new_todo,
            controllers::todo::update_todo,
            //~SECTION
        ])
        .manage(controllers::todo::AppState {
            app: Mutex::from(app),
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


