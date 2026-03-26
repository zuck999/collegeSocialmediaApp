import { Bell, Search, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import axios from 'axios';

function Header() {
    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchText.trim().length > 0) {
                setLoading(true);
                try {
                    const res = await axios.get(`http://localhost:8000/api/v1/user/search?query=${searchText}`, { withCredentials: true });
                    if (res.data.success) {
                        setResults(res.data.users);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchText]);

    const handleUserClick = (userId) => {
        setSearchText("");
        setResults([]);
        navigate(`/profile/${userId}`);
    };

    return (
        <header className='fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between px-8 py-2 bg-white/80 backdrop-blur-md border-b'>
            <div className="w-full ">
                <div className="flex justify-between items-center">
                    
                    {/* LOGO */}
                    <div>
                        <div className="flex items-center gap-2 h-full">
                            <h1 className="font-extrabold pl-3 text-xl">
                                <Link to="/" className="text-blue-500">Connected</Link>
                            </h1>
                        </div>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="relative max-sm:hidden flex items-center justify-center bg-zinc-100 rounded-3xl w-[500px] h-10 px-4">
                        {loading ? (
                            <Loader2 size={20} className="text-gray-300 animate-spin mr-2" />
                        ) : (
                            <Search size={23} strokeWidth={2.5} className="text-gray-300 mr-2" />
                        )}
                        <Input
                            className="placeholder:text-gray-400 border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-bold text-gray-600 p-0 h-full"
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />

                        {/* DROPDOWN RESULTS */}
                        {results.length > 0 && (
                            <div className="absolute top-12 w-full bg-white border rounded-2xl shadow-xl overflow-hidden z-[60]">
                                <ScrollArea className="max-h-80">
                                    {results.map((u) => (
                                        <div 
                                            key={u._id}
                                            onClick={() => handleUserClick(u._id)}
                                            className="flex items-center gap-3 p-3 hover:bg-zinc-50 cursor-pointer border-b last:border-0 group"
                                        >
                                            <Avatar className="h-9 w-9 border">
                                                <AvatarImage src={u.profilePicture} />
                                                <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                                                    {u.username[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            
                                            <div className="flex flex-col flex-1">
                                                <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                    {u.username}
                                                </span>
                                                {/* Batch and Faculty metadata */}
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                                                    <span>{u.faculty || "BCA"}</span>
                                                    <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                                                    <span> {u.batch || "2080"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </ScrollArea>
                            </div>
                        )}
                    </div>

                    {/* RIGHT ICONS */}
                    <div className="flex items-center 2xsm:gap-3 gap-6 h-full ">
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="relative cursor-pointer">
                                    <Bell />
                                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 p-0 text-[10px] text-white">
                                        9
                                    </Badge>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end">
                                <div className="p-4 font-bold border-b text-sm uppercase text-gray-400">Notifications</div>
                                <ScrollArea className="h-72">
                                    <div className="p-8 text-center text-gray-500 text-sm italic">No new notifications</div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>

                        <Link to={`/profile/${user?._id}`}>
                            <Avatar className="cursor-pointer">
                                <AvatarImage
                                    src={user?.profilePicture || "https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg"}
                                />
                                <AvatarFallback className="bg-blue-500 text-white font-bold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    </div>

                </div>
            </div>
        </header>
    );
}

export default Header;