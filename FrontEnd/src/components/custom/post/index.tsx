import Post from './post';
import { useAllPosts } from '@/api/common/query';

function Posts() {
  const { data: posts, isLoading, isError } = useAllPosts();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts</div>;

  return (
    <div>
      {posts?.map((post: any) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}

export default Posts;
