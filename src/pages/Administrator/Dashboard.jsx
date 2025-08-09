import { useState } from "react";
import DashboardCard from "../../components/DashboardCard";
import EMUSSCalendar from "../../components/Calendar";
import { Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";

// Generate dynamic sample events based on current date
const generateSampleEvents = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();

  return [
    // Today's events - August 10th
    {
      id: 1,
      title: "Medical Consultation - Dr. Smith",
      start: new Date(currentYear, currentMonth, currentDate, 9, 0), // Today 9:00 AM
      end: new Date(currentYear, currentMonth, currentDate, 10, 0),
      resource: {
        type: "consultation",
        patient: "John Doe",
        doctor: "Dr. Smith",
        location: "Room 101",
      },
    },
    {
      id: 2,
      title: "Staff Meeting",
      start: new Date(currentYear, currentMonth, currentDate, 14, 0), // Today 2:00 PM
      end: new Date(currentYear, currentMonth, currentDate, 15, 30),
      resource: {
        type: "meeting",
        attendees: 12,
        location: "Conference Room A",
      },
    },
    {
      id: 3,
      title: "Follow-up Consultation",
      start: new Date(currentYear, currentMonth, currentDate, 16, 0), // Today 4:00 PM
      end: new Date(currentYear, currentMonth, currentDate, 17, 0),
      resource: {
        type: "consultation",
        patient: "Alice Brown",
        doctor: "Dr. Johnson",
        location: "Room 102",
      },
    },
    // Tomorrow's events
    {
      id: 4,
      title: "Pre-employment Medical Exam",
      start: new Date(currentYear, currentMonth, currentDate + 1, 8, 0), // Tomorrow 8:00 AM
      end: new Date(currentYear, currentMonth, currentDate + 1, 12, 0),
      resource: {
        type: "preemployment",
        patient: "Jane Wilson",
        examiner: "Dr. Johnson",
        location: "Exam Room 3",
      },
    },
    // Future events
    {
      id: 5,
      title: "Equipment Maintenance",
      start: new Date(currentYear, currentMonth, 15, 10, 0), // 15th of current month
      end: new Date(currentYear, currentMonth, 15, 12, 0),
      resource: {
        type: "maintenance",
        equipment: "X-Ray Machine",
        technician: "Tech Support Team",
        location: "Radiology Dept",
      },
    },
    {
      id: 6,
      title: "Health Seminar",
      start: new Date(currentYear, currentMonth, 20, 13, 0), // 20th of current month
      end: new Date(currentYear, currentMonth, 20, 16, 0),
      resource: {
        type: "meeting",
        attendees: 50,
        location: "Main Auditorium",
      },
    },
  ];
};

const Dashboard = () => {
  const [dashboardData] = useState({
    consultations: 1247,
    preemployment: 892,
    reinstatement: 156,
  });

  const [events, setEvents] = useState(generateSampleEvents());

  const handleCardClick = (type) => {
    console.log(`Clicked on ${type} card`);
    // Handle navigation or modal opening here
  };

  const todayStats = [
    {
      label: "Today's Appointments",
      value: 24,
      icon: Calendar,
      color: "text-blue-700",
      gradient: "bg-gradient-to-br from-blue-200 to-cyan-300",
      border: "border-blue-300/60",
    },
    {
      label: "Pending Reviews",
      value: 8,
      icon: Clock,
      color: "text-amber-700",
      gradient: "bg-gradient-to-br from-amber-200 to-orange-300",
      border: "border-amber-300/60",
    },
    {
      label: "Urgent Cases",
      value: 3,
      icon: AlertCircle,
      color: "text-pink-700",
      gradient: "bg-gradient-to-br from-pink-200 to-pink-300",
      border: "border-pink-300/60",
    },
    {
      label: "Completed Today",
      value: 18,
      icon: CheckCircle,
      color: "text-emerald-700",
      gradient: "bg-gradient-to-br from-emerald-200 to-lime-300",
      border: "border-emerald-300/60",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-blue-100/50">
        <h1 className="text-3xl font-bold text-slate-800">Medical Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Welcome back, Dr. Smith. Here&apos;s your overview for today.
        </p>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="TOTAL CONSULTATIONS"
          count={dashboardData.consultations}
          type="consultations"
          onClick={() => handleCardClick("consultations")}
        />
        <DashboardCard
          title="PRE-EMPLOYMENT CHECKS"
          count={dashboardData.preemployment}
          type="preemployment"
          onClick={() => handleCardClick("preemployment")}
        />
        <DashboardCard
          title="RE-INSTATEMENT CASES"
          count={dashboardData.reinstatement}
          type="reinstatement"
          onClick={() => handleCardClick("reinstatement")}
        />
      </div>

      {/* Today's Stats */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-blue-100/50">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          Today&apos;s Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {todayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`relative ${stat.gradient} p-5 rounded-xl border ${stat.border} hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 ease-in-out shadow-md cursor-pointer group transform-gpu will-change-transform`}
                style={{
                  transitionProperty: "all",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-white/90 shadow-md border border-white/50 group-hover:scale-105 group-hover:shadow-lg group-hover:border-white/80 transition-all duration-500 ease-in-out">
                    <Icon
                      className={`w-6 h-6 ${stat.color} group-hover:scale-105 transition-transform duration-500 ease-in-out`}
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-500 ease-in-out">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                </div>

                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Component */}
      <EMUSSCalendar events={events} onEventsChange={setEvents} />
    </div>
  );
};

export default Dashboard;
