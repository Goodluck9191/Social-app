import { ID, Query } from 'appwrite';
import type { INewPost, INewUser } from "../../types/index";
import { account, appwriteConfig, avatars, databases, storage } from './config';



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

export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');
        
        return session;

    } catch (error) {
        console.log(error)
    }
}

export async function signInAccount(user: {
    email: string;
    password: string
}) {
    try {
        // Delete any existing session first
        try {
            await account.deleteSession('current');
        } catch (error) {
            console.log(error);
            // Session doesn't exist, which is fine
        }
        
        const session = await account.createEmailPasswordSession( user.email, user.password);
        
        return session;

    } catch (error) {
        console.log(error)
    }
    
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error

        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}

export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creater: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    // Use getFileView instead of getFilePreview to avoid transformation limits
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      fileId
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}


export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postsCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
  )

  if (!posts) throw Error

  // Populate creater details for each post
  const postsWithCreator = await Promise.all(
    posts.documents.map(async (post) => {
      const creator = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        post.creater
      );
      return {
        ...post,
        creater: creator
      };
    })
  );

  return { ...posts, documents: postsWithCreator };
}
