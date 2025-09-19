"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ error: 'Access Token erforderlich' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = {
            id: decoded.userId,
            email: decoded.email
        };
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Ungültiger Token' });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            req.user = {
                id: decoded.userId,
                email: decoded.email
            };
        }
        catch (error) {
            // Token ungültig, aber nicht erforderlich
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
