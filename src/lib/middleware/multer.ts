import multer from "multer";
import { randomUUID } from "crypto";
import mime from "mime";

export const generatePhotoFilename = (mimeType: string) => {
    const randomFilename = `${randomUUID()}-${Date.now}`;
    const fileExtension = mime.getExtension(mimeType);
    const filename = `${randomFilename}.${fileExtension}`;

    return filename;
};

const storage = multer.diskStorage({
    destination: "uplodas/",
    filename: (request, file, callback) => {
        return callback(null, generatePhotoFilename(file.mimetype));
    },
});

const MAX_SIZE_IN_GIGABYTE = 6 * 1024 * 1024;
const VALID_MIME_TYPES = ["image/png", "image/jpeg"];

const fileFilter: multer.Options["fileFilter"] = (request, file, callback) => {
    if (VALID_MIME_TYPES.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("Error: the upload file must be a jpg or png"));
    }
};

export const multerOptions = {
    fileFilter,
    limits: {
        fileSize: MAX_SIZE_IN_GIGABYTE,
    },
};

export const initMulterMiddleware = () => {
    return multer({ storage, ...multerOptions });
};
