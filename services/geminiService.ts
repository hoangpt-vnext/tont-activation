
import { GoogleGenAI } from "@google/genai";
import { ProgramEvent } from '../types';

// Fix: Always use the named parameter and direct access to process.env.API_KEY for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askScheduleAssistant = async (
  question: string,
  currentEvents: ProgramEvent[]
): Promise<string> => {
  // Fix: Check for process.env.API_KEY directly.
  if (!process.env.API_KEY) {
    return "Vui lòng cấu hình API Key để sử dụng tính năng này.";
  }

  try {
    // We provide the current filtered view of data to the model as context.
    const dataContext = JSON.stringify(currentEvents);
    
    const prompt = `
      Bạn là một trợ lý ảo thông minh giúp người dùng tra cứu lịch chạy chương trình sự kiện.
      Dưới đây là danh sách các sự kiện hiện có (dữ liệu JSON):
      ${dataContext}

      Người dùng hỏi: "${question}"

      Yêu cầu:
      1. Trả lời ngắn gọn, thân thiện bằng tiếng Việt.
      2. Dựa strictly vào dữ liệu JSON được cung cấp. Nếu không tìm thấy thông tin, hãy nói rõ.
      3. Nếu có nhiều kết quả, hãy liệt kê chúng rõ ràng (ví dụ: Tên quán - Thời gian).
      4. Định dạng câu trả lời sử dụng Markdown cơ bản nếu cần (in đậm tên quán hoặc brand).
    `;

    // Fix: Call generateContent with the model name and contents prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Fix: Use the .text property (not a method) to extract output.
    return response.text || "Xin lỗi, tôi không thể xử lý câu hỏi lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi kết nối với trợ lý ảo. Vui lòng thử lại sau.";
  }
};
