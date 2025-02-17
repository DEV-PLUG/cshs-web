import Image from "next/image";

export default function School() {
  return (
    <div className="xl:px-2">
      <div className="xl:block hidden">
        <div className="w-full h-[1px] mb-5 mt-7 bg-lightgray-100"></div>
        <div className="flex space-x-3 px-4 py-4">
          <div className="w-[55px] h-[55px] flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[20px]">
            <Image
              src="/images/school/cshs.jpg"
              width={50}
              height={50}
              alt=""
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-bold text-lg text-zinc-800 -mb-1">창원과학고등학교</div>
            <div className="text-lightgray-200">Since 2011</div>
          </div>
        </div>
      </div>
      <div className="w-[50px] h-[50px] xl:hidden visible flex justify-center overflow-hidden items-center bg-white border-[1px] border-lightgray-100 rounded-[20px]">
        <Image
          src="/images/school/cshs.jpg"
          width={40}
          height={40}
          alt=""
        />
      </div>
    </div>
  )
}