"use client";

import { useState } from "react";
import Image from "next/image";
import emailjs from "emailjs-com";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // EmailJS service setup
  const sendEmailNotification = (action: string) => {
    // Replace with your EmailJS service and template details
    const serviceId = "service_m63nitd";
    const templateId = "template_485udmr";
    const userId = "8Rh1NjDZBC5ZgppVa";

    const templateParams = {
      user_email: email, // User's email address
      subject: `${action} Notification`, // Subject of the email
      message: `A user has ${action.toLowerCase()} with the email: ${email}.`, // The body of the email
    };

    emailjs.send(serviceId, templateId, templateParams, userId)
      .then((response) => {
        console.log("Email sent successfully", response);
      })
      .catch((error) => {
        console.error("Error sending email", error);
      });
  };

  // Handle Sign Up
  const handleSignUp = () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    // Check if the email is already used by any user
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = existingUsers.some((user: { email: string }) => user.email === email);

    if (userExists) {
      alert("Account already exists. Please log in.");
      return;
    }

    // Add new user to the list
    existingUsers.push({ email, password });
    localStorage.setItem("users", JSON.stringify(existingUsers));
    alert("Account created successfully!");

    // Send email notification
    sendEmailNotification("Sign Up");

    setIsSignUp(false); // Switch to login mode after successful sign up
  };

  // Handle Login
  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((user: { email: string; password: string }) => user.email === email);

    if (!user) {
      alert("No account found. Please sign up first.");
      return;
    }

    // Check if entered credentials match saved user data
    if (email === user.email && password === user.password) {
      setLoggedIn(true);
      alert("Logged in successfully!");

      // Send email notification
      sendEmailNotification("Log In");
    } else {
      alert("Invalid email or password.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    alert("Logged out successfully!");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row items-center justify-center px-4">
      {/* Left Section */}
      <div className="w-full md:w-1/2 text-center md:text-left mb-6 md:mb-0">
        <Image
          src="/facebook.svg"
          width={300}
          height={100}
          alt="Facebook logo"
          className="mx-auto md:mx-0"
        />
        <p className="text-gray-700 text-lg md:text-xl ml-7 -mt-4 px-4 md:px-0">
          Facebook helps you connect and share with the people in your life.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
        {!loggedIn ? (
          <>
            {isSignUp ? (
              <>
                <input
                  className="block w-full mb-4 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="block w-full mb-4 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
                  onClick={handleSignUp}
                >
                  Create new account
                </button>
                <p className="text-center text-blue-600 text-sm mt-4 cursor-pointer hover:underline" onClick={() => setIsSignUp(false)}>
                  Already have an account? Log in
                </p>
              </>
            ) : (
              <>
                <input
                  className="block w-full mb-4 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="block w-full mb-4 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  onClick={handleLogin}
                >
                  Log in
                </button>
                <p className="text-center text-blue-600 text-sm mt-4 cursor-pointer hover:underline">
                  Forgotten password?
                </p>
                <hr className="my-6" />
                <button
                  className="block bg-green-500 text-white py-3 px-6 rounded-lg font-semibold mx-auto hover:bg-green-600 transition"
                  onClick={() => setIsSignUp(true)}
                >
                  Create new account
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <p className="text-green-500 font-semibold mb-4">Welcome back!</p>
            <button
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
