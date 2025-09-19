"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
async function main() {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hdapp';
    await mongoose_1.default.connect(uri);
    console.log('[seed] connected:', mongoose_1.default.connection.name);
    const u = await User_1.default.findOne({ email: 'testuser@example.com' }).lean();
    if (!u) {
        const doc = new User_1.default({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'meinPasswort123', // wird per pre('save') gehasht
            name: 'Test User',
            birthdate: '2000-01-01'
        });
        await doc.save();
        console.log('[seed] created:', doc._id);
    }
    else {
        console.log('[-] exists: testuser@example.com');
    }
    await mongoose_1.default.disconnect();
    console.log('[seed] done');
}
main().catch(e => { console.error('[seed] error:', e); process.exit(1); });
