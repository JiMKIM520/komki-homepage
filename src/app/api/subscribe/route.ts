import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, source } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ message: "이메일을 입력해주세요." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ message: "올바른 이메일 형식이 아닙니다." }, { status: 400 });
  }

  const ghostUrl = process.env.GHOST_URL;
  if (!ghostUrl) {
    console.error("GHOST_URL not set");
    return NextResponse.json({ message: "서버 설정 오류입니다." }, { status: 500 });
  }

  try {
    // Ghost Members API v5: integrity-token 먼저 발급
    const tokenRes = await fetch(`${ghostUrl}/members/api/integrity-token/`);
    if (!tokenRes.ok) {
      console.error("Ghost integrity-token error:", tokenRes.status);
      return NextResponse.json(
        { message: "구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 }
      );
    }
    const integrityToken = (await tokenRes.text()).trim();

    // magic link로 회원가입(=newsletter 구독) 요청
    const res = await fetch(`${ghostUrl}/members/api/send-magic-link/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        emailType: "signup",
        integrityToken,
      }),
    });

    if (res.ok || res.status === 201) {
      return NextResponse.json({ message: "구독 신청이 완료됐습니다." }, { status: 200 });
    }

    // 이미 구독한 경우
    if (res.status === 409) {
      return NextResponse.json(
        { message: "이미 구독 중인 이메일입니다." },
        { status: 409 }
      );
    }

    const errorText = await res.text();
    console.error("Ghost API error:", res.status, errorText);
    return NextResponse.json(
      { message: "구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
