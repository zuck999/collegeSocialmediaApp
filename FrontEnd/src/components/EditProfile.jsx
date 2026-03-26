import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input"; // Ensure you have Input from shadcn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";

function EditProfile() {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [loding, setLoding] = useState(false);
  
  const [input, setInput] = useState({
    profilepicture: user?.profilepicture,
    hobby: user?.hobby || "",
    gender: user?.gender || "",
    dov: user?.dov || "" // Added DOV to state
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput({ ...input, profilepicture: file });
    }
  }

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value })
  }

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append('hobby', input.hobby);
    formData.append('gender', input.gender);
    formData.append('dov', input.dov); // Append DOV to formData
    
    if (input.profilepicture && typeof input.profilepicture !== 'string') {
      formData.append("profilepicture", input.profilepicture);
    }

    try {
      setLoding(true);
      const res = await axios.post("http://localhost:8000/api/v1/user/profile/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        // Sync Redux with the full updated user object from backend
        dispatch(setAuthUser(res.data.user)); 
        navigate(`/profile/${user?._id}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoding(false);
    }
  }

  return (
    <div className="flex max-w-2xl mx-auto pl-10 py-10">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="font-bold text-2xl tracking-tight">Edit Profile</h1>
        
        {/* Profile Picture Section */}
        <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={user?.profilepicture} />
              <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <p className="text-xs text-gray-500">Update your photo</p>
            </div>
          </div>
          <input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden" />
          <Button variant="outline" size="sm" onClick={() => imageRef.current.click()}>
            Change Photo
          </Button>
        </div>

        {/* Hobby Section */}
        <div className="space-y-2">
          <h1 className="text-sm font-semibold text-gray-700">Hobby</h1>
          <Textarea 
            value={input.hobby} 
            onChange={(e) => setInput({ ...input, hobby: e.target.value })} 
            placeholder="Tell us what you like..."
          />
        </div>

        {/* Date of Birth Section */}
        <div className="space-y-2">
          <h1 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" /> Date of Birth
          </h1>
          <Input 
            type="date" 
            value={input.dov} 
            onChange={(e) => setInput({ ...input, dov: e.target.value })} 
            className="w-full md:w-[250px]"
          />
        </div>

        {/* Gender Section */}
        <div className="space-y-2">
          <h1 className="text-sm font-semibold text-gray-700">Gender</h1>
          <Select defaultValue={input?.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={editProfileHandler} 
            className="bg-blue-600 hover:bg-blue-700 w-32"
            disabled={loding}
          >
            {loding ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default EditProfile;