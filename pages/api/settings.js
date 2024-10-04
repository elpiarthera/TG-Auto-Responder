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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const supabaseClient_1 = require("../../lib/supabaseClient");
const server_1 = require("@clerk/nextjs/server");
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = (0, server_1.getAuth)(req);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (req.method === 'GET') {
            const { data, error } = yield supabaseClient_1.supabase
                .from('user_settings')
                .select('is_responder_active, message_template')
                .eq('user_id', userId)
                .single();
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            return res.status(200).json(data);
        }
        else if (req.method === 'POST') {
            const { is_responder_active, message_template } = req.body;
            const { error } = yield supabaseClient_1.supabase
                .from('user_settings')
                .upsert({
                user_id: userId,
                is_responder_active,
                message_template
            });
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            return res.status(200).json({ message: 'Settings updated successfully' });
        }
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    });
}
