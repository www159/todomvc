import TodoItem from "./TodoItem";
import { Todo } from "../types/todo";
import { v4 as randomUUID } from "uuid"
import { useCallback, KeyboardEventHandler, useState } from "react";
import { todosAtom, anyTodosDone, filterType, numLeftAtom } from "../store/todo";
import { invoke } from "@tauri-apps/api";
import { useAtom } from "jotai";

const TodoList: React.FC<{ todos: Todo[] }> = ({ todos }) => {
    const [, setTodos] = useAtom(todosAtom);
    const [type, setType] = useAtom(filterType);
    const [anyDone,] = useAtom(anyTodosDone);
    const [numLeft,] = useAtom(numLeftAtom);
    
    const [newTodoLabel, setNewTodoLabel] = useState('');
    
    const addTodo = async (label: string, id: string) => {
        invoke('new_todo', {
            todo: {
                id, label,
                done: false,
                is_delete: false,
            } as Todo
        })
    }

    const onAddTodo = useCallback<KeyboardEventHandler<HTMLInputElement>>(
        e => {
            if(e.key === "Enter") {
                e.preventDefault();
                if(newTodoLabel) {
                    const id = randomUUID();
                    addTodo(newTodoLabel, id);
                    setTodos(oldtodos => 
                        [...oldtodos, 
                            {
                                label: newTodoLabel, 
                                id, 
                                done: false, 
                                is_delete: false
                            } as Todo
                        ]);
                    setNewTodoLabel("");
                }
            }
        },
        [newTodoLabel]
    )
    const onClearComplete = () => {
        setTodos(oldtodos => {
            return oldtodos.filter(todo => {
                const isDone = todo.done;
                if(isDone) {
                    invoke("update_todo", {
                        todo: {...todo, is_delete: true}
                    });
                    return false;
                }
                return true;
            })
        })
    }
    return (
        <>
            <header className="header">
                <h1>todos</h1>
                <input 
                    type="text" 
                    className="new-todo"
                    placeholder="What needs to be done?"
                    value={newTodoLabel}
                    onChange={e => setNewTodoLabel(e.target.value)}
                    onKeyDown={onAddTodo}
                    autoFocus
                />
            </header>
            <section className="main">
                <input type="checkbox" className="toggle-all"/>
                <label htmlFor="toggle-all"></label>
                <ul className="todo-list">
                    {todos.map(todo => (
                        <TodoItem key={todo.id} todo={todo} />
                    ))}
                </ul>
            </section>
            <footer className="footer">
                <span className="todo-count">
                    <strong>{numLeft}</strong> item left
                </span>
                <ul className="filters">
                    <li>
                        <a onClick={() => setType("all")}>All</a>
                    </li>
                    <li>
                        <a onClick={()=> setType("active")}>Active</a>
                    </li>
                    <li>
                        <a onClick={() => setType("completed")}>Completed</a>
                    </li>
                </ul>
                { anyDone && (
                    <button className="clear-completed" onClick={onClearComplete}>
                        Clear completed
                    </button>
                )}
            </footer>
        </>
    )
}

export default TodoList