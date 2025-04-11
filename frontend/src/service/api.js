export const UploadFile = (fileData, onProgress) => {
    return new Promise((resolve, reject) => {
        try {

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const xhr = new XMLHttpRequest();
            
            // Configurar evento de progreso
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onProgress) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    onProgress(percentComplete);
                }
            });
            
            // Configurar evento de carga completada
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } else {
                    reject(new Error(`Error en la carga: ${xhr.status} ${xhr.statusText}`));
                }
            });
            
            // Configurar evento de error
            xhr.addEventListener('error', () => {
                reject(new Error('Error de red durante la carga'));
            });
            
            // Configurar evento de aborto
            xhr.addEventListener('abort', () => {
                reject(new Error('Carga abortada'));
            });
            
            // Iniciar la solicitud
            xhr.open('POST', `${backendUrl}/upload`);
            xhr.send(fileData);
        } catch (error) {
            console.log("Error while uploading file", error.message);
            reject(error);
        }
    });
}