import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/Config"; 
import { useSelector } from "react-redux";


const LikeBtn = ({slug}) => {
  const [islike, setIslike] = useState(false);
  const [Post, setPost] = useState({});

  const userData = useSelector(state => state.auth.userData ||{});
  useEffect(() => {
    appwriteService.getPost(slug).then((post) => {
      setPost(post)
    })
  }, [slug])

  useEffect(() => {    
    if (Post.like && Array.isArray(Post.like) && Post.like.includes(userData.$id)) {
      setIslike(true);
    }
  }, [Post])

  

  const handleLike = async (post) => {
    const updateLike = islike 
    ? Post.like.filter(id => id !== userData.$id) 
    : [...Post.like, userData.$id];

    try {
      await appwriteService.updateLike(slug, {
        ...post,
        like: updateLike
      });

      setPost((prevPost) => ({
        ...prevPost,
        like: updateLike,
      }));

    } catch (error) {
      console.log("updatedlike :: error",error);
    }
    setIslike(!islike);
    console.log(Post.like.length, Post.like);
  }
  
  
  return (
        <button
          onClick={handleLike}
          className={`flex items-center py-auto px-auto rounded-lg ${
            islike ? "text-blue-500" : "text-gray-700 dark:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 sm:w-6 sm:h-6 ${islike ? "fill-current" : null}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
          <span className="ml-1 text-lg sm:text-lg md:text-xl lg:text-2xl">{Post.like?.length}</span>
        </button>
      );
};


export default LikeBtn;
