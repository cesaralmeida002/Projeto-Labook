export enum ROLE_USER{
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export interface UserDB{
    id: string,
    name: string,
    email: string,
    password: string,
    role: ROLE_USER,
    create_at: string
}

export interface PostDB{
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

export interface PostbyUsersDB{
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    creator: {
        id: string,
        name: string
    }
}

export interface LikeDislikeDB{
    user_id: string,
    post_id: string,
    like: number
}

export interface TokenPayload {
    id: string,
	name: string,
    role: ROLE_USER
}