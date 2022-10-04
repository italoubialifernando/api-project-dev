"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const validation_1 = require("./lib/validation");
const planets_1 = __importDefault(require("./routes/planets"));
const corsOption = {
    origin: "http://localhost:8080",
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOption));
app.use("/planets", planets_1.default);
app.use(validation_1.ValidationErrorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map