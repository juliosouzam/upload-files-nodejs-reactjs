import React, { useState } from "react";
import "./Login.css";

import api from "./../../services/api";

export default function Login({ history }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post("/login", {
      username,
      password
    });

    const { hash } = response.data;
    localStorage.setItem("hash", hash);

    history.push(`/directories`);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Digite o usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Digite o senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
