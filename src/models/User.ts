import { ROLE_USER, UserDB  } from "../types"

export class User{
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private password: string,
        private role: ROLE_USER,
        private create_at: string,
    ){}
    
    public toDBModel():UserDB{
        return{
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
            create_at: this.create_at,
        }
    }

    public getId():string{
        return this.id
    }
    public setId(value:string):void{
        this.id = value
    }


    public getName():string{
        return this.name
    }
    public setName(value:string):void{
        this.name = value
    }


    public getPassword():string{
        return this.password
    }
    public setPassword(value:string):void{
        this.password = value
    }
  
    
    public getRole():ROLE_USER{
        return this.role
    }
    public setRole(value:ROLE_USER):void{
        this.role = value
    }


    public getCreateAt():string{
        return this.create_at
    }
    public setCreateAt(value:string):void{
        this.create_at = value
    }

}