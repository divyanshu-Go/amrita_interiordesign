"use server";

import { cookies } from "next/headers";
import DbConnect from "@/lib/Db/DbConnect";
import Address from "@/models/address";
import { verifyToken } from "@/lib/auth/token";

async function getUserId() {
  const authCookie = await cookies().get("auth_token");
  if (!authCookie) throw new Error("Not authenticated");

  const payload = await verifyToken(authCookie.value);
  if (!payload) throw new Error("Invalid token");

  return payload.user._id;
}

export async function createAddress(data) {
  const userId = await getUserId();
  await DbConnect();

  if (data.isDefault) {
    await Address.updateMany(
      { userId: userId },
      { isDefault: false }
    );
  }

  const address = await Address.create({
    ...data,
    userId: userId,
  });

  return JSON.parse(JSON.stringify(address));
}

export async function updateAddress(id, data) {
  const userId = await getUserId();
  console.log("Updating address for user:", userId);
  await DbConnect();

  if (data.isDefault) {
    await Address.updateMany(
      { userId: userId },
      { isDefault: false }
    );
  }

  const address = await Address.findOneAndUpdate(
    { _id: id, userId: userId },
    data,
    { new: true }
  );

  if (!address) throw new Error("Address not found");

  return JSON.parse(JSON.stringify(address));
}

export async function deleteAddress(id) {
  const userId = await getUserId();
  await DbConnect();

  await Address.findOneAndDelete({
    _id: id,
    userId: userId,
  });

  return true;
}
