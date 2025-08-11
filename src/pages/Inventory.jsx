import WorkInProgress from "../components/WorkInProgress";
import { Package } from "lucide-react";

const Inventory = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Inventory Management
          </h1>
          <p className="text-slate-600 mt-1">
            Track medical supplies, equipment, and pharmaceutical inventory
          </p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
            Beta
          </div>
        </div>
      </div>

      {/* Work in Progress Component */}
      <WorkInProgress
        icon={Package}
        title="Inventory Management"
        description="Our inventory management will help you track medical supplies, equipment maintenance schedules, pharmaceutical stock levels, and automated reorder alerts."
      />
    </div>
  );
};

export default Inventory;
