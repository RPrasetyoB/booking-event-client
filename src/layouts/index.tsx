import { SidebarProvider, SidebarTrigger } from "@/components/UI/sidebar";
import { AppSidebar } from "../components/layout/appside-bar";
import NavBar from "@/components/layout/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <NavBar />
        {children}
      </main>
    </SidebarProvider>
  );
}
