import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Todo } from "./types/todo";
import { useAtom } from "jotai";
import { todosAtom, filterAtom } from "./store/todo";

import reactLogo from "./assets/react.svg";
import "./App.css";
import TodoList from "./components/TodoList";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const [,setTodos] = useAtom(todosAtom);
  const [filtedTodos] = useAtom(filterAtom);

  useEffect(() => {
    invoke<Todo[]>("get_todos").then(res => {
      setTodos(res);
    })
  }, []);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="todoapp">
      <TodoList todos={filtedTodos}/>
    </div>
  )
}

export default App;
