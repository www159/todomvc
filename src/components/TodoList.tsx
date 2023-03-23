import TodoItem from "./TodoItem";
import { Todo } from "../types/todo";
import { v4 as randomUUID } from "uuid"
import { useCallback, KeyboardEventHandler, useState } from "react";
import { todosAtom, anyTodosDone, filterType, numLeftAtom, everyTodosDone } from "../store/todo";
import { useAtom } from "jotai";
import { newTodo, updateTodo } from "../services/cmds";

const TodoList: React.FC<{ todos: Todo[] }> = ({ todos }) => {
    // SECTION store
    const [, setTodos] = useAtom(todosAtom);
    const [, setType] = useAtom(filterType);
    const [anyDone,] = useAtom(anyTodosDone);
    const [everyDone, ] = useAtom(everyTodosDone);
    const [numLeft, ] = useAtom(numLeftAtom);
    // ~SECTION store

    // SECTION component state
    const [newTodoLabel, setNewTodoLabel] = useState('');
    // ~SECTION component state

    // SECTION hook function
    const addTodo = async (label: string, id: string) => {
        newTodo({
            id, label,
            done: false,
            is_delete: false,
        });
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
                    updateTodo({
                        ...todo,
                        is_delete: true,
                    });
                    return false;
                }
                return true;
            })
        })
    }

    const toggleAllTodo = () => {
        // NOTE
        // don't update whole todo items.
        setTodos(oldTodos => {
            const newTodos = oldTodos.map(oldTodo => {
                const newTodo = {
                    ...oldTodo,
                    done: everyDone ? false : true,
                };
                
                if(oldTodo.done !== newTodo.done) {
                    updateTodo(newTodo);
                }
                return newTodo;
            });

            return newTodos;
        });
    }
    // ~SECTION hook function

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
                <input 
                    type="checkbox" 
                    id="toggle-all"
                    className="toggle-all"
                    checked={everyDone}
                    onChange={() => toggleAllTodo()}
                    />
                <label htmlFor="toggle-all">toggle all todos' done</label>
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