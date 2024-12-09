import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/Config";
import parse from "html-react-parser";
import LikeBtn from '../components/LikeBtn';
import userImage from '../components/image/userImage.jpg';
import FollowBtn from "../components/FollowBtn";
import { check, no } from "../components";
import authService from "../appwrite/Auth";

export default function Post() {
  const [post, setPost] = useState(null);
  const [userPost, setUserPost] = useState(false);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [DeleteMsg, setDeleteMsg] = useState(false);
  const [NotDeleteMsg, setNotDeleteMsg] = useState(false);
  const [postPhoto, setPostPhoto] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getcurrentuser = async () => {
      const user = await authService.getCurrentUser();
      setUserData(user)
    }
    getcurrentuser();
  }, [])

  
  useEffect(() => {
    const ProfileP = async () => {
      const Avatar = await appwriteService.getAuthUser(post?.userId);
      setPostPhoto(Avatar.ProfilePhoto);
      console.log(postPhoto);
    }
    ProfileP();
  }, [post?.userId])

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (post && post.userId === userData.$id) {

      setUserPost(false);
    } else {
      setUserPost(true);
    }
  }, [post, userData]);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost({
            ...post,
            likes: post.likes || []
          });
          setLoading(false);
        } else {
          setLoading(false);
          navigate("/");
        }
      });
    } else {
      setLoading(false);
      navigate("/");
    }
  }, [slug, navigate]);


  const deletePost = () => {
    try {
      appwriteService.deletePost(post.$id).then((status) => {
        if (status) {
          appwriteService.deleteFile(post.featuredImage);
          setDeleteMsg(true);
          setTimeout(() => {
            navigate('/all-posts');
          }, 2000);
        }
      });
    } catch (error) {
      setDeleteMsg(false);
      setNotDeleteMsg(true);
    } finally {
      setTimeout(() => {
        setDeleteMsg(false);
        setNotDeleteMsg(false);
      }, 2000);
    }
  };

  if (loading) {
    return <div className="text-center text-md sm:text-lg md:text-xl lg:text-2xl dark:bg-black dark:text-slate-200 py-32">Wait a seconds...</div>;
  }

  return post ? (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-100 p-10 sm:p-12 md:p-14 lg:p-16 dark:bg-[#000000]">
      <div className="w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden dark:bg-[#1a1b33]">
        <div className="flex flex-wrap items-center sm:mb-4 px-6 pt-6">
          <img src={postPhoto || userImage} alt="profilePhoto" className="bg-white dark:text-white h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:w-16 lg:h-16 rounded-full object-cover" />
          <p className="ml-3 text-left font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl dark:text-slate-200">{post.userName}</p>
        </div>
        <div className="flex justify-center p-6">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="w-full max-w-sm sm:max-w-lg lg:max-w-xl object-cover rounded-lg shadow-lg"
          />
        </div>
        {isAuthor && (
          <div className="right-6 top-6">
            <Link to={`/edit-post/${post.$id}`}>
              <button className="m-4 bg-green-500 rounded-lg p-2 sm:p-3 lg:p-4 text-sm sm:text[12px] md:text-lg lg:text-xl">Edit</button>
            </Link>
            <button className="mr-3 bg-red-500 rounded-lg p-2 sm:p-3 lg:p-4 text-sm sm:text[12px] md:text-lg lg:text-xl" onClick={deletePost}>Delete</button>
          </div>
        )}
        <div className="px-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 text-left dark:text-slate-200">{post.title}</h1>
          <p className="text-xs sm:text-sm md:text-md lg:text-lg text-gray-600 text-justify mb-6 dark:text-slate-200">{parse(post.content)}</p>
        </div>
        <div className="flex flex-wrap justify-left mb-6 px-6 gap-6">
          {post && userPost && (<FollowBtn userId={post.userId} />)}
          <LikeBtn slug={slug} />
        </div>
      </div>
      {DeleteMsg && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-slate-100 border-2 text-black p-4 sm:p-5 md:p-6 rounded-lg shadow-lg text-center backdrop-blur-sm w-auto flex gap-3 md:gap-4">
            <img src={check} alt="" className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8' />
            <span className="text-sm sm:text-md md:text-lg lg:text-xl font-semibold text-balck">Post is Deleted successfully</span>
          </div>
        </div>
      )}
      {NotDeleteMsg && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-slate-100 border-2 text-black p-4 sm:p-5 md:p-6 rounded-lg shadow-lg text-center backdrop-blur-sm w-auto flex gap-3 md:gap-4">
            <img src={no} alt="" className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8' />
            <span className="text-sm sm:text-md md:text-lg lg:text-xl font-semibold text-balck">Post is not Delete successfully</span>
          </div>
        </div>
      )}
    </div>
  ) : null;
}
