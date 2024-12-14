import { SidebarProvider, SidebarTrigger } from "@/components/UI/sidebar";
import { AppSidebar } from "./appside-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
