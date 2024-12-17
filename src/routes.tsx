import { lazy, Suspense } from "react";
import { Outlet, type RouteObject } from "react-router-dom";
import Layout from "@/layouts";
import ProtectedRoute from "@/components/layout/protected-route";
import SpinnerWithText from "@/components/UI/spinner-text";

const Index = lazy(() => import("@/pages/index"));
const Notfound = lazy(() => import("@/pages/404"));
const LoginPage = lazy(() => import("@/pages/login"));
const DashboardHr = lazy(() => import("@/pages/dashboard/hr"));
const DashboardVendor = lazy(() => import("@/pages/dashboard/vendor"));

export const routes: Array<RouteObject> = [
  {
    index: true,
    element: (
      <Suspense
        fallback={
          <div className="z-20 flex h-screen w-screen items-center justify-center">
            <SpinnerWithText text="Loading..." />
          </div>
        }
      >
        <Index />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense
        fallback={
          <div className="z-20 flex h-screen w-screen items-center justify-center">
            <SpinnerWithText text="Loading..." />
          </div>
        }
      >
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "",
    element: (
      <Suspense
        fallback={
          <div className="z-20 flex h-screen w-screen items-center justify-center">
            <SpinnerWithText text="Loading..." />
          </div>
        }
      >
        <ProtectedRoute>
          <Layout>
            <Outlet />
          </Layout>
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        path: "/hr/dashboard",
        element: (
          <Suspense
            fallback={
              <div className="z-20 flex h-screen w-screen items-center justify-center">
                <SpinnerWithText text="Loading..." />
              </div>
            }
          >
            <DashboardHr />
          </Suspense>
        ),
      },
      {
        path: "/vendor/dashboard",
        element: (
          <Suspense
            fallback={
              <div className="z-20 flex h-screen w-screen items-center justify-center">
                <SpinnerWithText text="Loading..." />
              </div>
            }
          >
            <DashboardVendor />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense
        fallback={
          <div className="z-20 flex h-screen w-screen items-center justify-center">
            <SpinnerWithText text="Loading..." />
          </div>
        }
      >
        <Notfound />
      </Suspense>
    ),
  },
];

export default routes;
