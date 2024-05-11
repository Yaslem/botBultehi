import {Data} from "./data.js";
import {getImage} from "./helpers.js";
import {getPublicExceptions} from "./controllers/Bot.js";
export class Conversation {

    high = { name: "مسابقة ختم الدروس الثانوية", slug: 5 }
    middle = { name: "مسابقة ختم الدروس الإعدادية", slug: 2 }
    elementary = { name: "مسابقة ختم الدروس الابتدائية", slug: 1 }
    constructor(conversation, ctx) {
        this.conversation = conversation;
        this.ctx = ctx;
        this.input = ctx.message.text;
    }

    async handelInput() {
        switch (this.input) {
            case this.isDefaultButton(): {
                await this.ctx.reply("اختر المسابقة", {
                    reply_markup: await Data.getCategories()
                });
            }
                break;
            default: {
                await this.getResult()
            }
        }
    }

    async getResult() {
        if(this.input === this.high.name){
            await this.ctx.reply("اختر السنة", {
                reply_markup: await Data.getYears()
            });
            const { message: {text: year} } = await this.conversation.waitFor("message:text");

            if(this.isInputEqualDefaultButton(year)){
                return await this.defaultReply()
            } else {
                await this.ctx.reply("اختر الدورة", {
                    reply_markup: await Data.getSessions()
                });
                const { message: {text: session} } = await this.conversation.waitFor("message:text");

                if(this.isInputEqualDefaultButton(session)){
                    await this.defaultReply()
                } else {
                    await this.ctx.reply("اختر الشعبة", {
                        reply_markup: await Data.getTypes()
                    });
                    const {message: {text: type}} = await this.conversation.waitFor("message:text");

                    if (this.isInputEqualDefaultButton(type)) {
                        await this.defaultReply()
                    } else {
                        await this.ctx.reply("اكتب رقم الطالب", {
                            reply_markup: {remove_keyboard: true}
                        });
                        const {message: {text: number}} = await this.conversation.waitFor("message:text");
                        if (!isNaN(number)) {
                            await this.sendResult({
                                year,
                                type,
                                category: this.getCategorySlug(this.input),
                                session,
                                number
                            })
                        } else {
                            await this.ctx.reply("الرقم غير صحيح");
                            return await this.defaultReply()
                        }
                    }
                }
            }
        } else {
            return await this.defaultReply()
        }
    }

    isDefaultButton() {
        return this.input === "القائمة الرئيسية"
    }

    isInputEqualDefaultButton(input) {
        return input === "القائمة الرئيسية"
    }

    getCategorySlug(input){
        switch (input) {
            case this.high.name:
                return this.high.slug
            case this.middle.name:
                return this.middle.slug
            case this.elementary.name:
                return this.elementary.slug
        }
    }
    async defaultReply() {
        await this.ctx.reply("اختر المسابقة", {
            reply_markup: await Data.getCategories()
        });
    }

    async sendResult({year, type, category, session, number}) {
        const result = await Data.getResultByNumber({year, type, category, session, number})
        const exceptions = await getPublicExceptions()
        await this.ctx.reply(`جار إرسال صورة من نتيجتك يا ${result.student.name}`);
        await getImage({chatId: this.ctx.message.chat.id, result, exceptions})
        return await this.defaultReply()
    }
}