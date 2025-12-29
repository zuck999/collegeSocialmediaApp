import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react';
import { useLogin } from '@/api/user/mutation';

function index() {

	const { mutate, isPending } = useLogin();

	const [input, setInput] = useState({
		email: "",
		password: ""
	});

	function changeEventHandler(e: any) {
		setInput({ ...input, [e.target.name]: e.target.value });
	}

	function loginHandler(e: any) {

		e.preventDefault();

		mutate(input, {
			onSuccess: (data) => {
				toast.success(data.message)

				setInput({
					email: "",
					password: "",
				});

				// navigate("/")   // if using router
			},

			onError: (error) => {
				toast.error(error.message || "Login failed");
			},
		});
	}


	return (
		<>

			<div className='flex items-center w-screen h-screen justify-center'>
				<form onSubmit={loginHandler} className='shadow-xl shadow-rose-100 flex flex-col gap-5 p-8 rounded-lg'>

					<div>
						<h1 className='text-center font-bold'>LOGO</h1>
						<p className='text-center px-14'>login to see friends</p>
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
							<Button>
								<Loader2 className="animate-spin" />
							</Button>
						) : (
							<Button type="submit">Submit</Button>
						)
					}

					<span>don't have an account? <Link className='text-blue-600' to="/signup">signup</Link></span>

				</form>
			</div>

		</>
	)
}

export default index;