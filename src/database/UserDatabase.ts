import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public getAllUsers= async()=>{
        const userDB = await BaseDatabase.connection(UserDatabase.TABLE_USERS).select()

        return userDB
    }

    public async signUp(newUser:UserDB){
        await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(newUser)
    }

    public async login(email: string, password: string){
        const [userDB]:UserDB[] | undefined = await BaseDatabase.connection(UserDatabase.TABLE_USERS).select().where({email} && {password})

        return userDB
    }

    public getUserByEmail = async (email: string)=>{
        const [userDB]:UserDB[] | undefined = await BaseDatabase.connection(UserDatabase.TABLE_USERS).select().where({email:email})

        return userDB
    }
    
    public getUserById = async (id: string)=>{
        const [userDB]:UserDB[] | undefined = await BaseDatabase.connection(UserDatabase.TABLE_USERS).select().where({id:id})

        return userDB
    }
}
