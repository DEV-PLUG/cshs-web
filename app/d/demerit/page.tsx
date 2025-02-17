import Menu from "@components/menu";
import Link from "next/link";
import DemeritOverview from "./overview";

export default function Home() {
  return (
    <main className="flex w-full min-h-screen relative overflow-hidden">
      <Menu/>
      <div className="w-full absolute left-[320px] drop-shadow-2xl z-10 h-[100vh] bg-white"></div>
      <div className="h-[100vh] bg-white z-10 w-full md:border-l-[1px] border-lightgray-100 p-10 overflow-auto relative">
        <div className="flex justify-between w-full mb-8">
          <div className="flex space-x-7 h-[46px] items-center">
            <Link href='/demerit'>
              <div className="font-bold text-3xl text-zinc-800 cursor-pointer">벌점</div>
            </Link>
            <Link href='/demerit/list'>
              <div className="font-bold text-3xl text-lightgray-100 cursor-pointer">내역</div>
            </Link>
          </div>
        </div>
        <div className="w-full h-[1px] my-5 bg-lightgray-100"></div>
        <div className="mt-8 flex justify-between space-x-5">
          <DemeritOverview/>
          {/* <div className="w-[350px] space-y-3"></div> */}
        </div>
      </div>
    </main>
  );
}
