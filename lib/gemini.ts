
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
} else {
    console.warn("Gemini API key is not configured. Email generation will use a fallback template.");
}

/**
 * Generates an email notification content using the Gemini API.
 * @param orderId The ID of the order.
 * @param customerName The name of the customer.
 * @returns The generated email body as a string.
 */
export async function generateOrderReadyEmail(orderId: string, customerName: string): Promise<string> {
    const fallbackMessage = `
عزيزي ${customerName}،

يسعدنا إعلامك بأن طلبك رقم ${orderId} أصبح جاهزاً للاستلام من المكتبة الإلكترونية.

يمكنك الحضور لاستلامه في أي وقت خلال ساعات العمل.

شكراً لتسوقك معنا!

مع تحيات،
فريق المكتبة الإلكترونية
    `;

    if (!ai) {
        return Promise.resolve(fallbackMessage);
    }

    try {
        const prompt = `
        اكتب بريدًا إلكترونيًا ودودًا واحترافيًا باللغة العربية لإعلام عميل بأن طلبه أصبح جاهزًا للاستلام.
        - اسم العميل: ${customerName}
        - رقم الطلب: ${orderId}
        - اسم المتجر: المكتبة الإلكترونية
        - يجب أن تكون الرسالة موجزة وواضحة.
        - اذكر أن الدفع نقداً عند الاستلام.
        - أنهِ الرسالة بتحية لطيفة.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.error("Error generating email with Gemini:", error);
        // Fallback to a template on error
        return fallbackMessage;
    }
}
