import { tauri } from "@tauri-apps/api";
import { Todo } from "../types/todo";
import { useAtom } from "jotai";
import { anyTodosDone, todosAtom } from "../store/todo";
import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {

    const [completed, setCompleted] = useState(todo.done);
    const [anyDone] = useAtom(anyTodosDone);
    const [, setTodos] = useAtom(todosAtom);

    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(todo.label);

    const inputRef = useRef<HTMLInputElement>(null);

    // begin to edit label.
    const onEditLabel:MouseEventHandler<HTMLLabelElement> = (e) => {
        e.preventDefault();
        setEditing(() => true);
    }

    // edit complete. sync text with todo.label, quit edit mode
    const onQuitEditLabel = () => {
        setEditing(() => false);
        todo.label = text;
        invoke("update_todo", { todo });
    }

    // edit cancelled, quit edit mode.
    const cancelEditLabel = () => {
        setEditing(() => false);
        setText(() => todo.label);
    }
    
    // double binding.
    const onTextChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const val = e.target.value;
        setText(() => val);
    }

    // escape key cancels editing, enter key save the text. 
    const onEscapeOrEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if(e.key === "Enter") {
            onQuitEditLabel();
        }
        else if (e.key === "Escape") {
            cancelEditLabel();
        }
    }

    useEffect(() => {
        if(editing) inputRef.current?.focus();
    })

    return (
        <li 
            className={`${editing ? "editing" : ""} ${completed ? "completed" : ""}`}
        >
            <div className="view">
                <input 
                    type="checkbox" 
                    className="toggle" 
                    checked={completed}  
                    onChange={() => {
                        console.log(anyDone, "any done");
                        todo.done = !todo.done;
                        invoke("update_todo", { todo });
                        setCompleted(() => todo.done);
                        setTodos(oldTodos => [...oldTodos]);
                    }}
                />
                <label onDoubleClick={onEditLabel}>{text}</label>
                <button className="destroy" onClick={e => {
                    e.preventDefault();
                    invoke("update_todo", {
                        todo: {
                            ...todo,
                            is_delete: true,
                        } as Todo
                    })
                    setTodos(oldTodos => oldTodos.filter(oldTodo => oldTodo.id !== todo.id));
                }}/>
            </div>
            <input 
                type="text"
                className="edit"
                ref={inputRef}
                value={text}
                onBlur={onQuitEditLabel}
                onFocus={() => console.log("input focused")}
                onChange={onTextChange}
                onKeyDown={onEscapeOrEnter}
            />
        </li>
    )
}

export default TodoItem;