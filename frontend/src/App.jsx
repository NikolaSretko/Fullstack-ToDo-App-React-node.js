import { useState,useEffect } from 'react';
import './App.css';
import ToDoList from './components/TodoList';
import AddToDo from './components/AddToDo';


function App() {
  // State für die Verwaltung der Todo-Liste
  const [todos, setTodos] = useState([]);

  // Funktion, um ein neues Todo hinzuzufügen
  const addTodo = (todoText) => {
    const newTodo = { text: todoText, completed: false };

    // Sendet das neue Todo an den Backend-Server
    fetch('http://localhost:3001/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    })
    .then(response => {
      if (response.ok) {
        return response.json(); // Verarbeitet die Antwort vom Server
      }
      throw new Error('Netzwerkantwort war nicht ok.');
    })
    .then(data => {
      // Fügt das neue Todo zum State hinzu
      setTodos([...todos, data]); 
    })
    .catch(error => console.error('Error:', error));
  };

  // Funktion, um den Status eines Todo zu ändern
  const toggleTodo = (id) => {
    const todoToUpdate = todos.find(t => t.id === id);
    if (!todoToUpdate) return;

    // Sendet die Aktualisierung an den Server
    fetch(`http://localhost:3001/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !todoToUpdate.completed }),
    })
    .then(response => {
      if (response.ok) {
        return response.json(); // Erhält das aktualisierte Todo vom Server
      }
      throw new Error('Netzwerkantwort war nicht ok.');
    })
    .then(data => {
      // Aktualisiert das Todo im State
      setTodos(todos.map(item =>
        item.id === id ? { ...item, ...data } : item
      ));
    })
    .catch(error => console.error('Error:', error));
  };

  // Funktion, um ein Todo zu löschen
  const onDeleteTodo = (id) => {
    // Sendet die Löschungsanfrage an den Server
    fetch(`http://localhost:3001/todos/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        // Entfernt das Todo aus dem State
        return setTodos(todos.filter(item => item.id !== id));
      }
      throw new Error('Netzwerkantwort war nicht ok.');
    })
    .catch(error => console.error('Error:', error));
  };

  // useEffect Hook, um die Todos beim Laden der Komponente vom Server zu holen
  useEffect(() => {
    fetch('http://localhost:3001/todos')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Netzwerkantwort war nicht ok.');
      })
      .then(data => setTodos(data))
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  // Berechnet die Anzahl der unvollständigen Todos
  const countIncomplete = todos.filter(todo => !todo.completed).length;

  return (
    <div className='app-container'>
      <h1>To Do-Liste</h1>
      <div>Anzahl offener To-dos: {countIncomplete}</div>
      <AddToDo onAddTodo={addTodo} />
      <ToDoList todos={todos} onToggleTodo={toggleTodo} onDeleteTodo={onDeleteTodo} />
    </div>
  );
}

export default App;