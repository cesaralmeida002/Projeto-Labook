import { PostbyUsersDB, LikeDislikeDB, PostDB } from "../types";

export class Post {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private created_at: string,
        private updated_at: string,
        private creator: {
            id: string,
            name: string,
        }
    ) { }

    public toDBModel(): PostDB {
        return {
            id: this.id,
            creator_id: this.creator.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.created_at,
            updated_at: this.updated_at,
        }
    }

    public toDBLikeDislikeModel(): LikeDislikeDB {
        return {
            post_id: this.id,
            user_id: this.creator.id,
            like: this.likes,
        }
    }

    public toBusinessModel(): PostbyUsersDB {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.created_at,
            updated_at: this.updated_at,
            creator: this.creator,
        }
    }

    public getId(): string {
        return this.id
    }
    public setId(value: string) {
        this.id = value
    }


    public getContent(): string {
        return this.content
    }
    public setContent(value: string) {
        this.content = value
    }


    public getLikes(): number {
        return this.likes
    }
    public setLikes(value: number) {
        this.likes = value
    }


    public getDislikes(): number {
        return this.dislikes
    }
    public setDislikes(value: number) {
        this.dislikes = value
    }


    public getCreatedAt(): string {
        return this.created_at
    }
    public setCreatedAt(value: string) {
        this.created_at = value
    }


    public getUpdatedAt(): string {
        return this.updated_at
    }
    public setUpdatedAt(value: string) {
        this.updated_at = value
    }


    public getCreator(): {
        id: string,
        name: string,
    } {
        return this.creator
    }
    public setCreator(value: {
        id: string,
        name: string,
    }
    ) {
        this.creator = value
    }

}