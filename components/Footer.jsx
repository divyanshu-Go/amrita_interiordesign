"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Github, Mail, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white rounded-sm py-10 flex flex-col
     justify-center items-center m-1 border-2 border-orange-300">
      <div className="container px-8 flex flex-col items-center 
      justify-between gap-6 md:flex-row">
        {/* About Section */}
        <div className="text-center flex flex-col items-center flex-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/logo.png" alt="PanTasks Logo" width={25} />
            <h3 className="font-bold text-orange-500 text-lg">PanTasks</h3>
          </div>
          <p className="text-sm text-gray-600 max-w-xs">
            A task management platform built for teams to stay organized and efficient.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center flex-1">
          <h3 className="font-medium mb-3 text-orange-500">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li>
              <Link
                href="/"
                className="hover:text-orange-700 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/tasks"
                className="hover:text-orange-700 transition-colors"
              >
                Tasks
              </Link>
            </li>
            <li>
              <Link
                href="/user"
                className="hover:text-orange-700 transition-colors"
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-orange-700 transition-colors"
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="text-center flex-1">
          <h3 className="font-medium mb-3 text-orange-500">Contact Us</h3>
          <div className="flex flex-col gap-2 text-sm">
            <Link
              href="mailto:divyanshu930462@gmail.com"
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-orange-700 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>divyanshu930462@gmail.com</span>
            </Link>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-5 mt-2">
              <Link
                href="https://twitter.com/"
                className="text-gray-600 hover:text-orange-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/"
                className="text-gray-600 hover:text-orange-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com/"
                className="text-gray-600 hover:text-orange-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} PanTasks. Developed by Divyanshu Sharma.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
