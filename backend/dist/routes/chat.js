"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupChatWebSocket = setupChatWebSocket;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const supabase_1 = require("../lib/supabase");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const openaiService_1 = __importDefault(require("../services/openaiService"));
const router = express_1.default.Router();
// WebSocket-Server für Echtzeit-Chat
let io = null;
// Chat-Datenbank (JSON-basiert für lokale Entwicklung)
const chatDbPath = path_1.default.join(__dirname, '../../data/chat.json');
const messagesDbPath = path_1.default.join(__dirname, '../../data/messages.json');
// Initialisiere Chat-Datenbank
function initChatDb() {
    const dir = path_1.default.dirname(chatDbPath);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    if (!fs_1.default.existsSync(chatDbPath)) {
        fs_1.default.writeFileSync(chatDbPath, JSON.stringify([], null, 2));
    }
    if (!fs_1.default.existsSync(messagesDbPath)) {
        fs_1.default.writeFileSync(messagesDbPath, JSON.stringify([], null, 2));
    }
}
// Lade Chat-Daten
function loadChats() {
    try {
        if (!fs_1.default.existsSync(chatDbPath)) {
            initChatDb();
        }
        const data = fs_1.default.readFileSync(chatDbPath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Fehler beim Laden der Chat-Daten:', error);
        return mockChats;
    }
}
// Speichere Chat-Daten
function saveChats(chats) {
    try {
        fs_1.default.writeFileSync(chatDbPath, JSON.stringify(chats, null, 2));
    }
    catch (error) {
        console.error('Fehler beim Speichern der Chat-Daten:', error);
    }
}
// Lade Nachrichten
function loadMessages() {
    try {
        if (!fs_1.default.existsSync(messagesDbPath)) {
            initChatDb();
        }
        const data = fs_1.default.readFileSync(messagesDbPath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Fehler beim Laden der Nachrichten:', error);
        return mockMessages;
    }
}
// Speichere Nachrichten
function saveMessages(messages) {
    try {
        fs_1.default.writeFileSync(messagesDbPath, JSON.stringify(messages, null, 2));
    }
    catch (error) {
        console.error('Fehler beim Speichern der Nachrichten:', error);
    }
}
// WebSocket-Setup
function setupChatWebSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:3002", "http://localhost:3004"],
            methods: ["GET", "POST"]
        }
    });
    io.on('connection', (socket) => {
        console.log('🔌 Chat-WebSocket verbunden:', socket.id);
        // Benutzer einem Raum beitreten
        socket.on('join_chat', (data) => {
            socket.join(`chat_${data.chatId}`);
            socket.join(`user_${data.userId}`);
            console.log(`👤 Benutzer ${data.userId} ist Chat ${data.chatId} beigetreten`);
        });
        // Nachricht senden
        socket.on('send_message', async (data) => {
            try {
                const message = {
                    id: (0, uuid_1.v4)(),
                    chat_id: data.chatId,
                    sender_id: data.senderId,
                    receiver_id: data.receiverId,
                    text: data.text,
                    created_at: new Date().toISOString(),
                    is_read: false
                };
                // Nachricht speichern
                const messages = loadMessages();
                messages.push(message);
                saveMessages(messages);
                // Chat aktualisieren
                const chats = loadChats();
                const chatIndex = chats.findIndex(chat => chat.id === data.chatId);
                if (chatIndex !== -1) {
                    chats[chatIndex].last_message = data.text;
                    chats[chatIndex].last_message_at = message.created_at;
                    chats[chatIndex].updated_at = new Date().toISOString();
                    saveChats(chats);
                }
                // Nachricht an alle Teilnehmer des Chats senden
                io?.to(`chat_${data.chatId}`).emit('new_message', message);
                // Benachrichtigung an Empfänger senden
                io?.to(`user_${data.receiverId}`).emit('message_notification', {
                    chatId: data.chatId,
                    senderId: data.senderId,
                    text: data.text,
                    timestamp: message.created_at
                });
                console.log(`💬 Nachricht gesendet in Chat ${data.chatId}`);
            }
            catch (error) {
                console.error('Fehler beim Senden der Nachricht:', error);
                socket.emit('error', { message: 'Fehler beim Senden der Nachricht' });
            }
        });
        // Nachricht als gelesen markieren
        socket.on('mark_read', (data) => {
            try {
                const messages = loadMessages();
                const messageIndex = messages.findIndex(msg => msg.id === data.messageId);
                if (messageIndex !== -1) {
                    messages[messageIndex].is_read = true;
                    saveMessages(messages);
                    // Bestätigung senden
                    socket.emit('message_read', { messageId: data.messageId });
                }
            }
            catch (error) {
                console.error('Fehler beim Markieren als gelesen:', error);
            }
        });
        // Typing-Status
        socket.on('typing', (data) => {
            socket.to(`chat_${data.chatId}`).emit('user_typing', {
                userId: data.userId,
                isTyping: data.isTyping
            });
        });
        socket.on('disconnect', () => {
            console.log('🔌 Chat-WebSocket getrennt:', socket.id);
        });
    });
    // Initialisiere Datenbank
    initChatDb();
}
// Mock-Daten für Fallback (falls Supabase nicht verfügbar)
const mockChats = [
    {
        id: '1',
        user1_id: 'user1',
        user2_id: 'coach1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message: 'Hallo! Wie kann ich dir helfen?',
        last_message_at: new Date().toISOString()
    }
];
const mockMessages = [
    {
        id: '1',
        chat_id: '1',
        sender_id: 'coach1',
        receiver_id: 'user1',
        text: 'Hallo! Wie kann ich dir helfen?',
        created_at: new Date().toISOString(),
        is_read: false
    },
    {
        id: '2',
        chat_id: '1',
        sender_id: 'user1',
        receiver_id: 'coach1',
        text: 'Ich hätte gerne eine Coaching-Session.',
        created_at: new Date().toISOString(),
        is_read: true
    }
];
// GET /chat/conversations/:userId - Alle Chats eines Nutzers
router.get('/conversations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Verwende lokale JSON-Datenbank
        const chats = loadChats();
        const userChats = chats.filter(chat => chat.user1_id === userId || chat.user2_id === userId);
        res.json({
            success: true,
            chats: userChats
        });
    }
    catch (error) {
        console.error('Fehler beim Laden der Chats:', error);
        res.status(500).json({ error: 'Fehler beim Laden der Chats' });
    }
});
// GET /chat/messages/:chatId - Nachrichtenverlauf eines Chats
router.get('/messages/:chatId', async (req, res) => {
    try {
        const { chatId } = req.params;
        // Verwende lokale JSON-Datenbank
        const messages = loadMessages();
        const chatMessages = messages.filter(msg => msg.chat_id === chatId);
        res.json({
            success: true,
            messages: chatMessages
        });
    }
    catch (error) {
        console.error('Fehler beim Laden der Nachrichten:', error);
        res.status(500).json({ error: 'Fehler beim Laden der Nachrichten' });
    }
});
// POST /chat/messages - Neue Nachricht senden
router.post('/messages', async (req, res) => {
    try {
        const { chat_id, sender_id, receiver_id, text } = req.body;
        if (!chat_id || !sender_id || !receiver_id || !text) {
            return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
        }
        const newMessage = {
            chat_id,
            sender_id,
            receiver_id,
            text,
            created_at: new Date().toISOString(),
            is_read: false
        };
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            const { data, error } = await supabase_1.supabase
                .from('messages')
                .insert([newMessage])
                .select()
                .single();
            if (error)
                throw error;
            // Update chat updated_at
            await supabase_1.supabase
                .from('chats')
                .update({
                updated_at: new Date().toISOString(),
                last_message: text,
                last_message_at: new Date().toISOString()
            })
                .eq('id', chat_id);
            return res.status(201).json(data);
        }
        // Fallback: Mock-Daten
        const mockMessage = {
            id: Date.now().toString(),
            ...newMessage
        };
        mockMessages.push(mockMessage);
        res.status(201).json(mockMessage);
    }
    catch (error) {
        console.error('Fehler beim Senden der Nachricht:', error);
        res.status(500).json({ error: 'Fehler beim Senden der Nachricht' });
    }
});
// POST /chat/create - Neuen Chat erstellen
router.post('/create', async (req, res) => {
    try {
        const { user1_id, user2_id } = req.body;
        if (!user1_id || !user2_id) {
            return res.status(400).json({ error: 'user1_id und user2_id sind erforderlich' });
        }
        const newChat = {
            user1_id,
            user2_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            // Prüfe, ob Chat bereits existiert
            const { data: existingChat } = await supabase_1.supabase
                .from('chats')
                .select('*')
                .or(`and(user1_id.eq.${user1_id},user2_id.eq.${user2_id}),and(user1_id.eq.${user2_id},user2_id.eq.${user1_id})`)
                .single();
            if (existingChat) {
                return res.json(existingChat);
            }
            const { data, error } = await supabase_1.supabase
                .from('chats')
                .insert([newChat])
                .select()
                .single();
            if (error)
                throw error;
            return res.status(201).json(data);
        }
        // Fallback: Mock-Daten
        const mockChat = {
            id: Date.now().toString(),
            ...newChat
        };
        mockChats.push(mockChat);
        res.status(201).json(mockChat);
    }
    catch (error) {
        console.error('Fehler beim Erstellen des Chats:', error);
        res.status(500).json({ error: 'Fehler beim Erstellen des Chats' });
    }
});
// PUT /chat/:chatId/read - Nachrichten als gelesen markieren
router.put('/:chatId/read', async (req, res) => {
    try {
        const { chatId } = req.params;
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ error: 'user_id ist erforderlich' });
        }
        // Versuche Supabase zu verwenden
        if (supabase_1.supabase) {
            const { error } = await supabase_1.supabase
                .from('messages')
                .update({ is_read: true })
                .eq('chat_id', chatId)
                .eq('receiver_id', user_id)
                .eq('is_read', false);
            if (error)
                throw error;
            return res.json({ success: true });
        }
        // Fallback: Mock-Daten
        mockMessages.forEach(msg => {
            if (msg.chat_id === chatId && msg.receiver_id === user_id) {
                msg.is_read = true;
            }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Fehler beim Markieren als gelesen:', error);
        res.status(500).json({ error: 'Fehler beim Markieren als gelesen' });
    }
});
// POST /chat/create - Neuen Chat erstellen
router.post('/create', async (req, res) => {
    try {
        const { user1_id, user2_id } = req.body;
        if (!user1_id || !user2_id) {
            return res.status(400).json({
                success: false,
                error: 'user1_id und user2_id sind erforderlich'
            });
        }
        // Prüfe ob Chat bereits existiert
        const chats = loadChats();
        const existingChat = chats.find(chat => (chat.user1_id === user1_id && chat.user2_id === user2_id) ||
            (chat.user1_id === user2_id && chat.user2_id === user1_id));
        if (existingChat) {
            return res.json({
                success: true,
                chat: existingChat,
                message: 'Chat bereits vorhanden'
            });
        }
        // Erstelle neuen Chat
        const newChat = {
            id: (0, uuid_1.v4)(),
            user1_id,
            user2_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        chats.push(newChat);
        saveChats(chats);
        res.json({
            success: true,
            chat: newChat
        });
    }
    catch (error) {
        console.error('Fehler beim Erstellen des Chats:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Erstellen des Chats'
        });
    }
});
// POST /chat/ai - ChatGPT-ähnlicher Chat mit Human Design Kontext
router.post('/ai', async (req, res) => {
    try {
        const { message, chatHistory = [], userChart, userId } = req.body;
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Nachricht ist erforderlich'
            });
        }
        if (!process.env.OPENAI_API_KEY) {
            return res.status(503).json({
                success: false,
                error: 'AI-Service nicht verfügbar - API Key fehlt'
            });
        }
        console.log('🤖 AI-Chat Anfrage erhalten:', { message: message.substring(0, 100) + '...', userId });
        // Verwende den OpenAI Service für Chat
        const aiResponse = await openaiService_1.default.chatWithContext(message, chatHistory, userChart);
        // Speichere Chat-Verlauf (optional)
        const chatEntry = {
            id: (0, uuid_1.v4)(),
            user_id: userId,
            message: message,
            ai_response: aiResponse.response,
            user_chart: userChart,
            created_at: new Date().toISOString(),
            tokens_used: aiResponse.tokens
        };
        // Hier könnten Sie den Chat-Verlauf in einer Datenbank speichern
        console.log('💾 Chat-Eintrag erstellt:', chatEntry.id);
        res.json({
            success: true,
            response: aiResponse.response,
            tokens_used: aiResponse.tokens,
            chat_id: chatEntry.id,
            timestamp: chatEntry.created_at
        });
    }
    catch (error) {
        console.error('❌ Fehler beim AI-Chat:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Verarbeiten der AI-Anfrage',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// POST /chat/ai/question - Spezielle Human Design Fragen
router.post('/ai/question', async (req, res) => {
    try {
        const { question, context, userId } = req.body;
        if (!question) {
            return res.status(400).json({
                success: false,
                error: 'Frage ist erforderlich'
            });
        }
        if (!process.env.OPENAI_API_KEY) {
            return res.status(503).json({
                success: false,
                error: 'AI-Service nicht verfügbar - API Key fehlt'
            });
        }
        console.log('❓ HD-Frage erhalten:', { question: question.substring(0, 100) + '...', userId });
        // Verwende den OpenAI Service für HD-Fragen
        const aiResponse = await openaiService_1.default.answerHDQuestion(question, context);
        res.json({
            success: true,
            answer: aiResponse.answer,
            question: aiResponse.question,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('❌ Fehler bei der HD-Frage:', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Beantworten der Frage',
            details: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// GET /chat/ai/status - AI-Service Status prüfen
router.get('/ai/status', (req, res) => {
    const status = {
        aiAvailable: !!process.env.OPENAI_API_KEY,
        features: [
            'ChatGPT-ähnlicher Chat',
            'Human Design Fragen beantworten',
            'Chart-Kontext Integration',
            'PDF-Wissen Integration'
        ],
        models: {
            current: 'gpt-4o-mini',
            maxTokens: 4000,
            temperature: 0.7
        }
    };
    res.json({
        success: true,
        status
    });
});
exports.default = router;
