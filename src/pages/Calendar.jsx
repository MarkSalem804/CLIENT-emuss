import React, { useState } from "react";
import EMUSSCalendar from "../components/Calendar";
import TodaysAppointments from "../components/TodaysAppointments";

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

const CalendarPage = () => {
  const [events, setEvents] = useState(generateSampleEvents());

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Appointments and Schedule Management
          </h1>
          <p className="text-slate-600 mt-1">
            Schedule and manage medical appointments, meetings, and procedures
          </p>
        </div>
      </div>

      {/* Today's Appointments Table */}
      <TodaysAppointments events={events} />

      {/* Calendar Component */}
      <EMUSSCalendar events={events} onEventsChange={setEvents} />
    </div>
  );
};

export default CalendarPage;
