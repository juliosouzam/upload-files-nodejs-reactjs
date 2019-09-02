import React, { useState, useEffect } from "react";
import { uniqueId } from "lodash";
import filesize from "filesize";

import GlobalStyle from "./styles/global";
import { Container, Content } from "./styles";
import Upload from "./components/Upload";
import FileList from "./components/FileList";
import api from "./services/api";

export default function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  async function loadPosts() {
    const response = await api.get("posts");

    setUploadedFiles(
      response.data.map(file => ({
        id: file._id,
        name: file.name,
        readableSize: filesize(file.size),
        preview: file.url,
        uploaded: true,
        url: file.url
      }))
    );
  }

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    return () =>
      uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }, [uploadedFiles]);

  function handleUpload(files) {
    const upFiles = files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null
    }));

    setUploadedFiles(prevFiles => [...prevFiles, ...upFiles]);
    upFiles.forEach(processUpload);
  }

  async function handleDelete(id) {
    await api.delete(`posts/${id}`);

    setUploadedFiles(prevFiles => prevFiles.filter(file => file.id !== id));
  }

  function processUpload(uploadedFile) {
    const data = new FormData();
    data.append("file", uploadedFile.file, uploadedFile.name);

    api
      .post("posts", data, {
        onUploadProgress: e => {
          const progress = parseInt(Math.round((e.loaded * 100) / e.total));

          updateFile(uploadedFile.id, {
            progress
          });
        }
      })
      .then(response => {
        updateFile(uploadedFile.id, {
          uploaded: true,
          id: response.data._id,
          url: response.data.url
        });
      })
      .catch(() => {
        updateFile(uploadedFile.id, {
          error: true
        });
      });
  }

  function updateFile(id, data) {
    setUploadedFiles(uploadedFiles =>
      uploadedFiles.map(uploadedFile => {
        return id === uploadedFile.id
          ? { ...uploadedFile, ...data }
          : uploadedFile;
      })
    );
  }

  return (
    <Container>
      <Content>
        <Upload onUpload={handleUpload} />
        {!!uploadedFiles && (
          <FileList files={uploadedFiles} onDelete={handleDelete} />
        )}
      </Content>
      <GlobalStyle />
    </Container>
  );
}
