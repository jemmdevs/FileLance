import fileModel from "../model/fileModel.js";
import path from 'path';
import dotenv from 'dotenv';

export const UploadController = async (req, res) => {
    try{
        dotenv.config();
        const backendUrl = process.env.BACKEND_URL;
        //functionality to upload files to database
        const fileObject = {
            path: req.file.path,
            name: req.file.originalname,
        }
        const file = await fileModel.create(fileObject);
        console.log(file);
        
        // Enviar respuesta al cliente con los datos del archivo
        return res.status(200).json({
            path: `${backendUrl}/files/${file._id}`,
            fileInfo: {
                id: file._id,
                name: file.name,
                originalPath: file.path
            }
        });


    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const DownloadController = async (req, res) => {
    try{
        //functionality to download files from database
        const file = await fileModel.findById(req.params.fileId);
        if(!file){
            return res.status(404).json({message:"File not found"});
        }
        res.download(file.path, file.name);
        
    }catch(err){
        return res.status(500).json({message:err.message});
    }
    
}