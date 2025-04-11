
function FileHistory({ uploadedFiles, onCopyLink, onRemoveFile, loading }) {
  return (
    <div className="history-container">
      <div className="history-header">HISTORIAL DE ARCHIVOS</div>
      
      {loading ? (
        <div className="loading-message">Cargando archivos...</div>
      ) : uploadedFiles.length === 0 ? (
        <div className="no-files-message">No hay archivos en el historial</div>
      ) : (
        <ul className="file-list">
          {uploadedFiles.map((file, index) => (
            <li key={index} className="file-item">
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-details">
                  <span className="file-size">{formatFileSize(file.size)}</span>
                  <span className="file-date">{formatDate(file.date)}</span>
                </div>
                <a href={file.link} className="file-link" target="_blank" rel="noopener noreferrer">
                  {file.link}
                </a>
              </div>
              <div className="file-actions">
                <button 
                  className="copy-link-button" 
                  onClick={() => onCopyLink(file.link)}
                >
                  Copiar
                </button>
                <button 
                  className="remove-file-button" 
                  onClick={() => onRemoveFile(index)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Función para formatear el tamaño del archivo
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Función para formatear la fecha
function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default FileHistory;