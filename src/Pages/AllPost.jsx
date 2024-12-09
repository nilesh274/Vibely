import React, { useState, useEffect } from 'react';
import { PostCard } from '../components';
import appwriteService from '../appwrite/Config';

const AllPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        appwriteService.getAllPost([]).then((response) => {
            if (response) {
                setPosts(response.documents);
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="text-center text-2xl dark:bg-black dark:text-slate-200 py-32">Wait a seconds...</div>;
    }

    if(posts.length == 0){
        return (
            <div className='my-48'>
            <p className='text-center text-md sm:text-lg md:text-xl lg:text-3xl font-sans font-semibold'>Share your Special movement of life</p>
            <p className='text-center text-sm sm:text-md md:text-lg lg:text-2xl font-sans'>App does not have any Post......</p>
            </div>
        )
    }

    return (
        <div className="p-15 dark:bg-[#000000]">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-sans dark:text-slate-200 p-10">All Post</p>
            <div className="pb-20 p-5 max-w-6xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                    {posts.map((post) => (
                        <PostCard key={post.$id} {...post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllPost;