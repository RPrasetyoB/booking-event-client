import { TableEventHr } from "@/components/dashboard/hr/table";
import { Helmet, HelmetProvider } from "react-helmet-async";

const DashboardHr = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Dashboard | HR</title>
        <meta name="description" content="Hr Dashboard Page." />
      </Helmet>
      <div className="w-full p-2 pt-4">
        <TableEventHr />
      </div>
    </HelmetProvider>
  );
};

export default DashboardHr;
