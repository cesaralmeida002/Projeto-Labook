import { Request,Response } from "express"
import { db } from "../database/Knex"
import { PostDTO } from "../dtos/PostDTO"
import { PostBusiness } from "../business/PostBusiness"

export class PostController{
    constructor(
        private postBusiness: PostBusiness,
        private postDTO: PostDTO
    ){}

    public getPosts = async(req:Request, res:Response)=>{
        try {
            const input ={
                q:req.query.q as string | undefined,
                token: req.headers.authorization
            }  
            const output = await this.postBusiness.getPosts(input)
            res.status(201).send(output)   
                      
        } catch (error) {
            if (req.statusCode === 200) {
                res.status(500)
            }
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Houve um 'ERRO' inesperado.")
            }  
        }
    }

    public insertNewPost = async(req:Request, res:Response)=>{
        try {               
        const content = req.body.content
        const token = req.headers.authorization

            const input = this.postDTO.insertInputPost(content, token)
            const output = await this.postBusiness.insertNewPost(input)            
            res.status(200).send(output)
    
        } catch (error) {
            if (req.statusCode === 200) {
                res.status(500)
            }   
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }  
        }
    }

    public updatePost = async (req:Request, res: Response)=>{
        try {          
        const id = req.params.id
        const content = req.body.content
        const token = req.headers.authorization

        const input = await this.postDTO.updateInputPost(id,content, token)
        const output = await this.postBusiness.updatePost(input)

           res.status(201).send(output)
        } catch (error) {       
            if (req.statusCode === 200) {
                res.status(500)
            }   
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Houve um 'ERRO' inesperado.")
            }    
        }
    }

    public deletePost = async (req:Request, res: Response)=>{
        try {
            const id = req.params.id
            const token = req.headers.authorization

            const input = await this.postDTO.deleteInputPost(id, token)
            const output = await this.postBusiness.deletePost(input)
            res.status(201).send(output)
    
        } catch (error) {        
            if (req.statusCode === 200) {
                res.status(500)
            }   
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Houve um 'ERRO' inesperado.")
            }   
        }
    }

    public likeDislike = async (req:Request, res: Response)=>{
        try {
            const input = {
                id: req.params.id,
                like: req.body.like,
                token: req.headers.authorization,
            }

            const output = await this.postBusiness.likeDislike(input)
            res.status(201).send(output)
            
        } catch (error) {
                    
            if (req.statusCode === 200) {
                res.status(500)
            }
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Houve um 'ERRO' inesperado")
            }  
        }
    }
}