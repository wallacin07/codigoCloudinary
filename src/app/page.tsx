"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [publicId, setPublicId] = useState<string>("mimir"); // Public ID inicial
  const [filename, setFilename] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();

  // Lida com mudanças no input de arquivo
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFilename(event.target.files[0].name);
    }
  };

  // Faz o upload da imagem para o Cloudinary
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "sla-api");
    formData.append("public_id", publicId);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxunnhglr/image/upload",
        formData
      );

      console.log(response.data);
      setImageUrl(response.data.secure_url); // Atualiza a URL da imagem
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  // Busca a URL da imagem com base no publicId
  const fetchImageUrl = async (publicId: string) => {
    try {
      const response = await axios.get(
        `https://res.cloudinary.com/dxunnhglr/image/upload/${publicId}`,
        { responseType: "arraybuffer" }
      );
      const base64 = Buffer.from(response.data, "binary").toString("base64");
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error("Falha ao buscar a URL da imagem. Detalhes:", error);
      return null;
    }
  };

  // Busca a imagem sempre que o publicId mudar
  useEffect(() => {
    const loadImage = async () => {
      const url = await fetchImageUrl(publicId);
      setImageUrl(url);
    };

    if (publicId) {
      loadImage();
    }
  }, [publicId]);

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit}>
        <div>
          {/* Input para alterar o Public ID */}
          <input
            type="text"
            value={publicId}
            onChange={(e) => setPublicId(e.target.value)}
            placeholder="Digite o Public ID"
            className="text-black"
          />
          {/* Input para selecionar o arquivo */}
          <input type="file" onChange={handleFileChange} />
          <label>{filename}</label>
        </div>
        <button type="submit" className="text-black">Upload</button>
      </form>

      {/* Renderizar a imagem condicionalmente */}
      {imageUrl ? (
        <img src={imageUrl} alt="Uploaded Example" />
      ) : (
        <p>Carregando imagem...</p>
      )}
    </div>
  );
};

export default UploadForm;
