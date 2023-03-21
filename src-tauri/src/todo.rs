use rusqlite::{Connection, Result, params};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Todo {
    pub id: String,
    pub label: String,
    pub done: bool,
    pub is_delete: bool,
}

pub struct TodoApp {
    pub conn: Connection,
}

impl TodoApp {
    pub fn new() -> Result<TodoApp> {
        let db_path = "db.sqlite";
        let conn = Connection::open(db_path)?;
        conn.execute(
            "CREATE TABLE IF NOT EXISTS Todo (
                id  varchar(64) PRIMARY KEY,
                label   text    NOT NULL,
                done    numeric DEFAULT 0,
                is_delete   numeric DEFAULT 0
            )",
            []
        )?;
        Ok(TodoApp { conn })
    }

    pub fn get_todos(&self) -> Result<Vec<Todo>> {
        let mut stmt = self.conn.prepare("SELECT * FROM Todo WHERE is_delete != 1").unwrap();
        let todos_iter = stmt.query_map([], |row| {
            let done = row.get::<usize, i32>(2).unwrap() == 1;
            let is_delete = row.get::<usize, i32>(3).unwrap() == 1;

            Ok(Todo {
                id: row.get(0)?,
                label: row.get(1)?,
                done,
                is_delete,
            })
        })?;

        let mut todos: Vec<Todo> = Vec::new();

        for todo_results in todos_iter {
            todos.push(todo_results?);
        }

        Ok(todos)
    }

    pub fn new_todo(&self, todo: Todo) -> bool {
        let Todo { id, label, .. } = todo;
        match self
            .conn
            .execute("INSERT INTO Todo (id, label) VALUES (?, ?)", 
                [id, label])
        {
            Ok(insert_row) => {
                println!("{} row inserted", insert_row);
                true
            }
            Err(err) => {
                println!("cannot insert. err: {}", err);
                false
            }
        }
    }

    pub fn update_todo(&self, todo: Todo) -> bool {
        let Todo { id, label, done, is_delete } = todo;
        match self
            .conn
            .execute("UPDATE Todo SET label = ?1, done = ?3, is_delete = ?4 WHERE id = ?2", 
                    params![
                        label,
                        id,
                        match done {
                            true => 1i32,
                            false => 0i32,
                        }, 
                        match is_delete {
                            true => 1i32,
                            false => 0i32,
                        },])
        {
            Ok(update_row) => {
                println!("{} row updated", update_row);
                true
            }
            Err(err) => {
                println!("cannot update. err: {}", err);
                false
            }
        }
    }
}