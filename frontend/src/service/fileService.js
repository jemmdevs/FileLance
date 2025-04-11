// Servicio para manejar las operaciones relacionadas con archivos

// Obtener todos los archivos del servidor
export const getAllFiles = async () => {
    try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/files`);
        if (!response.ok) {
            throw new Error(`Error al obtener archivos: ${response.status}`);
        }
        const data = await response.json();
        return data.files;
    } catch (error) {
        console.error('Error al obtener archivos:', error);
        throw error;
    }
};

// Eliminar un archivo específico
export const deleteFile = async (fileId) => {
    try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/files/${fileId}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`Error al eliminar archivo: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        throw error;
    }
};