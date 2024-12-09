import React, { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputTxt, RTE } from '../components';
import appwriteService from '../appwrite/Config';
import { useNavigate } from 'react-router-dom';
import { check, no } from '../components';
import authService from '../appwrite/Auth';


export default function AddPost({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const [userData, setUserData] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    const getcurrentuser = async () => {
      const user = await authService.getCurrentUser();
      setUserData(user)
    }
    getcurrentuser();
  }, [])


  const [postDone, setPostDone] = useState(false);
  const [postCreate, setPostCreate] = useState(false);
  const [postNotCreate, setPostNotCreate] = useState(false);
  const [Error, setError] = useState('');


  const submit = async (data) => {
    try {
      if (post) {
        const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

        if (file && post.featuredImage) {          
          appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined,
        });


        if (dbPost) {
          setPostDone(true);
          setPostCreate(true);
          setTimeout(() => {
            navigate(`/post/${dbPost.$id}`);
          }, 2000);
        }
      } else {
        setPostDone(false);
        const file = await appwriteService.uploadFile(data.image[0]);
        console.log(file);


        if (file) {
          const fileId = file.$id;
          data.featuredImage = fileId;

          const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id, userName: userData.name });


          if (dbPost) {
            setPostDone(true);
            setPostCreate(true);
            setTimeout(() => {
              navigate(`/post/${dbPost.$id}`);
            }, 2000);
          }
        }
      }
    }
    catch (error) {
      setPostDone(false);
      if (error.message && error.message.includes("requested ID already exists")) {
        setError("Title is Exists please change the title");
      } else {
        setError("Post is not upload successfully");
      }
      setPostNotCreate(true);
    } finally {
      setTimeout(() => {
        setPostCreate(false);
        setError("");
        setPostNotCreate(false);
      }, 2000);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "_");

    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <div className='shadow-lg pb-10 bg-blue-50 dark:bg-[#000000]'>
      <div className='text-xl sm:text-2xl md:text-3xl lg:text-4xl pt-5 pl-5 font-bold mb-4 hover:underline dark:text-slate-200'>
        AddPost
      </div>
      <form onSubmit={handleSubmit(submit)} className="flex flex-wrap bg-blue-200 dark:bg-[#1a1b33] dark:text-slate-200 shadow-lg rounded-lg p-6 space-y-6 mt-10 m-5">
        <div className="w-full md:w-2/3 px-2 mb-6">
          <InputTxt
            label="Title:"
            placeholder="Enter title here"
            className="mb-4 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register("title", { required: true })}
          />

          <InputTxt
            label="Slug:"
            placeholder="Auto-generated slug"
            className="mb-4 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register("slug", { required: true })}
            onInput={(e) => {
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true
              });
            }}
          />

          <RTE
            label="Content:"
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
        </div>

        <div className="w-full md:w-1/3 px-2">
          <div className="mb-4">
            <label className="block text-xs sm:text-sm md:text-md lg:text-lg font-medium text-gray-700 dark:text-slate-200">Featured Image:</label>
            {/* <p className='block text-xs sm:text-sm md:text-md lg:text-lg font-medium text-gray-700 dark:text-slate-200'>Image size is less than 3MB</p> */}
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/gif"
              className="block w-full text-sm text-gray-500 dark:text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mt-2"
              {...register("image", { required: !post })}
            />
          </div>

          {post && (
            <div className="w-full mb-4">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs sm:text-sm md:text-md lg:text-lg font-medium text-gray-700 dark:text-slate-200">Status:</label>
            <select
              className="text-xs sm:text-sm md:text-[12px] lg:text-lg block w-auto mt-1 px-4 py-2 border border-gray-300 dark:text-gray-900 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("status", { required: true })}
            >
              <option className='dark:text-gray-900 text-xs sm:text-sm md:text-[12px] lg:text-lg'>Active</option>
              <option className='dark:text-gray-900 text-xs sm:text-sm md:text-[12px] lg:text-lg'>Inactive</option>
            </select>
          </div>
          <button
            type="submit"
            bgColor={post ? "bg-green-500" : undefined}
            // onClick={onchange}
            className={`text-sm sm:text-md md:text-lg lg:text-xl w-full py-2 px-4 text-white rounded-md shadow-md transition duration-150 ease-in-out ${post ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {post ? "Update Post" : "Submit Post"}
          </button>
          {postCreate && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-slate-100 border-2 text-black p-4 sm:p-5 md:p-6 rounded-lg shadow-lg text-center backdrop-blur-sm w-auto flex gap-3 md:gap-4">
                <img src={check} alt="" className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8' />
                <span className="text-base sm:text-sm md:text-[12px] lg:text-lg font-semibold text-balck">Post is successfully upload</span>
              </div>
            </div>
          )}
          {postNotCreate && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-slate-100 border-2 text-black p-4 sm:p-5 md:p-6 rounded-lg shadow-lg text-center backdrop-blur-sm w-auto flex  gap-3 md:gap-4">
                <img src={no} alt="" className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8' />
                <span className="text-base sm:text-sm md:text-[12px] lg:text-lg font-semibold text-balck">{Error}</span>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};