import { useEffect, useRef, useState } from 'react';
import {UploadFile} from "./service/api";
import { getAllFiles, deleteFile } from "./service/fileService";
import FileHistory from './components/FileHistory';
import SharePanel from './components/SharePanel';
import './App.css'

function App() {

  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const uploadRef = useRef();
  const handleUpload = () => {
    uploadRef.current.click();
  }
  
  // Cargar archivos desde la base de datos al iniciar la aplicación
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoadingFiles(true);
        const files = await getAllFiles();
        // Convertir los datos del servidor al formato que espera la aplicación
        const formattedFiles = files.map(file => ({
          id: file.id,
          name: file.name,
          size: 0, // El tamaño no está disponible desde el servidor
          date: new Date(), // La fecha no está disponible desde el servidor
          link: file.link
        }));
        setUploadedFiles(formattedFiles);
      } catch (error) {
        console.error('Error al cargar archivos:', error);
      } finally {
        setLoadingFiles(false);
      }
    };
    
    fetchFiles();
  }, []);
  
  //apiCall with data
 useEffect(() => {
  const apiCall = async () => {

   if(file){
     //call the api to upload
     setLoading(true);
     setRes(null);
     setUploadProgress(0);
     
     const fileData = new FormData();
     fileData.append("name", file.name);
     fileData.append("file", file);
 
     //call function from api.js with fileData
     try {
       const response = await UploadFile(fileData, (progress) => {
         setUploadProgress(progress);
       });
       setRes(response.path);
       
       // Añadir archivo al historial
       const newFileEntry = {
         id: response.fileInfo.id, // Guardar el ID del archivo
         name: file.name,
         size: file.size,
         date: new Date(),
         link: response.path
       };
       
       setUploadedFiles(prevFiles => {
         // Mantener solo los últimos 10 archivos
         const updatedFiles = [newFileEntry, ...prevFiles];
         return updatedFiles.slice(0, 10);
       });
       
       // Mantener el 100% por un momento antes de mostrar el éxito
       setTimeout(() => {
         setLoading(false);
       }, 500);
     } catch (error) {
       console.error("Error en la carga:", error);
       setLoading(false);
     }
   }
  }
  
  apiCall();
 },[file]);

  const copyToClipboard = (link) => {
    // Si no se proporciona un link específico, usar res (el enlace actual)
    const linkToUse = link || res;
    
    if (linkToUse) {
      // Asegurarse de que link sea un string y obtener la URL completa
      let linkText = '';
      
      if (typeof linkToUse === 'object') {
        // Si es un objeto, intentar obtener la propiedad link o path
        linkText = linkToUse.link || linkToUse.path || JSON.stringify(linkToUse);
      } else {
        // Si ya es un string, usarlo directamente
        linkText = linkToUse;
      }
      
      // Asegurarse de que sea una URL completa
      if (linkText && !linkText.startsWith('http')) {
        // Si no es una URL completa, convertirla en una URL absoluta
        const baseUrl = window.location.origin;
        linkText = new URL(linkText, baseUrl).toString();
      }
      
      // Copiar el texto al portapapeles
      navigator.clipboard.writeText(linkText)
        .then(() => {
          console.log('Enlace copiado con éxito:', linkText);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => {
          console.error('Error al copiar: ', err);
        });
    } else {
      console.error('No hay enlace para copiar');
    }
  };
  
  const removeFileFromHistory = async (index) => {
    try {
      const fileToRemove = uploadedFiles[index];
      
      // Extraer el ID del archivo de la URL
      const fileId = fileToRemove.id || fileToRemove.link.split('/').pop();
      
      // Eliminar el archivo de la base de datos
      await deleteFile(fileId);
      
      // Actualizar el estado local
      setUploadedFiles(prevFiles => {
        const updatedFiles = [...prevFiles];
        updatedFiles.splice(index, 1);
        return updatedFiles;
      });
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      alert('No se pudo eliminar el archivo. Inténtalo de nuevo.');
    }
  };

  return (
    <>
      <header className="header">
        <h1>FileLance</h1>
      </header>
      
      <div className='container'>
        <div className="upload-container">
          <button onClick={() => {handleUpload()}} className="upload-button">Subir Archivo</button>
          <input type="file" ref={uploadRef} style={{display:"none"}} onChange={(event)=>setFile(event.target.files[0])}/>
          {loading && (
            <div className="progress-container">
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{width: `${uploadProgress}%`}}
                >
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              </div>
              <div className="loading-indicator">Cargando archivo...</div>
            </div>
          )}
        </div>
        {res && (
          <div className="link-container">
            <div className="success-indicator">¡Archivo cargado con éxito!</div>
            <a href={res}>{res}</a>
            <button 
              className={`copy-button ${copySuccess ? 'pulse' : ''}`} 
              onClick={() => copyToClipboard(res)}
            >
              {copySuccess ? '¡Enlace copiado!' : 'Copiar enlace'}
            </button>
          </div>
        )}
        
        <FileHistory 
          uploadedFiles={uploadedFiles} 
          onCopyLink={copyToClipboard} 
          onRemoveFile={removeFileFromHistory}
          loading={loadingFiles}
        />
      </div>
      
      {/* Panel lateral para compartir */}
      <SharePanel fileLink={res} isVisible={!!res} />
      
      <footer className="footer">
        <p>© 2025 FileLance - Transferencia de archivos simple y rápida</p>
        <a href="https://github.com/jemmdevs" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          Desarrollado por jemmdevs
        </a>
      </footer>
    </>
  )
}

export default App
