import { ID } from 'appwrite';
import type { INewUser } from "../../types/index";
import { account } from './config';


export async function CreateUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.username
        )
        return newAccount;

    } catch (error) {
        console.error("Error creating user:", error);
        
    }

}