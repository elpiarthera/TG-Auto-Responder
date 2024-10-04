"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const crypto_1 = __importDefault(require("crypto"));
const supabaseClient_1 = require("../../../lib/supabaseClient");
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const telegramData = req.query;
        // Step 1: Extract relevant data
        const { hash } = telegramData, userDataFromTelegram = __rest(telegramData, ["hash"]);
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const secret = crypto_1.default.createHash('sha256').update(botToken || '', 'utf8').digest();
        // Step 2: Build the string to verify against the hash
        const checkString = Object.keys(userDataFromTelegram)
            .sort()
            .map((key) => `${key}=${userDataFromTelegram[key]}`)
            .join('\n');
        // Step 3: Generate the hash and compare
        const computedHash = crypto_1.default.createHmac('sha256', secret).update(checkString).digest('hex');
        if (computedHash === hash) {
            // Success: user is authenticated
            const { id, first_name, last_name, username, photo_url } = userDataFromTelegram;
            // Store or update user in Supabase
            const { data: userData, error: userError } = yield supabaseClient_1.supabase
                .from('users')
                .upsert({
                id,
                first_name,
                last_name,
                username,
                photo_url
            }, { onConflict: 'id' });
            if (userError) {
                console.error('Error storing user:', userError);
                return res.status(500).json({ message: 'Error storing user data' });
            }
            // Create or update user settings
            const { error: settingsError } = yield supabaseClient_1.supabase
                .from('user_settings')
                .upsert({
                user_id: id,
                is_responder_active: false, // default value
                message_template: '' // default value
            }, { onConflict: 'user_id' });
            if (settingsError) {
                console.error('Error storing user settings:', settingsError);
                return res.status(500).json({ message: 'Error storing user settings' });
            }
            // Set a session cookie
            res.setHeader('Set-Cookie', `session=${id}; HttpOnly; Path=/; Max-Age=2592000`); // 30 days
            // Redirect to dashboard
            res.writeHead(302, { Location: '/dashboard' });
            res.end();
        }
        else {
            // Error: hash does not match
            res.status(401).json({ message: 'Authentication failed' });
        }
    });
}
