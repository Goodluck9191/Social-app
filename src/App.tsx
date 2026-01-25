import "./global.css";
import { Routes, Route } from "react-router-dom";
import { AllUsers, CreatePost, EditPost, Home, PostDetails, Profile, Saved, UpdateProfile } from "./_root/pages/";
import SigninForm from "./_auth/SigninForm.tsx";
import SignupForm from "./_auth/SignupForm.tsx";
import AuthLayout from "./_auth/AuthLayout.tsx";
import RootLayout from "./_root/pages/RootLayout.tsx";
import { Toaster } from "@/components/ui/toaster";
import Explore from "./_root/pages/Explore.tsx";

const App = () => {
  return (
    <main className="flex h-screen ">
      <Routes>
        // Public Routes
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        // Protected Routes
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={< EditPost/>} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
