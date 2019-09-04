import React, { useState, useEffect } from "react";
import { uniqueId } from "lodash";
import filesize from "filesize";
import { Link } from 'react-router-dom';

import { Container, Content, Navbar } from "./styles";
import Upload from "./../../components/Upload";
import FileList from "./../../components/FileList";
import api from "./../../services/api";

export default function Main({ match }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    async function loadFiles() {
      const response = await api.get(
        `directories/${match.params.directory}/files`
      );

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

    loadFiles();
  }, [match.params.directory]);

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

    console.log(upFiles);

    setUploadedFiles(prevFiles => [...prevFiles, ...upFiles]);
    upFiles.forEach(processUpload);
  }

  async function handleDelete(id) {
    await api.delete(`files/${id}`);

    setUploadedFiles(prevFiles => prevFiles.filter(file => file.id !== id));
  }

  function processUpload(uploadedFile) {
    const data = new FormData();
    data.append("directory", match.params.directory);
    data.append("file", uploadedFile.file, uploadedFile.name);

    api
      .post("directories/files", data, {
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
      <Navbar />
      <Content>
      <Link
          style={{ textDecoration: "none", fontSize: 16, color: '#757373' }}
          to={`/directories`}
        >
          Voltar
        </Link>
        <Upload onUpload={handleUpload} />
        {!!uploadedFiles && (
          <FileList files={uploadedFiles} onDelete={handleDelete} />
        )}
      </Content>
    </Container>
  );
}
