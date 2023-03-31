import express from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostController } from "../controller/PostController";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { PostDTO } from "../dtos/PostDTO";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export const postRouter = express.Router()

const postController = new PostController(

    new PostBusiness(
        new PostDatabase(),
        new UserDatabase(),
        new PostDTO(),
        new IdGenerator(),
        new TokenManager()      
    ),
    new PostDTO())


postRouter.get("/", postController.getPosts)//buscar todos os posts

postRouter.post("/", postController.insertNewPost)//inserir novo post

postRouter.put("/:id", postController.updatePost)//atualizar um post

postRouter.delete("/:id", postController.deletePost)//deletar post

postRouter.put("/:id/like", postController.likeDislike)//like/dislike