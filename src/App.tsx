import "./global.css";
import { Routes, Route } from "react-router-dom";
import { Home } from "./_root/pages/";
import SigninForm from "./_auth/SigninForm.tsx";
import SignupForm from "./_auth/SignupForm.tsx";
import AuthLayout from "./_auth/AuthLayout.tsx";
import RootLayout from "./_root/pages/RootLayout.tsx";

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
        </Route>
      </Routes>
    </main>
  );
};

export default App;
