import "server-only";
import { Redis } from "@upstash/redis";

// Vercel Marketplace의 Upstash Redis는 KV 호환 키(KV_REST_API_*)로 주입됨.
// 직접 셋업한 경우 UPSTASH_REDIS_REST_*도 지원. 둘 중 먼저 발견되는 키 사용.
const url =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const redis: Redis | null =
  url && token ? new Redis({ url, token }) : null;
