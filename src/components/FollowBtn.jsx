import React, { useEffect, useState } from 'react';
import authService from '../appwrite/Auth'
import { useNavigate } from 'react-router-dom';
import appwriteService from '../appwrite/Config'

const FollowBtn = ({ userId, slug }) => {
  const [isFollow, setIsFollow] = useState(false);
  const navigate = useNavigate();
  const [message, setmessage] = useState();

  useEffect(() => {
    const checkIfFollowing = async () => {
      try {
        let postUser = await appwriteService.getUserDetails(userId);

        if (!postUser) {
          postUser = await appwriteService.createUserDetails(userId);
        }

        const currentUser = await authService.getCurrentUser();

        if (postUser?.follower?.includes(currentUser.$id)) {
          setIsFollow(true);
        } else {
          setIsFollow(false);
        }
      } catch (error) {
        console.error('Error in FollowBtn:', error);
      }
    };
    checkIfFollowing();
  }, [isFollow, userId, message]);


  const handleFollower = async () => {
    try {
      const post = await appwriteService.getPost(slug);
      console.log(post);
      
      const currentUser = await authService.getCurrentUser();
      let PostUser = await appwriteService.getUserDetails(userId);
      let currentUserDetails = await appwriteService.getUserDetails(currentUser.$id);

      const newFollower = PostUser.follower || [];
      const newFollowing = currentUserDetails.following || [];
      
      if (isFollow) {
        //unFollow
        const updatedFollower = newFollower.filter(id => id !== currentUser.$id);
        await appwriteService.updateUserDetails(userId, { follower: updatedFollower })

        const currentUserUpdateFollowing = newFollowing.filter(id => id !== userId);
        await appwriteService.updateUserDetails(currentUser.$id, {following: currentUserUpdateFollowing})
        setmessage(<div className='items-center text-center justify-center dark:text-black'>
          <p className='text-sm sm:text-[12px] md:text-lg lg:text-xl'>Connection removed. You won't see updates from <span className='font-bold dark:text-black'>"{PostUser.UserName}"</span></p>
        </div>);
        setTimeout(() => {
          navigate('/profile');
        }, 3000);

      } else {
        //Follow
        const PostupdateFollower = [...newFollower, currentUser.$id];
        await appwriteService.updateUserDetails(userId, { follower: PostupdateFollower })

        const currentUserUpdateFollowing = [...newFollowing, userId];
        await appwriteService.updateUserDetails(currentUser.$id, { following: currentUserUpdateFollowing })
        setmessage(<div className='items-center text-center justify-center dark:text-black'>
          <p className='text-sm sm:text-[12px] md:text-lg lg:text-xl'>"You've started following <span className='font-bold dark:text-black text-justify'>"{PostUser.UserName}"</span>! Explore their world."</p>
        </div>);
        setTimeout(() => {
          navigate(`/post/${post.$id}`);
        }, 3000);
      }
      setIsFollow(!isFollow);
      setTimeout(() => {
        setmessage('');
      }, 3000);
    } catch (error) {
      console.log("FollowBtn :: handleFollower :: error", error);
    }
  }


  return (
    <>
      {message && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 dark:bg-white text-white text-sm sm:text-md md:text-lg lg:text-2xl px-6 py-3 rounded-md z-50">
          {message}
        </div>
      )}
      <button 
        onClick={handleFollower} 
        className="bg-[#1980e6] text-white h-10 text-xs sm:text-sm md:text-md lg:text-lg border-[1px] border-blue-500 rounded-xl px-3 lg:px-4 hover:bg-blue-700 duration-300">
        {isFollow ? 'Unfollow' : 'Follow'}
      </button>
    </>
  );


}
export default FollowBtn;