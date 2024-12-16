import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `당신은 차량 대여 서비스의 AI 상담사입니다.
차량과 관련된 문의에 친절하고 전문적으로 답변해주세요.
답변은 간단명료하게 해주시고, 전문 용어는 쉽게 설명해주세요.
사용자의 안전과 편의를 최우선으로 고려해주세요.
예약 상태나 시간과 관련된 문의에도 정확하게 답변해주세요.
문제 상황 발생 시 고객센터 연락을 권유할 수 있습니다.`;

export async function POST(request: Request) {
  try {
    const { messages, vehicleInfo, reservationInfo } = await request.json();

    const contextMessage = `현재 문의 대상 정보:
차량 정보:
- 제조사: ${vehicleInfo.manufacturer}
- 모델: ${vehicleInfo.model}
- 위치: ${vehicleInfo.location}

예약 정보:
- 상태: ${reservationInfo.status}
- 예약 시작: ${reservationInfo.startTime}
- 이용 시간: ${reservationInfo.duration}시간
- 예약 번호: ${reservationInfo.id}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: contextMessage },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return NextResponse.json({
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error("OpenAI API 오류:", error);
    return NextResponse.json(
      { error: "답변 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}