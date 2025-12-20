import { nanum , abyssinica } from "@/util/font";
import { QrCodeIcon } from "@heroicons/react/16/solid";
import { BookOpenIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { ComponentType, SVGProps } from "react";


export default async function Home() {
  await connection();
  return (
   <div className="relative w-screen h-screen bg-secondary flex flex-col justify-between overflow-y-auto">
      <Image alt="wave photo" src={"/wave.svg"} width={1000} height={1000} className="w-screen h-auto" />
      <p className={nanum.className + " absolute text-secondary top-8 left-13 text-[clamp(20px,3.5vw,58px)] [-webkit-text-stroke:1px]"} >Mala Maocai</p>
      <Image alt="Chef cartoon" src={"/chinese-Chef.png"} width={800} height={800} className="absolute top-3 right-10 w-[20vw] h-auto" />
      <div className="flex justify-center items-center gap-5 py-10" >
        <Link href={"/main?tableId=69456b57067d64620431326f"} >
          <button className={abyssinica.className + " bg-primary px-3 py-2 rounded-md text-2xl text-secondary cursor-pointer hover:bg-primary/80" } >Order</button>
        </Link>
        <Link href={"/dashboard"} >
          <button className={abyssinica.className + " bg-primary px-3 py-2 rounded-md text-2xl text-secondary cursor-pointer hover:bg-primary/80" } >Dashboard</button>
        </Link>
      </div>
      <div className="flex justify-evenly items-center p-5">
        {prons.map(item => (
          <div key={item.id} className="flex flex-col items-center gap-2">
            <item.icon className="w-25 text-primary" />
            <p className={nanum.className + " text-[clamp(16px,1.6vw,30px)] text-center text-primary [-webkit-text-stroke:0.6px] "} >{item.firstPara}</p>
            <p className={nanum.className + " text-[clamp(16px,1.6vw,30px)] text-center text-primary [-webkit-text-stroke:0.6px]"} >{item.secondPara}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#602727] flex justify-between items-center text-secondary px-10 py-3">
        <div>
          <p className={nanum.className + " text-[clamp(16px,1.6vw,28px) italic"} >19 * 81 street</p>
          <p className={nanum.className + " text-[clamp(16px,1.6vw,28px) italic"} >Aung Myae Thar Zan</p>
          <p className={nanum.className + " text-[clamp(16px,1.6vw,28px) italic"} >contact@maocai.com</p>
          <p className={nanum.className + " text-[clamp(16px,1.6vw,28px) italic"} >+95 123 456 78</p>
        </div>

        <div className="flex flex-col gap-5">
          <Link href={"/main?tableId=69456b57067d64620431326f"} >
            <p className={nanum.className + " text-[clamp(16px,1.6vw,28px) italic underline underline-offset-3 cursor-pointer"} >Order</p>
          </Link>
          <Link href={"/dashboard"} >
            <p className={nanum.className + " text-[clamp(16px,1.6vw,28px) italic underline underline-offset-3 cursor-pointer"} >Dashboard</p>
          </Link>
        </div>
      </div>
   </div>
  );
}

interface PronType {
  id : number;
  icon : ComponentType<SVGProps<SVGSVGElement>>;
  firstPara : string;
  secondPara : string;
}

const prons : PronType[] = [
  {
    id : 0,
    icon : QrCodeIcon,
    firstPara : "Easily manage your menus with",
    secondPara : "Mala Maocai",
  },
  {
    id : 1,
    icon : BookOpenIcon,
    firstPara : "Scan and order.Quick and easy!",
    secondPara : "Your customer will love it!",
  },
  {
    id : 2,
    icon : ClipboardDocumentCheckIcon,
    firstPara : "Dashboard and order apps are include ",
    secondPara : "in every subscribtion",
  },
  
]
