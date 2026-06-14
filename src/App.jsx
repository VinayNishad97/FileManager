import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Route, Routes, HashRouter, Link, useNavigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./sidebar/sidebar";

function Greet() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  let navigate = useNavigate();

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  function redirect() {
    setTimeout(() => {
      navigate("/file-manager");
    }, 1000);
  }

  return (
    <main className="container">
      <h1>Welcome to File Manager</h1>

      <Link to="/file-manager">Go to File Manager</Link>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit" onClick={redirect}>
          Greet
        </button>
      </form>

      <p>{greetMsg}</p>
    </main>
  );
}

function App() {
  return (
    <HashRouter>
      
          <Routes>
            <Route path="/" element={<Greet />} />
            <Route path="/file-manager" element={<Sidebar />} />
          </Routes>
       
    </HashRouter>
  );
}

export default App;