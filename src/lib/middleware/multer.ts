import multer from "multer";

const storage = multer.diskStorage({
    destination: "uplodas/",
});

export const multerOptions = {};

export const initMulterMiddleware = () => {
    return multer({ storage, ...multerOptions });
};
