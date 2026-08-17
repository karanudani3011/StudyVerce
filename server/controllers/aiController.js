import { GoogleGenerativeAI } from '@google/generative-ai';
import AIChat from '../models/AIChat.js';

// Helper to get formatted Indian Standard Time
const getCurrentTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

// ─── StudyVerse System Prompt ─────────────────────────────────────────────────
// This is the "scope lock" — Gemini is instructed to ONLY answer StudyVerse topics.
const STUDYVERSE_SYSTEM_PROMPT = `You are the StudyVerse AI Tutor — an intelligent academic assistant built exclusively for the StudyVerse learning platform.

YOUR ALLOWED TOPICS (answer these helpfully and in detail):
1. Academic subjects taught on StudyVerse: Mathematics, Physics, Chemistry, Biology, Computer Science, History, Economics, English Literature, Engineering, Medicine (USMLE), Law, and other educational subjects.
2. StudyVerse platform features: how to use courses, how to join communities, how to earn XP and streaks, how the leaderboard works, how to upload notes, how to use the AI Tutor, profile settings, etc.
3. Study techniques: how to study effectively, creating flashcards, making quiz questions, summarizing notes, time management for students, exam preparation tips.
4. Explaining academic concepts, solving problems, generating quiz questions, summarizing notes for subjects in the platform.
5. Coding only for academic/educational purposes (e.g., Python for data science class, Java for CS assignments).

STRICT RULES — YOU MUST REFUSE these with a polite message:
- Current events, news, politics, sports scores, entertainment
- Questions about celebrities, influencers, public figures (unless historically relevant for academics)
- General-purpose coding (build me an app, write a website)
- Personal life advice, relationships, mental health counseling
- Financial advice, investing, crypto
- Anything not related to studying, learning, or the StudyVerse platform

REFUSAL MESSAGE (use this exact format when refusing):
"I'm your **StudyVerse AI Tutor** 📚 — I can only help with academic subjects and platform features. Please ask me something study-related! Try: 'Explain Newton's Laws', 'Generate a quiz on Organic Chemistry', or 'How do I join a community on StudyVerse?'"

RESPONSE FORMAT:
- Use clear headings, bullet points, and numbered lists where helpful
- For math/code, format clearly with examples
- Keep responses concise but complete
- End study explanations with a quick "💡 Quick Tip" or "📝 Remember" where helpful
- Be encouraging and motivating — you're a study partner!

You are ONLY the StudyVerse AI Tutor. You do not have any other role or identity. Do not pretend to be ChatGPT, GPT-4, or any other AI.`;

// ─── Chat with AI Controller ──────────────────────────────────────────────────
// @route   POST /api/ai/chat
// @access  Private (requires JWT)
export const chatWithAI = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'AI service is not configured. Please contact support.' });
    }

    const { userMessage, time } = req.body;
    const userId = req.user._id;

    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ message: 'Please provide a message.' });
    }

    // 1. Fetch or create user's chat document in MongoDB
    let chatDoc = await AIChat.findOne({ userId });
    if (!chatDoc) {
      chatDoc = new AIChat({ userId, messages: [] });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      systemInstruction: STUDYVERSE_SYSTEM_PROMPT,
    });

    // 2. Build conversation history from database
    const history = [];
    const dbMessages = chatDoc.messages || [];
    const firstUserIndex = dbMessages.findIndex(m => m.role === 'user');

    if (firstUserIndex !== -1) {
      dbMessages.slice(firstUserIndex).forEach(m => {
        history.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }],
        });
      });
    }

    // Start chat session with history
    const chat = model.startChat({ history });

    // Send latest user message
    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    // 3. Save conversation turns to database
    const clientTime = time || getCurrentTime();
    chatDoc.messages.push({ role: 'user', text: userMessage, time: clientTime });
    chatDoc.messages.push({ role: 'assistant', text: responseText, time: getCurrentTime() });
    
    // Reset TTL 30 days index timer
    chatDoc.updatedAt = Date.now();
    await chatDoc.save();

    return res.json({
      success: true,
      reply: responseText,
      time: getCurrentTime(),
    });
  } catch (error) {
    console.error('AI Chat Error:', error);

    // Handle Gemini-specific errors
    if (error.status === 400) {
      return res.status(400).json({ message: 'Invalid request to AI service.' });
    }
    if (error.status === 429) {
      return res.status(429).json({ message: 'AI service is busy. Please wait a moment and try again.' });
    }
    if (error.status === 403 || error.message?.includes('API key')) {
      return res.status(500).json({ message: 'AI service authentication failed. Please contact support.' });
    }

    return res.status(500).json({
      message: error.message || 'Something went wrong with the AI service. Please try again.',
    });
  }
};

// ─── Get Chat History Controller ──────────────────────────────────────────────
// @route   GET /api/ai/history
// @access  Private (requires JWT)
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatDoc = await AIChat.findOne({ userId });
    
    return res.json({
      success: true,
      messages: chatDoc ? chatDoc.messages : [],
    });
  } catch (error) {
    console.error('Get AI Chat History Error:', error);
    return res.status(500).json({ message: 'Failed to retrieve chat history.' });
  }
};

// ─── Clear Chat History Controller ─────────────────────────────────────────────
// @route   DELETE /api/ai/history
// @access  Private (requires JWT)
export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    await AIChat.findOneAndDelete({ userId });
    
    return res.json({
      success: true,
      message: 'Chat history cleared successfully.',
    });
  } catch (error) {
    console.error('Clear AI Chat History Error:', error);
    return res.status(500).json({ message: 'Failed to clear chat history.' });
  }
};
