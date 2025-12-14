import prisma from "../../config/prisma.config";
import { User } from "../../types/user";

export const getProfileService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true }
  });

  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user.id,
    avatar: user.avatar,
    name: user.name,
    username: user.username,
    email: user.email,
    phone_number: user.phone_number,
    birth_of_date: user.birth_of_date,
    role: user.role?.name
  };
}

export const updateProfileService = async (userId: number, payload: User) => {
  const{
    name, avatar, username, email, phone_number, birth_of_date
  } = payload;

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (email) {
    const existingEmail = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } }
    });

    if (existingEmail) {
      const error: any = new Error("Email already exists!");
      error.statusCode = 409;
      throw error;
    }
  }

  if (username) {
    const existingUsername = await prisma.user.findFirst({
      where: { username, NOT: { id: userId } }
    })

    if (existingUsername) {
      const error: any = new Error("Username already exist");
      error.statusCode = 409;
      throw error;
    }
  }

  const updatedData: any = {};

  if (name !== undefined){
    updatedData.name = name;
  }

  if (name !== undefined) {
    updatedData.name = name;
  }
  if (email !== undefined) {
    updatedData.email = email;
  }
  if (username !== undefined) {
    updatedData.username = username;
  }
  if (phone_number !== undefined) {
    updatedData.phone_number = phone_number;
  }

  if (birth_of_date !== undefined) {
    updatedData.birth_of_date = new Date(birth_of_date);
  }

  if(avatar !== undefined ) {
    updatedData.avatar = avatar;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatedData,
    include: { role: true}
  });

  return {
    id: updatedUser.id,
    avatar: updatedUser.avatar,
    name: updatedUser.name,
    username: updatedUser.username,
    email: updatedUser.email,
    phone_number: updatedUser.phone_number,
    birth_of_date: updatedUser.birth_of_date,
    role: updatedUser.role?.name
  };
}