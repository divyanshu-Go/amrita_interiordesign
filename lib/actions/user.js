// lib/actions/user.js
"use server";

import { cookies } from "next/headers";
import DbConnect from "@/lib/Db/DbConnect";
import User from "@/models/user";
import { verifyToken } from "@/lib/auth/token";
import { hashPassword } from "@/lib/auth/password";
import { serializeUser } from "../serializers/user";

export async function updateUserProfile({ name }) {
  const authCookie = cookies().get("auth_token");
  if (!authCookie) {
    throw new Error("Not authenticated");
  }

  const payload = await verifyToken(authCookie.value);
  if (!payload) {
    throw new Error("Invalid token");
  }

  await DbConnect();

  const userId = payload.user._id;

  const updateData = {};
  if (name) updateData.name = name;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true }
  ).select("-password").lean();

  if (!updatedUser) {
    throw new Error("User not found");
  }


  return serializeUser(updatedUser);
}
