import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Directory.css";

import { Container, Content, ListDir } from "./styles";
import api from "./../../services/api";
import { isAuthenticated } from "./../../services/auth";

export default function Directories({ history }) {
  const [directories, setDirectories] = useState([]);
  const [directory, setDirectory] = useState("");

  async function loadDirectories() {
    const response = await api.get("directories");

    setDirectories(response.data.dirs);
  }

  useEffect(() => {
    loadDirectories();
  }, []);

  async function handleStoreDirectory(e) {
    e.preventDefault();
    await api.post(`directories`, { directory });

    setDirectories([...directories, directory]);
  }

  return (
    <Container>
      <Content>
        {isAuthenticated() && (
          <form onSubmit={handleStoreDirectory}>
            <input
              placeholder="Digite o diretório"
              value={directory}
              onChange={e => setDirectory(e.target.value)}
            />
            <button type="submit">Criar</button>
          </form>
        )}
        <ul>
          {directories.map(dir => (
            <ListDir key={dir}>
              <Link
                style={{ textDecoration: "none", fontSize: 18 }}
                to={`/directories/${dir}`}
              >
                {dir}
              </Link>
            </ListDir>
          ))}
        </ul>
      </Content>
    </Container>
  );
}
