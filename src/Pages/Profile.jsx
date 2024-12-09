import React, { useEffect, useState } from 'react';
import { userImage } from '../components/index'
import appwriteService from '../appwrite/Config'
import { ProfilePost } from '../components';
import authService from '../appwrite/Auth';

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const [followersDetails, setFollowersDetails] = useState([]);
    const [followingDetails, setFollowingDetails] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleFollow, setIsVisibleFollow] = useState(false);
    const [follower, setFollower] = useState(0);
    const [following, setFollowing] = useState(0);
    const [userData, setUserData] = useState({});
    const [photo, setPhoto] = useState("");

    useEffect(() => {
        const getcurrentuser = async () => {
            const user = await authService.getCurrentUser();
            setUserData(user)
        }
        getcurrentuser();
    }, [])

    useEffect(() => {
        const ProfileP = async () => {
            const Avatar = await appwriteService.getAuthUser(userData?.$id);
            // console.log(Avatar);
            setPhoto(Avatar.ProfilePhoto);
            // console.log(photo);
        }
        ProfileP();
    }, [userData?.$id])

    useEffect(() => {
        if (userData?.$id) {
            const getPost = async () => {
                await appwriteService.getAllPosts().then((posts) => {
                    if (posts) {
                        setPosts(posts.documents);
                    }
                });
            };
            getPost();
        }
    }, [userData?.$id]);

    useEffect(() => {
        if (userData?.$id) {
            const getUser = async () => {
                const userDetail = await appwriteService.getUserDetails(userData?.$id);
                setFollower(userDetail.follower.length);
                setFollowing(userDetail.following.length);
            };
            getUser();
        }
    }, [userData?.$id]);

    const userPost = posts.filter(post => post.userId === userData?.$id);
    const postCnt = userPost.length;

    const handleFollower = async () => {
        if (userData?.$id) {
            let User = await appwriteService.getUserDetails(userData?.$id);
            if (User) {
                const followerDetailsPromises = User.follower.map(async (followerId) => {
                    return await appwriteService.getAuthUser(followerId);
                });
                const followers = await Promise.all(followerDetailsPromises);
                setFollowersDetails(followers);
            }
            setIsVisible(!isVisible);
        }
    };

    const handlefollowing = async () => {
        if (userData?.$id) {
            let User = await appwriteService.getUserDetails(userData?.$id);
            if (User) {
                const followerDetailsPromises = User.following.map(async (followerId) => {
                    return await appwriteService.getAuthUser(followerId);
                });
                const follow = await Promise.all(followerDetailsPromises);
                setFollowingDetails(follow);
                
            }
            setIsVisibleFollow(!isVisibleFollow);
        }
    };

    return (
        <div className="dark:bg-[#000000] p-5 sm:p-7 md:p-8 lg:p-10">
            <div className='shadow-2xl p-5 md:p-8 border-[1px] rounded-2xl dark:bg-[#1a1b33] dark:border-none'>
                <div className='flex mr-auto flex-wrap lg:gap-96 justify-center items-center'>
                    <div className='flex gap-5 lg:gap-15 items-center pb-10 mr-auto mb-7'>
                        <img src={photo || userImage} alt="Profile Photo" className='bg-white dark:text-white rounded-full h-[35px] w-[35px] sm:h-[40px] sm:w-[40px] md:h-[45px] md:w-[45px] lg:w-[50px] lg:h-[50px] hover:scale-105 duration-1000 dark:hover:scale-110' />
                        <div>
                            <p className='text-[12px] sm:text-lg md:text-xl lg:text-2xl font-bold font-sans dark:text-slate-200'>{userData?.name || "userName"}</p>
                            <p className='font-semibold font-sans text-sm sm:text-[12px] md:text-lg lg:text-xl dark:text-slate-200'>{userData?.email || "userEmail"}</p>
                        </div>
                    </div>
                    <div className='flex gap-14 pb-16'>
                        <button className='bg-[#1980e6] p-2 md:p-4 text-sm sm:text-base md:text-[12px] lg:text-lg border-[1px] border-blue-500 hover:bg-transparent rounded-xl duration-500 font-sans font-semibold h-10 md:h-14 flex justify-center items-center shadow-md dark:hover:text-blue-500' onClick={handlefollowing}>{following}  Following</button>
                        <button className='hover:bg-[#1980e6] p-2 md:p-4 text-sm sm:text-base md:text-[12px] lg:text-lg border-[1px] border-blue-500 bg-transparent rounded-xl duration-500 font-sans font-semibold h-10 md:h-14 flex justify-center items-center shadow-md dark:text-blue-500 dark:hover:text-black' onClick={handleFollower}>{follower} Follower</button>
                    </div>
                </div>
                {isVisible && (
                    <div className='border-[1px] rounded-xl mb-6 px-5 h-auto py-5 shadow-xl mx-auto w-auto'>
                        <span className='font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl dark:text-slate-200'>Follower</span>
                        {followersDetails.length <= 0 && (
                            <p className='justify-center text-center m-4 md:m-20 text-sm sm:text-[12px] md:text-lg lg:text-xl dark:text-slate-200'>You do not have any followers.......</p>
                        )}
                        {followersDetails.map((follower) => (
                            <div className='flex items-center mx-auto mt-5'>
                                <img src={follower.ProfilePhoto} alt="" className='w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white' />
                                <p key={follower.$id} className='ml-4 text-[12px] sm:text-lg md:text-xl lg:text-2xl font-semibold dark:text-slate-200'>{follower.Name}</p>
                            </div>
                        ))}
                    </div>
                )}
                <div>
                </div>
                {isVisibleFollow && (
                    <div className='border-[1px] rounded-xl mb-6 px-5 h-auto py-5 shadow-xl mx-auto'>
                        <span className='font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl dark:text-slate-200'>Following</span>
                        {followingDetails.length <= 0 && (
                            <p className='justify-center text-center m-4 md:m-20 text-sm sm:text-[12px] md:text-lg lg:text-xl dark:text-slate-200'>You are not following anyone......</p>
                        )}
                        {followingDetails.map((following) => (
                            <div className='flex items-center mx-auto mt-5'>
                                <img src={following.ProfilePhoto} alt="" className='w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white' />
                                <p key={following.$id} className='ml-4 text-[12px] sm:text-lg md:text-xl lg:text-2xl font-semibold dark:text-slate-200'>{following.Name}</p>
                            </div>
                        ))}
                    </div>
                )}
                <div>
                    <button
                        className='text-sm sm:text-base md:text-[12px] lg:text-lg bg-blue-500 hover:scla px-4 py-2 rounded-xl font-semibold h-auto flex justify-center items-center ml-5'>
                        {postCnt} post
                    </button>
                    {postCnt === 0 && (
                        <div className='my-48'>
                            <p className='text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-sans font-semibold dark:text-slate-200'>Start posting images on vibely</p>
                            <p className='text-center text-[12px] sm:text-lg md:text-xl lg:text-2xl font-sans dark:text-slate-200'>You not upload any post</p>
                        </div>
                    )}
                </div>
                <div class="grid grid-cols-4 md:grid-cols-5 gap-2 mx-5 sm:mx-16 h-auto mt-10">
                    {posts.length !== 0 && (posts.map((post) => {
                        const isAuthor = post && userData ? post.userId === userData?.$id : false;
                        return isAuthor ? (
                            <ProfilePost {...post} />
                        ) : null;
                    }))}
                </div>
            </div>
        </div>
    )
};

export default Profile;