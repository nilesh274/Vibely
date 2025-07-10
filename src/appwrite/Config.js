    import ProfilePost from '../components/ProfilePost.jsx';
    import conf from '../conf/conf.js'
    import { Client, ID, Databases, Storage, Query } from "appwrite";

    export class Service{
        client = new Client();
        databases;
        bucket;
        

        constructor(){
            this.client
                .setEndpoint(conf.appwriteUrl)
                .setProject(conf.appwriteProjectId);

            this.databases = new Databases(this.client);
            this.bucket = new Storage(this.client);
        }

        async createPost({ title, slug, content, featuredImage, status, userId, userName }) {
            try {
                return await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug,
                    {
                        title,
                        content,
                        featuredImage,
                        status,
                        userId,
                        userName,
                    }
                )
            } catch (error) {
                console.log("Appwrite serive :: createPost :: error", error);
                // console.log(error);
                throw error;
            }
        }

        async updatePost(slug, {title, content, featuredImage, status}){
            try {
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug,
                    {
                        title,
                        content,
                        featuredImage,
                        status
                    }
                )
            } catch (error) {
                console.log("Appwrite service :: updatePost :: error", error);
            }
        }

        async updateLike(slug, {title, content, featuredImage, status, like}){
            try {
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug,
                    {
                        title,
                        content,
                        featuredImage,
                        status,
                        like
                    }
                )
            } catch (error) {
                console.log("Appwrite service :: updatePost :: error", error);
            }
        }

        async deletePost(slug){
            try {
                await this.databases.deleteDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug
                )
                return true;
            } catch (error) {
                console.log("Appwrite service :: deletePost :: error", error);
                return false;
            }
        }
        
        async getPost(slug){
            try {
                return await this.databases.getDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug
                )
            } catch (error) {
                console.log("Appwrite service :: getPost :: error", error);
                return false;
            }
        }

        async getAllPost(queries = [Query.equal("status", "Active")]){
            try{
                return await this.databases.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    queries
                )
            }catch (error) {
                console.log("Appwrite serive :: getAllPost :: error", error);
                return false
            }
        }

        async getAllPosts(){
            try {
                return await this.databases.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId
                )
            } catch (error) {
                console.log("Appwrite servie:: getAllPosts:: error", error);
                return false;
            }
        }

        //user following and follower collection
        
        async createUserDetails(userId, userName){
            try {
                return await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionUsersId,
                    userId,
                    {
                        userId: userId,
                        UserName : userName,
                        follower: [],
                        following: [],
                    }
                )
            } catch (error) {
                console.log("appwriteService :: createUserDetails :: error", error);
            }
        }

        async getUserDetails(userId){
            try {
                if(!userId){
                    console.log("error");
                }
                return await this.databases.getDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionUsersId,
                    userId
                )
            } catch (error) {
                console.log("appwriteService :: getUserDetails :: error", error);
                return false;
            }
        }

        async updateUserDetails(userId, {follower, following}){
            try {
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionUsersId,
                    userId,
                    {
                        follower,
                        following
                    }
                )
            } catch (error) {
                console.log("sppwriteService :: updateUserDetails :: error", error);
            }
        }

        //Auth user
        
        async createAuthUser(userId, name, avatar){
            try {
                return await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionAuthUser,
                    userId,
                    {
                        UserId : userId,
                        Name: name,
                        ProfilePhoto: avatar
                    }
                )
            } catch (error) {
            console.log("appwriteService :: createAuthUser :: error", error);
            }
        }

        async getAuthUser(userId){
            try {
                if(!userId){
                    console.log("error");
                }
                return await this.databases.getDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionAuthUser,
                    userId
                )
            } catch (error) {
                console.log("appwriteService :: getAuthUser :: error", error);
                return false;
            }
        }

        //file upload service

        async uploadFile(file){
            try {
                return await this.bucket.createFile(
                    conf.appwriteBucketId,
                    ID.unique(),
                    file
                )
            } catch (error) {
                console.log("Appwrite service :: uploadFile :: error", error);
                return false;
            }
        }

        async deleteFile(fileId){
            try {
                await this.bucket.deleteFile(
                    conf.appwriteBucketId,
                    fileId
                )
                return true
            } catch (error) {
                console.log("Appwrite service :: deleteFile :: error", error);
                return false
            }
        }

        getFilePreview(fileId){
            return this.bucket.getFileView(
                conf.appwriteBucketId,
                fileId        
            )
        }
    }

    const service = new Service();

    export default service;