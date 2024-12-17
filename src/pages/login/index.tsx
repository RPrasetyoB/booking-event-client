import LoginComponent from "@/components/login";
import { Helmet, HelmetProvider } from "react-helmet-async";

const LoginPage = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Login</title>
        <meta
          name="description"
          content="This is the dashboard of My Application."
        />
      </Helmet>
      <div className="flex h-screen w-full">
        <LoginComponent />
      </div>
    </HelmetProvider>
  );
};

export default LoginPage;
