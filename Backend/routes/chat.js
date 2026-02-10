import express from "express";
import Thread from "../models/Thread.js";

const router = express.Router();

// Chat endpoint - handles user messages and AI responses
router.post("/chat", async(req, res) => {
    try{
        const { message, threadId } = req.body;

        if (!message || !threadId) {
            return res.status(400).json({ error: "Message and threadId are required" });
        }

        // Call Groq API for AI response
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: message,
                    },
                ],
            }),
        };

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            options,
        );
        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
            return res.status(500).json({ error: "Failed to get AI response" });
        }

        const aiReply = data.choices[0].message.content;

        // Find or create thread
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            // Create new thread with first message as title
            thread = new Thread({
                threadId,
                title: message.substring(0, 50), // First 50 chars as title
                messages: []
            });
        }

        // Add user message and AI reply to thread
        thread.messages.push({
            role: "user",
            content: message,
            timestamp: new Date()
        });

        thread.messages.push({
            role: "assistant",
            content: aiReply,
            timestamp: new Date()
        });

        await thread.save();

        res.json({ reply: aiReply });

    }catch(err){
        console.log("Chat error:", err);
        res.status(500).json({ error: "Failed to process chat", details: err.message });
    }
});

// Get all threads
router.get("/thread", async(req, res) => {
    try{
        const threads = await Thread.find().sort({ updatedAt: -1 });
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

// Get single thread with messages
router.get("/thread/:threadId", async(req, res) => {
    try{
        const thread = await Thread.findOne({ threadId: req.params.threadId });
        
        if (!thread) {
            return res.status(404).json({error: "Thread not found"});
        }
        
        res.json(thread.messages || []);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch thread"});
    }
});

// Delete thread
router.delete("/thread/:threadId", async(req, res) => {
    try{
        const result = await Thread.deleteOne({ threadId: req.params.threadId });
        res.json({ success: true, deleted: result.deletedCount });
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

export default router;