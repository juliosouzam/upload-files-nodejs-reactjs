import React, { useState } from "react";
import { uniqueId } from "lodash";
import filesize from "filesize";

import GlobalStyle from "./styles/global";
import { Container, Content } from "./styles";
import Upload from "./components/Upload";
import FileList from "./components/FileList";
import api from "./services/api";

export default function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

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

    const newValue = [...uploadedFiles, ...upFiles];

    setUploadedFiles(newValue);
    console.log(uploadedFiles);
    uploadedFiles.forEach(processUpload);
  }

  function processUpload(uploadedFile) {
    const data = new FormData();
    data.append("file", uploadedFile.file, uploadedFile.name);

    api.post("posts", data, {
      onUploadProgress: e => {
        const progress = parseInt(Math.round((e.loaded * 100) / e.total));

        updateFile(uploadedFile.id, {
          progress
        });
      }
    });
  }

  function updateFile(id, data) {
    console.log(uploadedFiles);
    setUploadedFiles(
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
        {!!uploadedFiles && <FileList files={uploadedFiles} />}
      </Content>
      <GlobalStyle />
    </Container>
  );
}
