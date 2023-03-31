import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";
import { TokenPayload, ROLE_USER } from "../types";
import { SignUpDTO, LoginDTO,GetAllUsersInputDTO } from "../dtos/UserDTO";
import { HashManager } from "../services/HashManager";
import { TokenManager } from "../services/TokenManager";
import { BadRequestError } from "../errors/BadRequestError";
import { UserDatabase } from "../database/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";

export class UserBusiness{
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ){}
    public async getAllUsers(input: GetAllUsersInputDTO){
        const {q, token} = input
        
        if(typeof token !== "string"){
            throw new BadRequestError("O 'TOKEN' não foi informado")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("O 'TOKEN' informado não é válido")
        }

        if(payload.role !== ROLE_USER.ADMIN ){
            throw new BadRequestError('Seu perfil não pode acessar esse item')
        }

        const usersDB = await this.userDatabase.getAllUsers()

        const users = 
        usersDB.map((userDB)=>{ 
            const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.create_at,       
        )      
        return user.toDBModel()
    })
        return users
    }

    public async signUp(input: SignUpDTO){
        const {name,email,password} = input

        const id = this.idGenerator.generate()
        const passwordHash = await this.hashManager.hash(password)   
        const created_at = (new Date()).toISOString()
        const filterUserbyEmail = await this.userDatabase.getUserByEmail(email)

        if(filterUserbyEmail){
            throw new BadRequestError("O 'E-MAIL' digitado, já foi cadastrado.")
        }
        if(typeof name !== "string"){
            throw new BadRequestError("'NAME' precisa ser string.")
        }
        if(typeof email !== "string"){
            throw new BadRequestError("'E-MAIL' precisa ser string.")
        }
        if(typeof password !== "string"){
            throw new BadRequestError("'PASSWORD' precisa ser string.")
        }

        const newUser = new User(
            id,
            name,
            email,
            passwordHash,
            ROLE_USER.NORMAL,
            created_at,
        )

        const tokenPayload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }
        
        const token = this.tokenManager.createToken(tokenPayload)
        const newUserDB = newUser.toDBModel()
        await this.userDatabase.signUp(newUserDB)

        const output={
            message: "Usuário cadastrado.",
            token,
        }
        return output
    }

    public async login(input:LoginDTO ){
        const {email, password} = input

        if(typeof email !== "string"){        
            throw new BadRequestError("'E-MAIL' precisa ser string.")
        }
        if(password === undefined){            
            throw new BadRequestError("Por Favor, informe seu 'PASSWORD'")
        }
        const searchUserByLogin = await this.userDatabase.getUserByEmail(email)

        if(!searchUserByLogin){
            throw new NotFoundError("O 'E-MAIL' não está cadastrado!")
        }

        const passwordHash = this.hashManager.compare(password, searchUserByLogin.password)

        if(!passwordHash){
            throw new BadRequestError("Seu 'E-MAIL' e/ou 'SENHA' são inválidos") 
        }

        if(searchUserByLogin){
            const userLogin = new User(
                searchUserByLogin.id,
                searchUserByLogin.name,
                searchUserByLogin.email,
                searchUserByLogin.password,
                searchUserByLogin.role,
                searchUserByLogin.create_at,
            )
            const tokenPayload: TokenPayload = {
                id: userLogin.getId(),
                name: userLogin.getName(),
                role: userLogin.getRole()
            }
            
            const token = this.tokenManager.createToken(tokenPayload)
            const output = {message:"Login realizado", token}
            return output
        }else{
            const output = {message:"Ops. Seus dados estão incorretos."}
            return output
        }  

    }

}