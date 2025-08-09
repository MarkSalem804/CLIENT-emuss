/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { TrendingUp, Users, RefreshCw } from "lucide-react";
import consultationIcon from "../assets/medical-report.png";
import preemploymentIcon from "../assets/doctor-visit.png";
import reinstatementIcon from "../assets/doctor-consultation.png";

const DashboardCard = ({ title, count, type, onClick }) => {
  const getIcon = () => {
    switch (type) {
      case "consultations":
        return (
          <img
            src={consultationIcon}
            alt="Consultation"
            className="w-10 h-10 text-blue-600"
          />
        );
      case "preemployment":
        return (
          <img
            src={preemploymentIcon}
            alt="Consultation"
            className="w-10 h-10 text-blue-600"
          />
        );
      case "reinstatement":
        return (
          <img
            src={reinstatementIcon}
            alt="Consultation"
            className="w-10 h-10 text-blue-600"
          />
        );
      default:
        return <Users className="w-8 h-8 text-gray-600" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case "consultations":
        return "bg-gradient-to-br from-cyan-200 to-blue-300 border-cyan-300/60 shadow-lg";
      case "preemployment":
        return "bg-gradient-to-br from-emerald-200 to-teal-300 border-emerald-300/60 shadow-lg";
      case "reinstatement":
        return "bg-gradient-to-br from-lime-200 to-emerald-300 border-lime-300/60 shadow-lg";
      default:
        return "bg-gradient-to-br from-sage-200 to-aqua-300 border-sage-300/60 shadow-lg";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative p-6 rounded-2xl border cursor-pointer transition-all duration-500 ease-in-out transform-gpu will-change-transform
        ${getGradient()}
        hover:shadow-xl hover:scale-105 hover:-translate-y-2
        group backdrop-blur-sm
      `}
      style={{
        minHeight: "200px",
        transitionProperty: "all",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-500">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900">
            {count.toLocaleString()}
          </p>
          <div className="flex items-center mt-3">
            <span className="text-xs text-emerald-800 font-semibold bg-white/80 px-2 py-1 rounded-full shadow-sm group-hover:bg-white/95 group-hover:shadow-md transition-all duration-500">
              +12% from last month
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className="p-4 rounded-2xl bg-white/90 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 ease-in-out backdrop-blur-sm border border-white/50 group-hover:border-white/80">
            <div className="transition-transform duration-500 ease-in-out group-hover:scale-105">
              {getIcon()}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none" />
    </div>
  );
};

export default DashboardCard;
