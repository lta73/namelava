import Redis from "ioredis";

const redis = new Redis("redis://default:AVMGAAIjcDE1YmVkN2NkYTFjZDM0NzE3YWYwZTkyNTI2ZWYzNDRmY3AxMA@renewing-chamois-21254.upstash.io:6379");

(async () => {
  try {
    await redis.set("testkey", "hello-world");
    const val = await redis.get("testkey");
    console.log("✅ Redis OK:", val);
  } catch (err) {
    console.error("❌ Redis FAIL:", err);
  }
})();
