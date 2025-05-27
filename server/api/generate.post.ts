import { z } from "zod";
import { WEEKLY_LIMIT, STORAGE_KEY, WEEK_IN_SECONDS } from "../constants";
import { checkAndResetCounter } from "../utils/storage";

const PersonaGenerationSchema = z.object({
  projectIdea: z.string().min(1, "Project idea is required"),
  group: z.string().min(1, "Target group is required"),
  age: z.number().min(14).max(100),
  gender: z.string().min(1, "Gender is required"),
  goals: z.array(z.string()).min(1, "At least one goal is required"),
});

export default defineEventHandler(async (event) => {
  try {
    const origin = getHeader(event, "origin");
    const host = getHeader(event, "host");

    if (origin && host && !origin.includes(host)) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden: External access not allowed",
      });
    }

    const body = await readBody(event);
    const validatedData = PersonaGenerationSchema.parse(body);

    const storage = useStorage("fs");

    const currentCount = await checkAndResetCounter(storage);

    if (currentCount >= WEEKLY_LIMIT) {
      throw createError({
        statusCode: 429,
        statusMessage:
          "Weekly persona generation limit reached. Please try again next week.",
        data: {
          currentCount,
          limit: WEEKLY_LIMIT,
          resetTime: await storage.getItem(`${STORAGE_KEY}_reset`),
        },
      });
    }

    const config = useRuntimeConfig();

    if (!config.public.apiUrl || !config.public.apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: "API configuration missing",
      });
    }

    const systemPrompt = `
      You are an AI system tasked with generating detailed personas based on user input. A persona is a fictional representation of a target user group designed to facilitate empathy and understanding for product design and usability testing.
      Follow these guidelines:
      - Accept input for Project Idea, Target Group, Age, Gender, and Goals.
      - Generate a persona with details: Name, Age, Gender, Location, Occupation, Biography, Hobbies and Interests, Technical Experience, Goals, Motivation, and Challenges.
      - Provide the response in the following JSON format:
      {
        "persona": {
          "name": "String",
          "age": Integer,
          "gender": "String",
          "location": "String",
          "occupation": "String",
          "biography": "String",
          "hobbies_and_interests": ["String"],
          "technical_experience": "String",
          "goals": ["String"],
          "motivation": "String",
          "challenges": ["String"]
        }
      }
      Ensure the response adheres strictly to this format and includes all fields.
    `;

    const userPrompt = `
      Generate a persona for the following:
      - Project Idea: ${validatedData.projectIdea}
      - Target Group: ${validatedData.group}
      - Age: ${validatedData.age}
      - Gender: ${validatedData.gender}
      - Goals: ${JSON.stringify(validatedData.goals)}
      Respond in JSON format as specified.
    `;

    const aiResponse = await $fetch<{
      choices: Array<{
        message: {
          content: string;
        };
      }>;
    }>(config.public.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.public.apiKey}`,
      },
      body: {
        model: "Qwen/Qwen2.5-72B-Instruct",
        messages: [
          {
            role: "system",
            content: systemPrompt.trim(),
          },
          {
            role: "user",
            content: userPrompt.trim(),
          },
        ],
        response_format: { type: "json_object" },
      },
    });

    if (!aiResponse?.choices?.[0]?.message?.content) {
      throw createError({
        statusCode: 500,
        statusMessage: "Invalid response from AI service",
      });
    }

    const personaData = JSON.parse(aiResponse.choices[0].message.content);

    if (!personaData?.persona) {
      throw createError({
        statusCode: 500,
        statusMessage: "Invalid persona data received",
      });
    }

    personaData.persona.profile_image = `https://robohash.org/${personaData.persona.name}?set=set3`;

    const newCount = currentCount + 1;

    await storage.setItem(STORAGE_KEY, newCount);

    return {
      success: true,
      persona: personaData.persona,
      usage: {
        currentCount: newCount,
        limit: WEEKLY_LIMIT,
        remaining: WEEKLY_LIMIT - newCount,
      },
    };
  } catch (error: any) {
    if (error?.name === "ZodError") {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid input data",
        data: error.errors,
      });
    }

    if (error?.data?.status) {
      throw createError({
        statusCode: error.data.status,
        statusMessage: `AI service error: ${
          error.data.statusText || "Unknown error"
        }`,
      });
    }

    if (error?.statusCode) {
      throw error;
    }

    console.error("Persona generation error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
