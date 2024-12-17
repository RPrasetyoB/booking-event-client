import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/UI/sidebar";
import { ChevronRight, Home, Settings } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/collapsible";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
];

export function AppSidebar() {
  const handleLogOut = () => {
    sessionStorage.removeItem("authToken");
    window.location.replace("/login");
  };
  return (
    <Sidebar className="border-none shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)]">
      <SidebarContent>
        <SidebarGroup className="pl-2 pr-4 pt-4">
          <SidebarTrigger className={`self-end`} />
          <SidebarGroupLabel className="mb-2 text-lg font-semibold">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="pl-2">
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Collapsible
                title={"Account"}
                defaultOpen
                className="group/collapsible -mt-2"
              >
                <SidebarGroup>
                  <SidebarGroupLabel
                    asChild
                    className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <CollapsibleTrigger className="flex items-center gap-2">
                      <Settings />
                      Account
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent className="pl-6">
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <a href={"/profile"}>{"Profile"}</a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            className="hover:bg-#F4F4F5"
                          >
                            <div
                              className="h-full w-full cursor-pointer bg-transparent text-red-500 hover:bg-slate-200 hover:font-bold hover:text-red-600"
                              onClick={handleLogOut}
                            >
                              Log out
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
