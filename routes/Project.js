import express from "express";
import {
    deleteDocument,
    deleteGalleryFile,
    deleteProjectById,
    getAmenities,
    getBasicInfo,
    getDocuments,
    getGallery,
    getProjectById,
    getPropertyInfo,
    initiateProject,
    saveAmenities,
    saveBasicInfo,
    saveDocuments,
    saveGallery,
    savePropertyInfo
} from "../controllers/project.js";
import upload from "../utility/multer.js";
import multer from "multer";

const router = express.Router();

router.post("/new", initiateProject);

router.patch('/:id/basic-info', saveBasicInfo);
router.patch('/:id/property-info', savePropertyInfo);
router.patch('/:id/amenities', saveAmenities);

router.patch('/:id/gallery', (req, res, next) => {
    upload.fields([
        { name: 'siteElevations', maxCount: 10 },
        { name: 'siteImages', maxCount: 10 },
        { name: 'siteBrochore', maxCount: 10 }
    ])(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.json({ success: false, status: "The file size shouldn't be more than 6MB" });
        } else if (err) {
            return res.json({ success: false, status: "File upload validation failed." });
        }
        next();
    });
}, saveGallery);


router.patch('/:id/documents', (req, res, next) => {
    upload.array('documents', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.json({ success: false, status: "The file size shouldn't be more than 6MB" });
        } else if (err) {
            return res.json({ success: false, status: "File upload validation failed." });
        }
        next();
    })
}, saveDocuments);



router.get('/:id/basic-info', getBasicInfo)
router.get('/:id/property-info', getPropertyInfo)
router.get('/:id/amenities', getAmenities)
router.get('/:id/gallery', getGallery)
router.get('/:id/documents', getDocuments);

router.delete('/:id/gallery/:type/:filename', deleteGalleryFile)
router.get('/:id', getProjectById);
router.delete('/:id', deleteProjectById);


router.delete('/:id/documents/:filename', deleteDocument);

export default router;
