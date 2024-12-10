"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// Definindo os tipos para o estado de `file` e `filename`
const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null); // file pode ser um arquivo ou null
  const [filename, setFilename] = useState<string>(''); // filename será uma string

  // Tipagem para o evento de alteração de arquivo
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFilename(event.target.files[0].name);
    }
  };

  const getImageUrl = (publicId: string) => {
    return `https://res.cloudinary.com/dxunnhglr/image/upload/${publicId}`;
  };

  // Tipagem para o evento de envio do formulário
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sla-api');
    formData.append('public_id', 'wallace');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dxunnhglr/image/upload',
        formData
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" onChange={handleFileChange} />
          <label>{filename}</label>
        </div>
        <button type="submit">Upload</button>
      </form>
  
      {/* Renderizando condicionalmente a imagem */}
      {getImageUrl("wallace") && (
        <img src={getImageUrl("wallace")} alt="Imagem do Doguinho" />
      )}
    </div>
  );
}
export default UploadForm;
