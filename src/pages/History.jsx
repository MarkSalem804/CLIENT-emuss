import WorkInProgress from "../components/WorkInProgress";
import { History as HistoryIcon } from "lucide-react";

const History = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Clients History</h1>
          <p className="text-slate-600 mt-1">
            View complete history of client visits and treatments
          </p>
        </div>
      </div>

      {/* Work in Progress Component */}
      <WorkInProgress
        icon={HistoryIcon}
        title="Client History Tracking"
        description="We're developing a detailed client history system to track all visits, treatments, medications, and follow-up appointments for comprehensive care management."
      />
    </div>
  );
};

export default History;
