import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        // Preserve original filename and add timestamp for uniqueness
        const timestamp = Date.now();
        const originalName = file.originalname.replace(/\s+/g, '_'); // Replace spaces with underscores
        const safeFileName = `${timestamp}-${originalName}`;
        cb(null, safeFileName);
    }
});

// File filter to accept multiple file formats
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/jpg'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

export { upload };