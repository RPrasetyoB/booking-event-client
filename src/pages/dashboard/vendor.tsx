import { TableEventVendor } from "@/components/dashboard/vendor/table";
import { Helmet, HelmetProvider } from "react-helmet-async";

const DashboardVendor = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Dashboard | Vendor</title>
        <meta name="description" content="Vendor Dashboard Page." />
      </Helmet>
      <div className="p-2">
        <TableEventVendor />
      </div>
    </HelmetProvider>
  );
};

export default DashboardVendor;
