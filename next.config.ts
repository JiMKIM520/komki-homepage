import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Ghost Pro (komki.ghost.io, storage.ghost.io 등 모든 서브도메인)
      // storage.ghost.io는 /c/<workspace-id>/content/images/** 형태를 사용하므로
      // pathname을 /** 로 열어둔다.
      {
        protocol: "https",
        hostname: "*.ghost.io",
        pathname: "/**",
      },
      // komki 커스텀 도메인
      {
        protocol: "https",
        hostname: "www.komki.co.kr",
        pathname: "/content/images/**",
      },
    ],
  },
};

export default nextConfig;
