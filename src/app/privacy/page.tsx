import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "개인정보 처리방침 — komki",
  description:
    "콤키(komki) 뉴스레터 구독과 관련해 수집하는 개인정보 항목, 이용 목적, 보유 기간과 이용자의 권리를 안내합니다.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── 헤드라인 ── */}
      <section className="bg-[#FBF8F1] py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h1 className="font-paperlogy font-semibold text-2xl md:text-4xl text-black">
            개인정보 처리방침
          </h1>
          <p className="mt-3 font-paperlogy text-sm md:text-base text-[#3F1C03]">
            시행일자 2026년 9월 7일
          </p>
        </div>
      </section>

      {/* ── 본문 ── */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-8 komki-prose">
          <p>
            사단법인 한국마케팅진흥원(이하 &quot;회사&quot;)이 운영하는 콤키(komki,
            komki.co.kr) 뉴스레터 서비스(이하 &quot;서비스&quot;)는 「개인정보 보호법」
            등 관련 법령을 준수하며, 이용자의 개인정보를 보호하고 관련 고충을
            신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을
            수립·공개합니다.
          </p>

          <h2>1. 수집하는 개인정보 항목 및 수집 방법</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2 pr-4 font-semibold">구분</th>
                  <th className="text-left py-2 pr-4 font-semibold">수집 항목</th>
                  <th className="text-left py-2 font-semibold">수집 방법</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black/15">
                  <td className="py-2 pr-4 align-top">뉴스레터 구독</td>
                  <td className="py-2 pr-4 align-top">이메일 주소</td>
                  <td className="py-2 align-top">
                    홈페이지 구독 폼을 통한 이용자의 직접 입력
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            그 외 이름, 연락처, 사업자등록번호 등은 수집하지 않습니다. 서비스
            이용 과정에서 IP 주소 등이 자동으로 발생·수집될 수 있으나, 개별
            이용자를 식별하는 형태로 저장·이용하지 않습니다.
          </p>

          <h2>2. 개인정보의 수집 및 이용 목적</h2>
          <ul>
            <li>콤키 뉴스레터(콘텐츠·트렌드 정보) 발송</li>
            <li>광고성 정보(뉴스레터) 전송에 대한 사전 동의 확인 및 수신거부 처리</li>
          </ul>

          <h2>3. 개인정보의 보유 및 이용 기간</h2>
          <p>
            회사는 개인정보 수집·이용 목적이 달성된 후에는 해당 정보를 지체
            없이 파기합니다. 구체적으로 이메일 주소는 <strong>뉴스레터 수신동의를
            철회(구독 해지)한 때</strong>까지 보유하며, 철회 시 지체 없이 파기합니다.
          </p>
          <p>
            {"{확인 필요: 철회 후 실제 파기까지 소요되는 구체적 기간(예: 철회 후 O일 이내)을 운영 정책으로 확정해 명시}"}
          </p>

          <h2>4. 개인정보의 제3자 제공</h2>
          <p>
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
            다만 법령에 특별한 규정이 있거나 수사 목적으로 법령에서 정한
            절차와 방법에 따라 수사기관의 요구가 있는 경우는 예외로 합니다.
          </p>

          <h2>5. 개인정보 처리업무의 위탁</h2>
          <p>회사는 서비스 운영을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2 pr-4 font-semibold">수탁업체</th>
                  <th className="text-left py-2 font-semibold">위탁업무 내용</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black/15">
                  <td className="py-2 pr-4 align-top">Ghost Foundation (Ghost(Pro))</td>
                  <td className="py-2 align-top">뉴스레터 구독자 관리 및 메일 발송 대행</td>
                </tr>
                <tr className="border-b border-black/15">
                  <td className="py-2 pr-4 align-top">Vercel Inc.</td>
                  <td className="py-2 align-top">웹사이트(komki.co.kr) 호스팅 및 서버 운영</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>6. 개인정보의 국외 이전</h2>
          <p>
            위 제5조의 수탁업체는 해외에 서버를 두고 있을 수 있어, 이 경우
            이용자의 개인정보가 국외로 이전되어 처리될 수 있습니다.
          </p>
          <p>
            {"{확인 필요: Ghost(Pro)의 실제 데이터 처리 국가, Vercel 배포 리전을 확인한 뒤 이전 항목·이전 국가·이전 일시 및 방법·이전받는 자의 개인정보 보유·이용 기간을 구체적으로 명시}"}
          </p>

          <h2>7. 정보주체의 권리·의무 및 행사 방법</h2>
          <p>
            이용자는 언제든지 자신의 개인정보 열람·정정·삭제, 처리정지, 뉴스레터
            수신동의 철회를 요구할 수 있습니다. 권리 행사는 아래 방법으로 할 수
            있습니다.
          </p>
          <ul>
            <li>매 발송 메일 하단의 <strong>수신거부</strong> 링크 클릭</li>
            <li>이메일 <a href="mailto:info@komki.co.kr">info@komki.co.kr</a>로 문의</li>
          </ul>

          <h2>8. 개인정보의 파기 절차 및 방법</h2>
          <p>
            회사는 개인정보 보유기간이 경과하거나 처리 목적이 달성된 경우
            전자적 파일 형태의 개인정보를 복구·재생할 수 없는 방법으로 지체
            없이 삭제합니다.
          </p>

          <h2>9. 개인정보 보호책임자</h2>
          <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위해 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          <ul>
            <li>회사: 사단법인 한국마케팅진흥원</li>
            <li>성명: 김가은</li>
            <li>연락처: {"{확인 필요: 개인정보 보호책임자 전화번호·이메일}"}</li>
            <li>서비스 문의: <a href="mailto:info@komki.co.kr">info@komki.co.kr</a></li>
          </ul>

          <h2>10. 고지의 의무</h2>
          <p>
            이 개인정보 처리방침의 내용을 추가·삭제 및 수정이 있을 시에는
            시행일로부터 최소 7일 전에 홈페이지 공지사항을 통해 고지합니다.
          </p>

          <h2>부칙</h2>
          <p>이 방침은 2026년 9월 7일부터 시행합니다.</p>

          <hr className="!my-8 border-black/10" />

          <p className="text-sm text-[#3F1C03]">
            사단법인 한국마케팅진흥원 · 대표 김영선 · 사업자등록번호
            569-82-00086
            <br />
            {"{확인 필요: 사업자등록상 주소가 한국마케팅진흥원 홈페이지 표기(서울시 중구 퇴계로 212-13 2층)와 콤키 표기 주소(서울시 종로구 종로 325, 글라스타워 702호)가 서로 달라 어느 쪽을 처리방침에 표기할지 확정 필요 — 우선 콤키 표기 주소를 사용}"}
            <br />
            서울시 종로구 종로 325, 글라스타워 702호 · 대표전화 02-743-7310 ·
            이메일 <a href="mailto:info@komki.co.kr">info@komki.co.kr</a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
