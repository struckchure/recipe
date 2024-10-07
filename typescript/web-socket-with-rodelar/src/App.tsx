import "./App.css";

import { RodelarClient } from "rodelar/core";

function App() {
  const client = new RodelarClient({ url: "ws://localhost:3000/ws" });

  client.subscribe({
    event: "TEST",
    callback(data) {
      console.log("TEST: ", data);
    },
  });

  return <h1>Vite + React</h1>;
}

export default App;
