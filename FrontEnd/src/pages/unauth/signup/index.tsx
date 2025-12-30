import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSignup } from '@/api/common/mutation';
import { Link } from '@tanstack/react-router';

function Signup() {
    //   const navigate = useNavigate(); 
    const { mutate, isPending } = useSignup();

    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        faculty: ""
    });

    function changeEventHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    function signupHandler(e: React.FormEvent) {
        e.preventDefault();

        mutate(input, {
            onSuccess: (res: any) => {
                toast.success(res.message);
                setInput({
                    username: '',
                    email: "",
                    password: "",
                    faculty: ""
                });
                // navigate('/login');
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || "Something went wrong");
            },
        });
    }

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-xl shadow-rose-100 flex flex-col gap-5 p-8 rounded-lg'>
                <div>
                    <h1 className='text-center font-bold'>LOGO</h1>
                    <p className='text-center px-14'>login to see friends</p>
                </div>

                <div>
                    <span className="py-2 font-medium ">username</span>
                    <Input type="text" value={input.username} name="username" onChange={changeEventHandler} className="focus-visible:ring-transparent" />
                </div>

                <div>
                    <Select required onValueChange={(value: any) => setInput({ ...input, faculty: value })}>
                        <SelectTrigger className="w-full" >
                            <SelectValue placeholder="Faculty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bca">BCA</SelectItem>
                            <SelectItem value="csit">CSIT</SelectItem>
                            <SelectItem value="bsc">BSC</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <span className="py-2 font-medium">email</span>
                    <Input type="email" value={input.email} name="email" onChange={changeEventHandler} className="focus-visible:ring-transparent" />
                </div>

                <div>
                    <span className="py-2 font-medium">password</span>
                    <Input type="password" value={input.password} name='password' onChange={changeEventHandler} className="focus-visible:ring-transparent" />
                </div>

                {
                    isPending ? (
                        <Button><Loader2 className='animate-spin' /></Button>
                    ) : (
                        <Button type="submit">Submit</Button>
                    )
                }

                <span>already has an account? <Link className='text-blue-600' to="/login">login</Link></span>
            </form>
        </div>
    )
}

export default Signup;
