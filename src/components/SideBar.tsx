import { BuildingStorefrontIcon, Cog6ToothIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

const SideBar = () => {
    return (
        <div className="flex flex-col gap-3 px-1.5 py-3 bg-[#cfe7e7] w-13 min-h-screen overflow-hidden transition-all duration-200 ease hover:w-49"  >
            {sideBarItems.map(item => (
                <Link href={item.url} key={item.id} className="no-underline" >
                    <div className="w-37 flex justify-start items-center gap-3.5 hover:bg-black/10 py-2 px-1 cursor-pointer rounded-lg">
                        <item.icon className="w-7" />
                        <p>{item.name}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default SideBar;

interface SideBarItemType {
    id : number;
    name : string;
    icon :  React.ComponentType<React.SVGProps<SVGSVGElement>>;
    url : string;
}

const sideBarItems : SideBarItemType[] = [
    {
        id : 1,
        name : "Modification",
        icon : BuildingStorefrontIcon,
        url : "/dashboard/modification"
    },
    {
        id : 2,
        name : "Settings",
        icon : Cog6ToothIcon,
        url : "/dashboard/setting"
    }
]