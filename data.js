import { Keyboard } from "grammy";
import {
    getCategories,
    getPublicExceptions,
    getResultStudent,
    getSessions,
    getTypes,
    getYears
} from "./controllers/Bot.js";

export class Data {

    static defaultButton = ["القائمة الرئيسية"]

    static getButtons(buttons) {
        return [Data.defaultButton, ...buttons]
    }

    static async getCategories() {
        const { data, status } = await getCategories()
        if (status === "success") {
            const buttonRows = data.map((category, index) => [Keyboard.text(category.name)]);
            return Keyboard.from(Data.getButtons(buttonRows)).placeholder("اختر المسابقة").resized()
        }
        return null;

    }

    static async getSessions() {
        const { data, status } = await getSessions()
        if (status === "success") {
            const buttonRows = data.map((session) => [Keyboard.text(session.name)]);
            return Keyboard.from(Data.getButtons(buttonRows)).placeholder("اختر الدورة").resized().toTransposed().toFlowed(2);
        }
        return null;

    }

    static async getYears() {
        const { data, status } = await getYears()
        if (status === "success") {
            const buttonRows = data.map((year) => [Keyboard.text(year.name)]);
            return Keyboard.from(Data.getButtons(buttonRows)).placeholder("اختر السنة").resized().toTransposed().toFlowed(2);
        }
        return null;
    }

    static async getTypes() {
        const { data, status } = await getTypes()
        if (status === "success") {
            const buttonRows = data.map((type) => [Keyboard.text(type.nameAr)]);
            return Keyboard.from(Data.getButtons(buttonRows)).placeholder("اختر الشعبة").resized().toTransposed().toFlowed(1);
        }
        return null;
    }

    static async getResultByNumber({year, type, session, category, number}) {
        const { data, status } = await getResultStudent( {year, category, type, session, number})
        if (status === "success") {
            return data
        }
        return null;
    }
}