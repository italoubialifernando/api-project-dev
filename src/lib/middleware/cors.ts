import cors from "cors";

export function initCorsMiddlaware() {
    const corsOption = {
        origin: "http://localhost:8080",
        credentials: true,
    };
    return cors(corsOption);
}
