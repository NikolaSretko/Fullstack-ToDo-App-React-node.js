
import ToDoItem from "./TodoItem";

const ToDoList = ({ todos, onToggleTodo, onDeleteTodo }) => {
    return (
        <section className="todo-list">
            {todos.map((todo) => (
                <ToDoItem key={todo.id} todo={todo} onToggleTodo={onToggleTodo} onDeleteTodo={onDeleteTodo}
                />
            ))}
        </section>
    );
};

export default ToDoList;
