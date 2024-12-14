import { lazy, Suspense } from "react";
import { Outlet, type RouteObject } from "react-router-dom";
import LoginPage from "@/pages/login";
import Layout from "@/components/layout/sidebar/sidebar-provider";
import ProtectedRoute from "@/components/layout/protected-route";

const Index = lazy(() => import("@/pages/index"));
const Notfound = lazy(() => import("@/pages/404"));

export const routes: Array<RouteObject> = [
  {
    index: true,
    element: (
      <Suspense>
        <Index />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "app",
    element: (
      <Suspense>
        <ProtectedRoute>
          <Layout>
            <Outlet />
          </Layout>
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "settings", // Accessible as `/settings`
        element: (
          <Suspense>
            <Settings />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense>
        <Notfound />
      </Suspense>
    ),
  },
];

export default routes;
