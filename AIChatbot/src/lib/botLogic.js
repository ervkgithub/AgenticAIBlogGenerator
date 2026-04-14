// src/lib/botLogic.js

// 1. Rule-Based
export function ruleBasedBot(input) {
    const text = input.toLowerCase().trim();
    if (text.includes("hello") || text.includes("hi")) return "Hi! How can I help you?";
    if (text.includes("price") || text.includes("pricing")) return "Please visit our pricing page.";
    return "Error: Unrecognized command. (Try 'hello' or 'price')";
}

// 2. Menu-Based
export function menuBasedBot(input) {
    const txt = input.toLowerCase();
    if (txt === "menu" || txt === "hi" || txt === "hello") {
        return "Please choose an option (type a number):\n1. Account Help\n2. Technical Support\n3. Talk to AI";
    }
    const choice = parseInt(input);
    if (choice === 1) return "Go to Settings > Profile.";
    if (choice === 2) return "Reboot device or call 1-800-SUPPORT.";
    if (choice === 3) return "Transferring to AI...";
    return "Invalid selection. Please type 1, 2, or 3.";
}

// 3. Keyword-Based
export function keywordBasedBot(input) {
    const text = input.toLowerCase();
    if (text.includes("refund")) return "A refund takes 5-7 business days to process.";
    if (text.includes("order")) return "Please share your 10-digit order ID.";
    if (text.includes("cancel")) return "Orders can only be canceled within 24 hours of placement.";
    return "I'm not sure. Try asking about 'refund', 'order', or 'cancel'.";
}

// 4. NLP Conversational
const intents = [
    { pattern: /\b(hi|hello|hey|greetings|namaste)\b/i, resp: "Hello there! How are you?" },
    { pattern: /\b(book|flight|fly|ticket)\b/i, resp: "Where would you like to fly to?" },
    { pattern: /\b(weather|temperature|hot|cold)\b/i, resp: "What city are you in right now?" }
];
export function nlpBot(input) {
    for (let item of intents) {
        if (item.pattern.test(input)) return item.resp;
    }
    return "Could you rephrase that? Try asking about weather or booking a flight.";
}

// 5. Generative AI (DYNAMIC POLLINATIONS LLM API)
export async function generativeAIBot(input) {
    const text = input.toLowerCase();
    if (text === "hello" || text === "hi" || text.trim() === "") {
        return "Hello there! I am a dynamic generative AI. Ask me a complex question.";
    }

    try {
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent("You are an intelligent chatbot assistant. Respond concisely to: " + input)}`);
        const resultText = await response.text();
        return resultText || "Sorry, I couldn't generate a response right now.";
    } catch (e) {
        return "Error connecting to AI Provider.";
    }
}

// 6. Voice
export function voiceChatbot(input) {
    const text = input.toLowerCase();
    if (text.includes("hello") || text.includes("hi")) return "Hi! Voice AI actively listening.";
    if (text.includes("time")) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `Right now, it's ${time}.`;
    }
    if (text.includes("joke")) return "Why did the developer go broke? Because he used up all his cache.";
    
    return "Sorry, I didn't catch that. Could you say it again?";
}

// 7. Hybrid (Rule + AI)
export async function hybridChatbot(input) {
    const fastResponse = ruleBasedBot(input);
    if (fastResponse.includes("Error")) {
        const generativeResponse = await generativeAIBot(input);
        return "⚡ [AI Fallback]\n" + generativeResponse;
    }
    return "🛡️ [Rule Match]\n" + fastResponse;
}

// 8. Transactional
let conversationState = "IDLE";
let orderPayload = { item: null, quantity: null };

export function resetTransactionalState() {
    conversationState = "IDLE";
}

export function transactionalChatbot(input) {
    const text = input.toLowerCase();
    
    if (conversationState === "IDLE" && (text === "hi" || text === "hello")) {
         return "Hi! To start ordering, just say 'I want to order'.";
    }

    switch (conversationState) {
        case "IDLE":
            if (text.includes("buy") || text.includes("order")) {
                conversationState = "AWAITING_ITEM";
                return "Great! What would you like to order? (e.g., Pizza, Burger)";
            }
            return "To start ordering, just say 'I want to order'.";

        case "AWAITING_ITEM":
            orderPayload.item = text;
            conversationState = "AWAITING_QUANTITY";
            return `Awesome, ${text}. How many do you want? (Enter a number)`;

        case "AWAITING_QUANTITY":
            orderPayload.quantity = parseInt(text);
            if (isNaN(orderPayload.quantity)) return "Please enter a valid number.";
            conversationState = "CONFIRMATION";
            return `So that's ${orderPayload.quantity} x ${orderPayload.item}. Confirm? (yes/no)`;

        case "CONFIRMATION":
            conversationState = "IDLE";
            if (text.includes("yes")) return "✅ Transaction Complete! Your order is placed.";
            return "❌ Transaction Cancelled.";
    }
}

// 9. AI Agent (DYNAMIC PIPELINE LLM API)
export async function aiAgentChatbot(task) {
    if (task.toLowerCase() === "hi" || task.toLowerCase() === "hello") {
        return "I am an Autonomous Agent. Provide a complex task.";
    }

    let statusStr = "🧠 [AGENT REASONING / THINKING...]\n";
    statusStr += `✔️ Analyzing goal...\n`;
    
    try {
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent("You are an autonomous agent planning a pipeline. The user wants to: " + task + ". List 3 concise bullet points of actionable steps you are taking. Do not write an essay.")}`);
        const resultText = await response.text();
        statusStr += `\n[ACTION PLAN]\n` + resultText;
    } catch (e) {
        statusStr += `⚠️ API Connection failure.`;
    }
    return statusStr;
}

// 10. Emotional
export function emotionalChatbot(input) {
    const text = input.toLowerCase();
    if (text === "hi" || text === "hello") return "Hello! How are you feeling today?";

    const stressMarkers = ['sad', 'stressed', 'angry', 'terrible', 'failed', 'depressed', 'bad'];
    const happyMarkers = ['happy', 'great', 'won', 'amazing', 'love', 'good'];

    if (stressMarkers.some(word => text.includes(word))) {
        return "I'm really sorry you're going through this. It's completely valid to feel that way. 💙 I'm here if you want to vent.";
    }
    if (happyMarkers.some(word => text.includes(word))) {
        return "That is absolutely wonderful to hear! I'm so happy for you! 🎉";
    }
    
    return "I hear you. Tell me a little bit more about how that makes you feel.";
}
