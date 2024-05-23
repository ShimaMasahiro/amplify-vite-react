import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import React, { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
      error: (err) => console.error("Error observing todos:", err),
    });

    return () => subscription.unsubscribe();
  }, []);

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((err) => console.error("Error deleting todo:", err));
  }

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content })
        .then((response) => {
          const newTodo = response as unknown as Schema["Todo"]["type"];
          setTodos((prevTodos) => [...prevTodos, newTodo]);
        })
        .catch((err) => console.error("Error creating todo:", err));
    }
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <main>
          <button onClick={signOut}>Sign out</button>
          <h1>My todos</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li onClick={() => deleteTodo(todo.id)} key={todo.id}>
                {todo.content}
              </li>
            ))}
          </ul>
          <div>項目名をクリックするとその項目が削除されます</div>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
