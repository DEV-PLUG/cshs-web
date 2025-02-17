import Button from "@components/button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="md:block w-[100vw] h-[100vh]">
        {children}
      </div>
      <div className="md:hidden hidden">
        {/* 모바일 뷰 */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col w-full">
          <svg className="w-14 h-14 stroke-lightgray-200" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
          <div className="font-bold text-xl text-lightgray-200 mt-5">모바일 앱을 이용해주세요</div>
          <div className="text-lightgray-200 mt-1 text-center w-full">휴대폰이나 태블릿으로 이용중인 경우<br/>모바일 앱을 이용해주세요.</div>
        </div>
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col w-full">
          <div className="max-w-[380px] w-full">
            <Button color="blue">
              모바일 앱 다운로드
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
