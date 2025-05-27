import { STORAGE_KEY, WEEK_IN_SECONDS } from "../constants";

export async function checkAndResetCounter(storage: any) {
  const resetTimeStr = await storage.getItem(`${STORAGE_KEY}_reset`);

  if (!resetTimeStr) {
    const resetTime = new Date(Date.now() + WEEK_IN_SECONDS * 1000);
    await storage.setItem(`${STORAGE_KEY}_reset`, resetTime.toISOString());
    await storage.setItem(STORAGE_KEY, 0);
    return 0;
  }

  const resetTime = new Date(resetTimeStr);
  const now = new Date();

  if (now >= resetTime) {
    const newResetTime = new Date(Date.now() + WEEK_IN_SECONDS * 1000);
    await storage.setItem(`${STORAGE_KEY}_reset`, newResetTime.toISOString());
    await storage.setItem(STORAGE_KEY, 0);
    return 0;
  }

  return Number((await storage.getItem(STORAGE_KEY)) || 0);
}
