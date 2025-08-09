import WorkInProgress from "../components/WorkInProgress";
import { UserCheck } from "lucide-react";

const Doctors = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Doctor's Directory
          </h1>
          <p className="text-slate-600 mt-1">
            Manage doctor profiles, specializations, and availability schedules
          </p>
        </div>
      </div>

      {/* Work in Progress Component */}
      <WorkInProgress
        icon={UserCheck}
        title="Doctor's Directory"
        description="We're creating a comprehensive directory to manage doctor's files/documents, schedules, and appointment booking preferences."
      />
    </div>
  );
};

export default Doctors;
