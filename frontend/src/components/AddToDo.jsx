import { useState } from 'react';

const AddToDo = ({ onAddTodo }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event) => {
    event.preventDefault();
    onAddTodo(inputValue);
    setInputValue('');
    };

    return (
    <form onSubmit={handleSubmit} className='form-container'>
        <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Neues To-do hinzufügen"
        required
        />
        <button type="submit">Hinzufügen</button>
    </form>
    );
};

export default AddToDo;
