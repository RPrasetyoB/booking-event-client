import { SidebarTrigger, useSidebar } from "@/components/UI/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const NavBar = () => {
  const { open } = useSidebar();
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  return (
    <div className="border-background flex h-12 !w-full items-center border-b bg-white/70 px-6 transition-all duration-300 ease-in-out">
      <SidebarTrigger
        className={`self-left ${open && !isMobile ? "hidden" : ""}`}
      />
      <p className="mx-auto self-center text-sm font-semibold capitalize">
        {openMobile ? "" : "booking event date app"}
      </p>
    </div>
  );
};

export default NavBar;
