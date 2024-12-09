import React, { useEffect, useState } from 'react';
import appwriteService from '../appwrite/Config';
import { Link } from 'react-router-dom';
import LikeBtn from './LikeBtn';
import { useSelector } from 'react-redux';
import userImage from './image/userImage.jpg';
import { FollowBtn } from './index';

const PostCard = ({ $id, title, featuredImage, userName, userId }) => {
    const [userPost, setUserPost] = useState(false);
    const [postPhoto, setPostPhoto] = useState("");
    const userData = useSelector(state => state.auth.userData);

    useEffect(() => {
        const ProfileP = async () => {
            const Avatar = await appwriteService.getAuthUser(userId);
            setPostPhoto(Avatar.ProfilePhoto);
        }
        ProfileP();
    }, [userId])

    useEffect(() => {
        if (userData && userData.$id && userId) {
            setUserPost(userId === userData.$id);
        }
    }, [userId, userData]);

    return userPost ? (
        <div className="flex flex-col border-[1px] rounded-2xl w-full mx-auto p-4 dark:bg-[#1a1b33] h-auto">
            <Link to={`/post/${$id}`}>
                <div className="flex items-center mb-4">
                    <img src={postPhoto || userImage} alt="profilePhoto" className="bg-white dark:text-white h-7 w-7 sm:w-8 sm:h-8 md:w-8 md:h-8 rounded-full" />
                    <p className="ml-3 text-left font-bold text-xs sm:text-sm md:text-md lg:text-lg dark:text-slate-200">{userName}</p>
                </div>
                <img
                    src={appwriteService.getFilePreview(featuredImage)}
                    alt={title}
                    className="w-full h-40 sm:h-44 md:h-48 lg:h-52 object-cover hover:object-scale-down rounded-lg mb-4 dark:text-slate-200 text-black text-sm sm:text-md md:text-lg lg:text-xl"
                />
            </Link>
            <h2 className="text-sm sm:text-md md:text-lg lg:text-xl font-semibold text-left mb-2 dark:text-slate-200">{title}</h2>
            <div className="flex flex-wrap space-x-2 items-center w-full">
                <LikeBtn slug={$id} />
            </div>
        </div>
    ) : (
        <div className="flex flex-col border-[1px] rounded-2xl w-full mx-auto p-4 dark:bg-[#1a1b33] h-auto">
            <Link to={`/post/${$id}`}>
                <div className="flex items-center mb-4">
                    <img src={postPhoto || userImage} alt="profilePhoto" className="bg-white dark:text-white h-7 w-7 sm:w-8 sm:h-8 md:w-8 md:h-8 rounded-full" />
                    <p className="ml-3 text-left font-bold text-xs sm:text-sm md:text-md lg:text-lg dark:text-slate-200">{userName}</p>
                </div>
                <img
                    src={appwriteService.getFilePreview(featuredImage)}
                    alt={title}
                    className="w-full h-40 sm:h-44 md:h-48 lg:h-52 object-cover hover:object-scale-down rounded-lg mb-4 dark:text-slate-200 text-black text-sm sm:text-md md:text-lg lg:text-xl"
                />
            </Link>
            <h2 className="text-sm sm:text-[12px] md:text-lg lg:text-xl font-semibold text-left mb-2 dark:text-slate-200">{title}</h2>
            <div className="flex flex-wrap space-x-2 items-center w-full">
                <LikeBtn slug={$id} />
                <FollowBtn userId={userId} slug={$id}/>
            </div>
        </div>
    );
}

export default PostCard;
