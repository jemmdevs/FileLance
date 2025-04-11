import fileModel from "../model/fileModel.js";

export const getAllFiles = async (req, res) => {
    try {
        const files = await fileModel.find();
        return res.status(200).json({
            files: files.map(file => ({
                id: file._id,
                name: file.name,
                path: file.path,
                link: `${process.env.BACKEND_URL}/files/${file._id}`
            }))
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};

export const deleteFile = async (req, res) => {
    try {
        const file = await fileModel.findByIdAndDelete(req.params.fileId);
        if (!file) {
            return res.status(404).json({message: "Archivo no encontrado"});
        }
        return res.status(200).json({message: "Archivo eliminado correctamente"});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};