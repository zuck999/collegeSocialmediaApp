import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MessageCircle, 
  Settings,
  MessageSquare
} from "lucide-react";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from '@/redux/authSlice';

function Profile() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = params.id;
  
  useGetUserProfile(userId);
  const { userprofile, user } = useSelector((store) => store.auth);

  const isLoginUserProfile = user?._id === userprofile?._id;
  const [activeTab, setActiveTab] = useState('posts');

  const handleChatClick = () => {
    dispatch(setSelectedUser(userprofile));
    navigate('/chat');
  };

  const displayedPost = activeTab === 'posts' 
    ? userprofile?.post || [] 
    : userprofile?.bookmarks || [];

  const postCount = userprofile?.post?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="flex items-start gap-6 mb-8 pb-8 border-b">
        {/* Avatar */}
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage 
            src={userprofile?.profilePicture} 
            alt={userprofile?.username}
          />
          <AvatarFallback className="text-2xl font-semibold ">
            {userprofile?.username?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">
              {userprofile?.username || 'username'}
            </h1>
            
            {isLoginUserProfile ? (
              <Link to="/account/edit">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={handleChatClick}
                size="sm"
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mb-4">
            <div>
              <span className="font-semibold">{postCount}</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">posts</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="font-semibold mb-1">
              {userprofile?.fullName || userprofile?.username}
            </p>
            {userprofile?.bio && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {userprofile.bio}
              </p>
            )}
            {userprofile?.hobby && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {userprofile.hobby}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'posts'
              ? 'border-black dark:border-white text-black dark:text-white'
              : 'border-transparent text-gray-400'
          }`}
        >
          POSTS
        </button>
        {/* <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'saved'
              ? 'border-black dark:border-white text-black dark:text-white'
              : 'border-transparent text-gray-400'
          }`}
        >
          SAVED
        </button> */}
      </div>

      {/* Posts Grid */}
      {displayedPost.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {displayedPost.map((post) => (
            <div
              key={post?._id}
              className="relative aspect-square cursor-pointer group"
            >
              <img
                src={post?.image}
                alt="post"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
                <div className="flex items-center gap-1">
                  <Heart className="h-5 w-5 fill-white" />
                  <span className="font-semibold">{post?.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-5 w-5 fill-white" />
                  <span className="font-semibold">{post?.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">
            {activeTab === 'posts' ? 'No posts yet' : 'No saved posts'}
          </p>
        </div>
      )}
    </div>
  );
}

export default Profile;