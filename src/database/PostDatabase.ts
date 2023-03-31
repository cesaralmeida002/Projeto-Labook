import { UserDatabase } from "./UserDatabase";
import { BaseDatabase } from "./BaseDatabase";
import { PostDB, LikeDislikeDB } from "../types";


export class PostDatabase extends BaseDatabase {
    public static POSTS_TABLE = "posts"
    public static LIKEDISLIKE_TABLE = "likes_dislikes"

    public getAllPosts = async () => {
        const postDB = await BaseDatabase.connection(PostDatabase.POSTS_TABLE).select()

        return postDB
    }
    public getPostsWithCreator = async () => {
        const postsDB = await this.getAllPosts()
        const creatorsDB = await BaseDatabase.connection(UserDatabase.TABLE_USERS).select()

        return {
            postsDB,
            creatorsDB,
        }
    }
    public getPostById = async (id: string) => {
        const [postDB]: PostDB[] | undefined = await BaseDatabase.connection(PostDatabase.POSTS_TABLE).select().where({ id: id })

        return postDB
    }
    public insertNewPost = async (newPostDB: PostDB) => {
        await BaseDatabase.connection(PostDatabase.POSTS_TABLE).insert(newPostDB)
    }
    public updatePost = async (updatePost: PostDB, id: string) => {
        await BaseDatabase.connection(PostDatabase.POSTS_TABLE).update(updatePost).where({ id: id })
    }
    public deletePostbyId = async (id: string) => {
        await BaseDatabase.connection(PostDatabase.POSTS_TABLE).del().where({ id: id })
    }
    public likeDislike = async (user_id: string, post_id: string) => {
        const [likeDislikeDB]: LikeDislikeDB[] | undefined = await BaseDatabase.connection(PostDatabase.LIKEDISLIKE_TABLE).select().where({ user_id: user_id, post_id: post_id })

        return likeDislikeDB
    }
    public updateLikeDislike = async (updateLD: LikeDislikeDB) => {
        await BaseDatabase.connection(PostDatabase.LIKEDISLIKE_TABLE).insert(updateLD)
    }
}