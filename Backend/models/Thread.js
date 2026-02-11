import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant']
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const threadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  messages: [messageSchema]
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

export default mongoose.model("Thread", threadSchema);
// ```

// #### **3. Add these environment variables on Render:**

// Go to your Render backend dashboard → Environment → Add:
// ```
// MONGODB_URI=your_mongodb_connection_string
// GROQ_API_KEY=your_groq_api_key
// PORT=8080
// NODE_ENV=production