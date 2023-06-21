"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const tweetRoutes_1 = __importDefault(require("./routes/tweetRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const app = (0, express_1.default)();
// used to make every request treated as json not string
app.use(express_1.default.json());
app.use("/user", authMiddleware_1.authenticateToken, userRoutes_1.default);
app.use("/tweet", authMiddleware_1.authenticateToken, tweetRoutes_1.default);
app.use("/auth", authRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.listen(3000, () => {
    console.log("server ready at localhost:3000");
});
