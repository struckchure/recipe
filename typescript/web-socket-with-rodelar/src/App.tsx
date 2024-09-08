import { useState } from "react";
import "./App.css";

import { useSubscribe } from "rodelar/react";

function App() {
  const [message, setMessage] = useState<unknown>();

  useSubscribe(
    { url: "ws://localhost:3000/ws/" },
    {
      queue: "test",
      callback(data) {
        console.log("first :", data);
        setMessage(data.message);
      },
    }
  );

  return <h1>Vite + React {JSON.stringify(message)}</h1>;
}

export default App;
