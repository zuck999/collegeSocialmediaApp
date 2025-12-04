import { Input } from "@/components/ui/input";
import { Ellipsis, Search } from "lucide-react";
import type React from "react";
import {  useState } from "react";

const Header: React.FC<React.ComponentProps<"header">> = ({ className }) => {
	const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

	const toggleApplicationMenu = () => {
		setApplicationMenuOpen(!isApplicationMenuOpen);
	};

	const [len , setLen] = useState<boolean>(false);

	return (
		<header//todo
			className={`fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between px-8 py-2 ${className}`}
		>
			<div className="w-full ">
				<div className="flex justify-between" >

					<div>
						<div className=" max-sm:hidden flex items-center 2xsm:gap-3 gap-2">
							Connected
						</div>
						<div className="sm:hidden">
							<Ellipsis onClick={toggleApplicationMenu} />
						</div>
					</div>

					<div className="max-sm:hidden flex items-center justify-center bg-zinc-100  rounded-3xl w-[500px] h-10 ">
							<Search size={23} strokeWidth={2.5} className={`text-gray-300 m-2  ${len?"hidden":""}`}/>
							<Input className={`${len?"mx-5":"px-1"} placeholder:text-gray-400  border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-bold text-gray-600 p-0`} onChange={(e)=>{e.target.value.length>0?setLen(true):setLen(false)}} placeholder="search"/>
					</div>

					<div className="max-sm:hidden ">
						<div className="flex items-center 2xsm:gap-3 gap-2">
							profile
						</div>
					</div>
				</div>

			</div>
		</header>
	);
};

export default Header;
