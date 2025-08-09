import WorkInProgress from "../components/WorkInProgress";
import { FileText } from "lucide-react";

const Records = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Medical Records</h1>
          <p className="text-slate-600 mt-1">
            Manage patient medical records and documentation
          </p>
        </div>
      </div>

      {/* Work in Progress Component */}
      <WorkInProgress
        icon={FileText}
        title="Medical Records"
        description="We're building a comprehensive medical records management. This will include patient files, medical history, lab results, and secure document storage."
      />
    </div>
  );
};

export default Records;
