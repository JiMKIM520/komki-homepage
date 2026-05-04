import "server-only";
import { Redis } from "@upstash/redis";

// Vercel Marketplace에서 Upstash Redis 연결 시 자동 주입되는 환경변수 사용.
// env가 없으면 null로 두고 호출 측에서 graceful 폴백.
export const redis: Redis | null =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;
