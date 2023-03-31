import { PostDTO, InsertInputPostDTO,UpdateInputDTO, LikeDislikeDTO, GetAllPostsInputDTO, DeleteInputPostDTO } from "../dtos/PostDTO"
import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { ROLE_USER } from "../types"
import { BadRequestError } from "../errors/BadRequestError"
import { Post } from "../models/Post"
import { TokenManager } from "../services/TokenManager"
import { IdGenerator } from "../services/IdGenerator"


export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private postDTO: PostDTO,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}

    public getPosts = async (input:GetAllPostsInputDTO)=>{
        const {q, token} = input

        if(typeof token !== "string"){
            throw new BadRequestError("O 'TOKEN' não foi informado.")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("O 'TOKEN' informado, não é válido.")
        }
            
        const {
            postsDB,
            creatorsDB,
        } = await this.postDatabase.getPostsWithCreator()

        const posts = postsDB.map((postDB)=>{
            const post = new Post (
                postDB.id,
                postDB.content,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at,
                getCreator(postDB.creator_id)
                )

                return post.toBusinessModel()
        })

        function getCreator(creatorId: string){
            const creator = creatorsDB.find((creatorDB)=>{
                return creatorDB.id === creatorId
            })

            return{
                id: creator.id,
                name: creator.name
            }
        }
        return posts  
    }

    public insertNewPost = async(input:InsertInputPostDTO)=>{
        const {content, token} = input

        if(typeof token !== "string"){
            throw new BadRequestError("O 'TOKEN' não foi informado.")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("O 'TOKEN' informado, não é válido.")
        }

        const id = this.idGenerator.generate()
        const created_at = (new Date()).toISOString()
        const updated_at = (new Date()).toISOString()
        const likes = 0
        const dislikes = 0
        const creator_id = payload.id

        if (content !== undefined){
            if(typeof content !== "string"){
                throw new BadRequestError(" O 'CONTENT' precisa ser string")
            }
        }else{
            throw new BadRequestError(" 'CONTENT' não informado, favor informar")
        }

        const newPost = new Post (
            id,
            content,
            likes,
            dislikes,
            created_at,
            updated_at,
            {id:creator_id,
            name: payload.name,}
            )
        
        const newPostDB = newPost.toDBModel()
        await this.postDatabase.insertNewPost(newPostDB)

        const output = {
            message: "Sua publicação foi realizada",
            post: newPost,
        }
        return output
    }

    public updatePost = async (input:UpdateInputDTO)=>{
        const {id,content,token} = input

        if(typeof token !== "string"){
            throw new BadRequestError(" O 'TOKEN' não foi informado")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("O 'TOKEN' informado não é válido")
        }

        const filterPostToUpdate = await this.postDatabase.getPostById(id)

        if(!filterPostToUpdate){
            throw new BadRequestError(" O 'Id' não foi encontrado")
        }
        if(payload.role !== ROLE_USER.ADMIN){
            if(filterPostToUpdate.creator_id !== payload.id){
                throw new BadRequestError(" Você não pode editar a publicação.")
            }
        }
        if (content !== undefined){
            if(typeof content !== "string"){
                throw new BadRequestError("O 'CONTENT' precisa ser string")
            }
        }else{
            throw new BadRequestError("Informe o 'CONTENT'")
        }

        const updateAt = (new Date()).toISOString()
        const postToUpdate = new Post(
            id,
            content,
            filterPostToUpdate.likes,
            filterPostToUpdate.dislikes,
            filterPostToUpdate.created_at,
            updateAt,
            {
                id:filterPostToUpdate.creator_id,
                name: payload.name
            }
        )
        const postToUpdateDB = postToUpdate.toDBModel()
        await this.postDatabase.updatePost(postToUpdateDB,id)

        const output = {
            message: "Atualização realizada",
            post: postToUpdate,
        }

        return output
    }


    public deletePost = async (input:DeleteInputPostDTO )=>{
        const {id, token} = input

        if(typeof token !== "string"){
            throw new BadRequestError("O 'TOKEN' não foi informado")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("O 'TOKEN' informado, não é válido")
        }

        const filterPostToDelete = await this.postDatabase.getPostById(id)
        const filterUserDB = await this.userDatabase.getUserById(filterPostToDelete.creator_id)

        if(filterUserDB.role !== ROLE_USER.ADMIN){
            if(filterUserDB.id !== payload.id){
                throw new BadRequestError("Você não tem premissão para fazer essa alteração")
            }
        }
    
        if(filterPostToDelete){
            await this.postDatabase.deletePostbyId(id)
            const output = {
                message: "Publicação excluida",
                post: filterPostToDelete}
            return output
        }else{
            throw new BadRequestError("A publicação não foi encontrada")
        }
    }

    public likeDislike = async (input: LikeDislikeDTO)=>{
        const {id, like, token} = input

        if(typeof token !== "string"){
            throw new BadRequestError("O 'TOKEN' não foi informado.")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("O 'TOKEN' informado não é válido.")
        }

        const filterPostToLike = await this.postDatabase.getPostById(id)
        const filterIdLD = await this.postDatabase.likeDislike(payload.id, id)

        if(filterIdLD){
            throw new BadRequestError("Você não pode fazer a mesma ação, mais de uma vez.")
        }

        if(!filterPostToLike){
            throw new BadRequestError("A publicação não foi encontrada.")
        }

        const updateAt = (new Date()).toISOString()
        let likes = 0
        let dislikes = 0

        if(like === 0){
            dislikes = 1
            
        }else if(like === 1){
            likes = 1
        }else{
            throw new BadRequestError("Digite(1) para like,  e (0) para dislike")
        }

        const postToLike = new Post(
            id,
            filterPostToLike.content,
            likes,
            dislikes,
            filterPostToLike.created_at,
            updateAt,
            {id: filterPostToLike.creator_id,
            name: " "}
        )

        const updateLikeDB = {
            user_id: payload.id,
            post_id: id,
            like: 1
        } 

        const postToLikeDB = postToLike.toDBModel()
        await this.postDatabase.updatePost(postToLikeDB,id)
        await this.postDatabase.updateLikeDislike(updateLikeDB)

        if(like === 0){
            const output = {
                message: "'Você deu 'DISLIKE'", 
                post: postToLikeDB}
            return output
        }else if(like===1){
            const output = {
                message: "Você deu 'LIKE'", 
                post: postToLikeDB}
            return output
        }

    }
}
