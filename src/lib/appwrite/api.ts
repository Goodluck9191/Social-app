import { ID } from 'appwrite';
import type { INewUser } from "../../types/index";
import { account, appwriteConfig, avatars, databases } from './config';


export async function CreateUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if(!newAccount) throw Error

        const avataUrl = avatars.getInitials(user.name)

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avataUrl,

        })

        return newUser;

    } catch (error) {
        console.error("Error creating user:", error);
        
    }

}

export async function saveUserToDB(user:{
    accountId: string;
    email: string;
    name: string;
    imageUrl: string;
    username ? : string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            user,
        )

        return newUser

    } catch (error) {
        console.log(error)
    }
    
}