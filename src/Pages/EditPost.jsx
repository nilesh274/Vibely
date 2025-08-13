import React, { useState, useEffect } from 'react';
import appwriteService from '../appwrite/Config'
import { AddPost } from '../components'
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post)
                }
            })
        } else {
            navigate("/")
        }
    }, [slug, navigate])

    return post ? (
        <div>
            <AddPost post={post} />
        </div>
    ) : null

}
export default EditPost;