import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';

function Header() {

    const [len, setLen] = useState(false);
     const {user} = useSelector(store=>store.auth)

  return (
        <header className='fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between px-8 py-2 '>
			<div className="w-full ">
				<div className="flex justify-between">
					<div>
						<div className=" flex items-center 2xsm:gap-3 gap-2 h-full ">
							    <h1 className="font-extrabold  pl-3 text-xl">
                                    <Link to="/" className="text-blue-500">Connected</Link>
                                </h1>
						</div>
					</div>

					<div className="max-sm:hidden flex items-center justify-center bg-zinc-100  rounded-3xl w-[500px] h-10 ">
						<Search
							size={23}
							strokeWidth={2.5}
							className={`text-gray-300 m-2  ${len ? "hidden" : ""}`}
						/>
						<Input
							className={`${len ? "mx-5" : "px-1"} placeholder:text-gray-400  border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-bold text-gray-600 p-0`}
							onChange={(e) => {
								e.target.value.length > 0 ? setLen(true) : setLen(false);
							}}
							placeholder="Search"
						/>
					</div>

						<div className="flex items-center 2xsm:gap-3 gap-2 h-full ">
                            <Avatar className="">
                                <AvatarImage
                                    src={user?.profilePicture || "https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg"}
                                />
                                <AvatarFallback />
                            </Avatar>
                        </div>

				</div>
			</div>
		</header>
  )
}

export default Header;
