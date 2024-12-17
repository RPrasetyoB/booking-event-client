import { SidebarTrigger, useSidebar } from "@/components/UI/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { RootState } from "@/store";
import { User2 } from "lucide-react";
import { useSelector } from "react-redux";

const NavBar = () => {
  const { open } = useSidebar();
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="border-background flex h-12 !w-full items-center border-b bg-white/70 px-6 transition-all duration-300 ease-in-out">
      <SidebarTrigger className={`${open && !isMobile ? "hidden" : ""}`} />
      <p className="mx-auto self-center text-sm font-semibold capitalize">
        {openMobile ? "" : "Event Booking app"}
      </p>
      {!isMobile && (
        <div className="flex h-full items-center self-end">
          <User2 />
          <p>
            {user?.name}{" "}
            <span className="rounded-xl bg-primary px-2 text-white">
              {user?.role_id === 1 ? "HR" : "Vendor"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default NavBar;
