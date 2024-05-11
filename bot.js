import { Bot, session } from "grammy";
import { freeStorage } from "@grammyjs/storage-free";
import { conversations, createConversation } from "@grammyjs/conversations";
import {Conversation} from "./conversation.js";

export const bot = new Bot("6882933460:AAGPO5KbniOfBEd_5YDgMduCqR1X3ZV-mvk");
bot.use(session({
    initial() {
        return {};
    },
    storage: freeStorage(bot.token),
}));

async function handelConversation(conversation, ctx) {
    const newConversation = new Conversation(conversation, ctx)
    await newConversation.handelInput()
}

bot.use(conversations());
bot.use(createConversation(handelConversation));
bot.command("start", async (ctx) => {
    await ctx.conversation.enter("handelConversation");
});
bot.on("message:text", async (ctx) => {
    await ctx.conversation.enter("handelConversation");
});

bot.start();