import { WEEKLY_LIMIT, REDIS_KEY } from "../constants";

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

    const storage = useStorage("redis");

    const currentCount = Number((await storage.getItem(REDIS_KEY)) || 0);
    const resetTime = await storage.getItem(`${REDIS_KEY}_reset`);

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
