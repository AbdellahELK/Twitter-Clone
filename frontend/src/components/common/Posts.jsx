import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
    const getPostsEndPoints = () => {
        switch (feedType) {
            case "forYou":
                return "/api/posts/all";
            case "following":
                return "/api/posts/following";
            case "posts":
                return `/api/posts/user/${username}`;
            case "likes":
                return `/api/posts/likes/${userId}`;
            default:
                return "/api/posts/all";
        }
    };

    const POST_ENDPOINTS = getPostsEndPoints();

    const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
        queryKey: ["posts", feedType],
        queryFn: async () => {
            const res = await fetch(POST_ENDPOINTS);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Something went wrong");
            }
            const data = await res.json();
            return data;
        },
    });

    useEffect(() => {
        refetch();
    }, [feedType, refetch,username])

    const posts = data?.posts || [];

    return (
        <>
            {(isLoading || isRefetching) && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {isError && (
                <p className='text-center my-4 text-red-500'>
                    {error.message}
                </p>
            )}
            {!isLoading && !isRefetching && posts.length === 0 && (
                <p className='text-center my-4'>No posts in this tab. Switch 👻</p>
            )}
            {!isLoading && !isRefetching && posts.map((post) => (
                <Post key={post._id} post={post} />
            ))}
        </>
    );
};

export default Posts;
