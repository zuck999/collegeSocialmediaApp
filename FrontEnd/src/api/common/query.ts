import { useQuery } from '@tanstack/react-query';
import { commonApi } from '@/api/common/api'; 

export const useAllPosts = () => {
  return useQuery({
    queryKey: ['allPosts'],
    queryFn: () => commonApi.posts.getAllPost(),
    staleTime: 1000 * 60 * 5,// optional: cache for 5 minutes
  });
};

export const useLikeDisLike = (postId: string,action: "like" | "dislike") => {
  return useQuery({
    queryKey: ['likeDislike', postId], // include postId so each post has a separate cache
    queryFn: () => commonApi.posts.likeDislike(postId,action),
    enabled: !!postId, // only run if postId exists
  });
};

