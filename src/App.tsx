import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { todosAtom, filterAtom } from "./store/todo";

import TodoList from "./components/TodoList";
import { getTodos } from "./services/cmds";

function App() {
  
  // SECTION store
  const [,setTodos] = useAtom(todosAtom);
  const [filtedTodos] = useAtom(filterAtom);
  // ~SECTION store

  // SECTION component state
  const [name, setName] = useState("");
  const [greetMsg, setGreetMsg] = useState("");
  // ANCHOR_END component state

  // ~SECTION hook function
    // async function greet() {
    //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    //   setGreetMsg(await invoke("greet", { name }));
    // }
  // ANCHOR_END hook function

  // SECTION side effect
  useEffect(() => {
    getTodos().then(res => {
      setTodos(res);
    })
  }, []);
  // ~SECTION side effect

  return (
    <div className="todoapp">
      <TodoList todos={filtedTodos}/>
    </div>
  )
}

export default App;
