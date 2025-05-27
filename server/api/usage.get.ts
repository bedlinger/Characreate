import { WEEKLY_LIMIT, STORAGE_KEY } from "../constants";
import { checkAndResetCounter } from "../utils/storage";

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

    const storage = useStorage("fs");

    const currentCount = await checkAndResetCounter(storage);
    const resetTime = await storage.getItem(`${STORAGE_KEY}_reset`);

    return {
      currentCount,
      limit: WEEKLY_LIMIT,
      remaining: Math.max(0, WEEKLY_LIMIT - currentCount),
      resetTime,
      limitReached: currentCount >= WEEKLY_LIMIT,
    };
  } catch (error: any) {
    if (error?.statusCode) {
      throw error;
    }

    console.error("Usage status error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
