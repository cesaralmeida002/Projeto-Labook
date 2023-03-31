
export interface GetAllPostsInputDTO{
    q: string,
    token: string,
}
   
    export interface InsertInputPostDTO{
        content: string,
        token: string,
    }

    export interface UpdateInputDTO{
        id: string,
        content: string,
        token: string,
    }

    export interface DeleteInputPostDTO{
        id: string,
        token: string,
    }

    export interface LikeDislikeDTO{
        id: string,
        like: number,
        token: string,
    }

   export class PostDTO {
    getAllPostsInput = (q:string, token:string):GetAllPostsInputDTO=>{
        const result:GetAllPostsInputDTO={
            q,
            token,
        }
        return result
    }

    insertInputPost = (content: string, token: string) :InsertInputPostDTO =>{
        const result: InsertInputPostDTO={
            content,
            token,
        }
        return result
    }

    deleteInputPost = (id: string, token: string) :DeleteInputPostDTO =>{
        const result: DeleteInputPostDTO={
            id,
            token,
        }
        return result
    }

    updateInputPost = (id:string, content: string, token: string): UpdateInputDTO =>{
        const result:UpdateInputDTO={
            id,
            content,
            token,
        }
        return result
    }

    likeDislike = (id:string,like:number, token: string):LikeDislikeDTO=>{
        const result:LikeDislikeDTO={
            id,
            like,
            token,
        }
        return result
    }
    
   } 