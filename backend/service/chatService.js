const { User, Conversation, Booking } = require('../database/db');
const OpenAI = require('openai');
const { getCounselors, bookCounselor } = require("./services");

require("dotenv").config();

const tools = [
  {
    name: "get_counselors",
    description: "Get available counselors",
    parameters: { }
  },
  {
    name: "book_counselor",
    description: "Book a counselor",
    parameters: {
      type: "object",
      properties: {
        counselorId: { type: "number" },
        fullName: { type: "string" },
        email: { type: "string" },
        date: { type: "string", description: "Appointment date in YYYY-MM-DD format" },
        time: { type: "string", description: "Appointment time in HH:MM format" }
      },
      required: ["counselorId", "fullName", "email", "date", "time"]
    }
  }
];
const SYSTEM_MESSAGE = `You are a mental wellness chatbot. Key points:
1. If asked "Who are you?", explain that you're a mental health assistant chatbot.
2. If a user shares a mental health concern or problem, offer some practical tips or strategies to help manage their issue.
3. You can communicate in any language the user prefers.
4. To book a counselor, please provide the following information:
  - Your full name
  - Your email address
  - The date you would like to book the appointment (in YYYY-MM-DD format)`;




const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY
});

async function chatService(req, res) {
  const { message, userId } = req.body;

  try {
    let user = await User.findOne({ userId: userId });
    if (!user) {
      try {
        user = new User({ userId: userId, lastInteraction: new Date() });
        await user.save();
      } catch (createError) {
        console.error('Error creating user:', createError);
        if (createError.code === 11000) {
          // If creation fails due to duplicate key, try to find the user again
          user = await User.findOne({ userId: userId });
          if (!user) {
            throw new Error('Failed to create or find user after duplicate key error');
          }
        } else {
          throw createError;
        }
      }
    } else {
      user.lastInteraction = new Date();
      await user.save();
    }

    let conversation = await Conversation.findOne({ userId: userId });
    if (!conversation) {
      conversation = new Conversation({ userId: userId, messages: '[]' });
      await conversation.save();
    }


    let messages = JSON.parse(conversation.messages);
    messages.push({ role: 'user', content: message });

    const systemMessage = `${SYSTEM_MESSAGE}\nUser details: ${JSON.stringify(user)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
        ...messages
      ],
      functions: tools,
      function_call: "auto",
    });

    let assistantMessage = completion.choices[0].message;

    if (assistantMessage.function_call) {
      const functionName = assistantMessage.function_call.name;
      const functionArgs = JSON.parse(assistantMessage.function_call.arguments);

      let functionResult;
      if (functionName === 'get_counselors') {
        functionResult = await getCounselors();
      } else if (functionName === 'book_counselor') {
        const { counselorId, fullName, email, date, time } = functionArgs;
        functionResult = await bookCounselor(counselorId, fullName, email, date, time);
      }

      messages.push({
        role: "function",
        name: functionName,
        content: JSON.stringify(functionResult)
      });

      const secondCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages
      });

      assistantMessage = secondCompletion.choices[0].message;
    }

    messages.push(assistantMessage);

    await Conversation.updateOne({ userId }, { messages: JSON.stringify(messages) });

    res.json({ response: assistantMessage.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}

module.exports = chatService;
