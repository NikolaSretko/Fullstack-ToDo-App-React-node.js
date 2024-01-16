const express = require('express')
const fs = require('fs');
const cors = require('cors');


const app = express();
const OK = 200;
const INTENAL_SERVER_ERROR = 500;
const CREATED = 201;
const NO_CONTENT = 204;

app.use(cors()); // Aktiviert CORS für alle Anfragen, um Cross-Origin-Probleme zu verhindern.

app.use(express.json()); // Erlaubt dem Server, JSON-Anfragen zu verarbeiten.

const DATA_FILE = (__dirname, 'todos.json'); // Definiert den Pfad zur JSON-Datei mit den To-dos.

// Route, um alle To-dos zu holen.
app.get('/todos', (_, res) => {
    fs.promises.readFile(DATA_FILE)
        .then(dataBuffer => {
            const todos = JSON.parse(dataBuffer);

            res.status(OK).json({ success: true, result: todos })
        })
        .catch(err => {
            console.error(err);
            res.status(INTENAL_SERVER_ERROR).send("Ein Interner Server Fehler ist aufgetreten");
        });
});

// Route,um ein To-do zu erstellen
app.post('/todos', (req, res) => {
    // Lesen der aktuellen Todos aus der Datei
    fs.promises.readFile(DATA_FILE)
        .then(data => {
            // Wenn Daten vorhanden sind, parsen wir sie zu einem Array, 
            // sonst verwenden wir ein leeres Array
            const todos = data.length > 0 ? JSON.parse(data) : [];

            // Erstellen eines neuen Todo-Objekts mit den Daten aus req.body und einer einzigartigen ID
            const newTodo = { ...req.body, id: Date.now() };

            // Hinzufügen des neuen Todo-Objekts zum Array der existierenden Todos
            const updatedTodos = [...todos, newTodo];

            // Schreiben des aktualisierten Todo-Arrays in die Datei
            // Wir geben das neue Todo-Objekt zurück, um es in der nächsten .then()-Kette zu verwenden
            return fs.promises.writeFile(DATA_FILE, JSON.stringify(updatedTodos, null, 2))
                .then(() => newTodo);
        })
        .then(newTodo => {
            // Senden des neu erstellten Todo-Objekts als Antwort an den Client
            res.status(CREATED).json({ succes: true, result: newTodo });
        })
        .catch(err => {
            // Fehlerbehandlung für den Fall, dass beim Lesen oder Schreiben ein Fehler auftritt
            console.error(err);
            res.status(INTENAL_SERVER_ERROR).send('Ein interner Serverfehler ist aufgetreten.');
        });
});



// Route, um ein To-do zu aktualisieren.
app.patch('/todos/:id', (req, res) => {
    const todoId = Number(req.params.id);

    fs.promises.readFile(DATA_FILE)
        .then(data => {
            const todos = JSON.parse(data);
            let updatedTodo;

            // Aktualisieren des spezifischen Todo-Elements
            const updatedTodos = todos.map(todo => {
                if (todo.id === todoId) {
                    updatedTodo = { ...todo, ...req.body };
                    return updatedTodo;
                } else {
                    return todo;
                }
            });

            // Schreiben der aktualisierten Todos zurück in die Datei
            return fs.promises.writeFile(DATA_FILE, JSON.stringify(updatedTodos, null, 2))
                .then(() => updatedTodo); // Rückgabe des aktualisierten Todos
        })
        .then(updatedTodo => {
            // Senden des aktualisierten Todo-Objekts als Antwort an den Client
            res.status(OK).json({ success: true, result: updatedTodo });
        })
        .catch(err => {
            console.error(err);
            res.status(INTENAL_SERVER_ERROR).send('Ein interner Serverfehler ist aufgetreten.');
        });
});



// Route, um ein To-do zu löschen.
app.delete('/todos/:id', (req, res) => {
    // Löscht ein To-do basierend auf seiner ID.
    const todoId = Number(req.params.id);
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) throw err;
        const todos = JSON.parse(data);
        const filteredTodos = todos.filter(todo => todo.id !== todoId); // Filtert das zu löschende To-do aus.
        fs.writeFile(DATA_FILE, JSON.stringify(filteredTodos, null, 2), (err) => {
            if (err) throw err;
            res.status(NO_CONTENT).end(); // Sendet eine Antwort ohne Inhalt, um den Erfolg zu signalisieren.
        });
    });
});

// endpoint not found handler
app.use((_, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Startet den Server und hört auf dem angegebenen Port.
});