import { tauri } from "@tauri-apps/api";
import { Todo } from "../types/todo";
import { useAtom } from "jotai";
import { anyTodosDone, todosAtom } from "../store/todo";
import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { updateTodo } from "../services/cmds";

const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {

    // SECTION store
    const [anyDone] = useAtom(anyTodosDone);
    const [, setTodos] = useAtom(todosAtom);
    // ~SECTION store

    // SECTION component state
    const [completed, setCompleted] = useState(todo.done);
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(todo.label);
    // ~SECTION component state

    // SECTION dom reference
    const inputRef = useRef<HTMLInputElement>(null);
    // ~SECTION dom reference

    // SECTION hook function
    // begin to edit label.
    const onEditLabel:MouseEventHandler<HTMLLabelElement> = (e) => {
        e.preventDefault();
        setEditing(() => true);
    }

    // edit complete. sync text with todo.label, quit edit mode
    const onQuitEditLabel = () => {
        setEditing(() => false);
        todo.label = text;
        updateTodo(todo);
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
    // ~SECTION hook function

    // SECTION side effect
    useEffect(() => {
        // trying to focus input when rendering.
        if(editing) inputRef.current?.focus();

        // sync update with todo.done
        setCompleted(todo.done);
    });
    // ~SECTION side effect


    // SECTION debug
    // console.log("todo has done?", todo.done);
    // console.log("completed is: ", completed);
    // ~SECTION
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
                        updateTodo(todo);
                        setCompleted(() => todo.done);
                        setTodos(oldTodos => [...oldTodos]);
                    }}
                />
                <label onDoubleClick={onEditLabel}>{text}</label>
                <button className="destroy" onClick={e => {
                    e.preventDefault();
                    updateTodo({
                      ...todo,
                      is_delete: true,
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