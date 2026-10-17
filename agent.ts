import { GoogleGenAI } from '@google/genai';
import { GEMINI_MODEL, SYSTEM_PROMPT } from './constant/index';
import { ALL_TOOLS, TOOL_ARGS, TOOL_IMPLEMENTATIONS } from './tools/index';

// const GEMINI_API_KEY = process.env['GEMINI_API_KEY'];
// console.log(GEMINI_API_KEY);

// if (!GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY тохируулагдаагүй байна!");
// }

const llm = new GoogleGenAI({ apiKey: 'REPLACE_WITH_ENV_VAR' });

export const runAgent = async (userMessage: string) => {
  // 1. Чат үүсгэх
  const chat = llm.chats.create({
    model: GEMINI_MODEL,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0,
      tools: ALL_TOOLS,
    },
  });

  try {
    // 2. Хэрэглэгчийн мессежийг анхлан илгээх
    let response = await chat.sendMessage({
      message: userMessage,
    });

    // 3. AGENT LOOP: Модел функц дуудахыг хүсэж байгаа цагт энэ давталт ажиллана
    while (response.functionCalls && response.functionCalls.length > 0) {
      const toolResponses = [];

      for (const call of response.functionCalls) {
        const toolFunction = TOOL_IMPLEMENTATIONS[call.name];
        const toolSchema = TOOL_ARGS[call.name];

        if (!toolFunction || !toolSchema) {
          toolResponses.push({
            // ЗАСВАР: functionResponse гэж ороож өгөх
            functionResponse: {
              name: call.name,
              response: { error: `Tool '${call.name}' олдсонгүй.` },
            }
          });
          continue;
        }

        const parsed = toolSchema.safeParse(call.args);

        if (parsed.success) {
          try {
            const result = await toolFunction(parsed.data);
            toolResponses.push({
              // ЗАСВАР: functionResponse гэж ороож өгөх
              functionResponse: {
                name: call.name,
                response: result,
              }
            });
          } catch (error: any) {
            toolResponses.push({
              // ЗАСВАР: functionResponse гэж ороож өгөх
              functionResponse: {
                name: call.name,
                response: { error: error.message || 'Функц ажиллахад алдаа гарлаа' },
              }
            });
          }
        } else {
          toolResponses.push({
            // ЗАСВАР: functionResponse гэж ороож өгөх
            functionResponse: {
              name: call.name,
              response: { 
                error: 'Параметрийн алдаа гарлаа.', 
                details: parsed.error.errors 
              },
            }
          });
        }
      }

      // 5. Функцийн үр дүнг явуулах
      // Энд toolResponses (Array) шууд явуулна
      response = await chat.sendMessage({message:toolResponses[0].functionResponse.response});
    }

    // 6. Давталт дуусаж, эцсийн текст хариулт ирэх үед буцаах
    return response.text;

  } catch (error) {
    console.error("Agent ажиллах явцад алдаа гарлаа:", error);
    throw error;
  }
};

// ==========================================
// ТЕСТЛЭХ ХЭСЭГ
// ==========================================
async function main() {
  const testMessage = "Улаанбаатарын цаг агаар ямар байна?";
  console.log(`Хэрэглэгч: ${testMessage}`);
  
  try {
    const reply = await runAgent(testMessage);
    console.log(`\nAgent-ийн эцсийн хариулт:\n${reply}`);
  } catch (err) {
    console.error("Алдаа гарлаа:", err);
  }
}

main();