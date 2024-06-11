import multer from "multer";
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const uniqueFileName = uuidv4();
        cb(null, uniqueFileName + fileExtension)
    }
})


const upload = multer({
    storage: storage,
    limits: { fileSize: 6 * 1024 * 1024 }, // 6MB limit
})

export default upload;
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type'), false);
//     }
// };