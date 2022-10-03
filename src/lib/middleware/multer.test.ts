import { generatePhotoFilename } from "./multer";

describe("generatePhotoFilename", () => {
    test.each([
        ["image/png", "png"],
        ["image/jpeg", "jpeg"],
    ])("Generate photo name '%s'", (mimeType, expectedFilesExtetion) => {
        const fullFilename = generatePhotoFilename(mimeType);
        const [, fileExtension] = fullFilename.split(".");

        expect(fileExtension).toEqual(expectedFilesExtetion);
    });
});
