#[tauri::command]
pub fn greet(name: &str) -> String {
    let greet_str = format!("Hello, {}! You've been greeted from Rust!", name);
    println!("request to get");
    greet_str
}