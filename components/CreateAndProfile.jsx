"use client";

import Link from "next/link";
import { User2 } from "lucide-react";
import Tooltip from "./Tooltip";

export default function CreateAndProfile({ user }) {
  return (
    <div className="gap-4 flex">
      {/* 👤 Profile/Login Icon */}
      <div
        className="flex items-center w-8 h-8 justify-center 
                   bg-orange-500 text-white rounded 
                   cursor-pointer transition-all duration-200 ease-in-out 
                   hover:bg-orange-600 shadow-sm"
      >
        <Tooltip text={user ? "Profile" : "Login"}>
          <Link
            href={
              user
                ?  "/profile"
                : "/login"
            }
          >
            <User2 className="h-4" />
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}
