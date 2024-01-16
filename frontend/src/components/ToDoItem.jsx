import './ToDoItem.css'

const ToDoItem = ({ todo, onToggleTodo, onDeleteTodo }) => {
    return (
        <article className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleTodo(todo.id)}
            />
            <span onClick={() => onToggleTodo(todo.id)} className={`${todo.completed ? 'completed' : ''}`}>
                {todo.text}
            </span>
            <button onClick={() => onDeleteTodo(todo.id)}>Löschen</button>
        </article>
    );
};


export default ToDoItem;

