import Portkey from "../assets/svg/Portkey.svg";
import Image from "next/image";

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Image src={Portkey} alt="Portkey logo" />
      <h1 className="text-[#25272A] text-[36px] leanding-[28px] font-medium text-center text-primary my-[16px] mt-[32px] ">
        Welcome to Portkey
      </h1>
    </div>
  );
}
