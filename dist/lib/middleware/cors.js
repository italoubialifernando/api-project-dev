"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCorsMiddlaware = void 0;
const cors_1 = __importDefault(require("cors"));
function initCorsMiddlaware() {
    const corsOption = {
        origin: "http://localhost:8080",
        credentials: true,
    };
    return (0, cors_1.default)(corsOption);
}
exports.initCorsMiddlaware = initCorsMiddlaware;
//# sourceMappingURL=cors.js.map