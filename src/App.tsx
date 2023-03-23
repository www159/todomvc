import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Todo } from "./types/todo";
import { useAtom } from "jotai";
import { todosAtom, filterAtom } from "./store/todo";

import TodoList from "./components/TodoList";

function App() {
  
  // ANCHOR store
  const [,setTodos] = useAtom(todosAtom);
  const [filtedTodos] = useAtom(filterAtom);
  // ANCHOR_END store

  // ANCHOR component state
  const [name, setName] = useState("");
  const [greetMsg, setGreetMsg] = useState("");
  // ANCHOR_END component state

  // ANCHOR hook function
    // async function greet() {
    //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    //   setGreetMsg(await invoke("greet", { name }));
    // }
  // ANCHOR_END hook function

  // ANCHOR side effect
  useEffect(() => {
    invoke<Todo[]>("get_todos").then(res => {
      setTodos(res);
    })
  }, []);
  // ANCHOR_END side effect

  return (
    <div className="todoapp">
      <TodoList todos={filtedTodos}/>
    </div>
  )
}

export default App;
