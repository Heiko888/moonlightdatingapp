"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
// Upload-Verzeichnis erstellen
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Multer-Konfiguration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Eindeutigen Dateinamen erstellen
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
// Datei-Filter
const fileFilter = (req, file, cb) => {
    // Erlaubte Dateitypen
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Nicht unterstützter Dateityp'), false);
    }
};
// Multer-Instanz erstellen
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
        files: 10 // Maximal 10 Dateien gleichzeitig
    }
});
// POST /admin/upload - Dateien hochladen
router.post('/upload', upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Keine Dateien hochgeladen'
            });
        }
        const uploadedFiles = req.files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype,
            path: `/uploads/${file.filename}`
        }));
        console.log(`[ADMIN-UPLOAD] ${uploadedFiles.length} Dateien hochgeladen`);
        res.json({
            success: true,
            message: `${uploadedFiles.length} Dateien erfolgreich hochgeladen`,
            files: uploadedFiles.map(f => f.filename)
        });
    }
    catch (error) {
        console.error('[ADMIN-UPLOAD] Fehler:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Hochladen der Dateien'
        });
    }
});
// GET /admin/upload - Hochgeladene Dateien auflisten
router.get('/upload', (req, res) => {
    try {
        const files = fs_1.default.readdirSync(uploadDir);
        const fileList = files.map(filename => {
            const filePath = path_1.default.join(uploadDir, filename);
            const stats = fs_1.default.statSync(filePath);
            return {
                filename,
                size: stats.size,
                uploadDate: stats.mtime,
                path: `/uploads/${filename}`
            };
        });
        res.json({
            success: true,
            files: fileList
        });
    }
    catch (error) {
        console.error('[ADMIN-UPLOAD] Fehler beim Auflisten:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Auflisten der Dateien'
        });
    }
});
// DELETE /admin/upload/:filename - Datei löschen
router.delete('/upload/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path_1.default.join(uploadDir, filename);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            console.log(`[ADMIN-UPLOAD] Datei gelöscht: ${filename}`);
            res.json({
                success: true,
                message: 'Datei erfolgreich gelöscht'
            });
        }
        else {
            res.status(404).json({
                success: false,
                error: 'Datei nicht gefunden'
            });
        }
    }
    catch (error) {
        console.error('[ADMIN-UPLOAD] Fehler beim Löschen:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Löschen der Datei'
        });
    }
});
// Statische Dateien bereitstellen
router.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
exports.default = router;
