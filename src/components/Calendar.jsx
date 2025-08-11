/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "../styles/calendar.css"; // Custom calendar styles
import { Plus, Clock, MapPin, Users } from "lucide-react";
import PropTypes from "prop-types";

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Create drag-and-drop enabled calendar
const DragAndDropCalendar = withDragAndDrop(Calendar);

// Generate dynamic sample events based on current date
const generateSampleEvents = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return [
    {
      id: 1,
      title: "Medical Consultation - Dr. Smith",
      start: new Date(currentYear, currentMonth, 15, 9, 0), // 15th of current month, 9:00 AM
      end: new Date(currentYear, currentMonth, 15, 10, 0),
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
      start: new Date(currentYear, currentMonth, 20, 14, 0), // 20th of current month, 2:00 PM
      end: new Date(currentYear, currentMonth, 20, 15, 30),
      resource: {
        type: "meeting",
        attendees: 12,
        location: "Conference Room A",
      },
    },
    {
      id: 3,
      title: "Pre-employment Medical Exam",
      start: new Date(currentYear, currentMonth, 25, 8, 0), // 25th of current month, 8:00 AM
      end: new Date(currentYear, currentMonth, 25, 12, 0),
      resource: {
        type: "preemployment",
        patient: "Jane Wilson",
        examiner: "Dr. Johnson",
        location: "Exam Room 3",
      },
    },
    {
      id: 4,
      title: "Equipment Maintenance",
      start: new Date(currentYear, currentMonth, 28, 10, 0), // 28th of current month, 10:00 AM
      end: new Date(currentYear, currentMonth, 28, 12, 0),
      resource: {
        type: "maintenance",
        equipment: "X-Ray Machine",
        technician: "Tech Support Team",
        location: "Radiology Dept",
      },
    },
  ];
};

// Sample events data - dynamically generated
const initialEvents = generateSampleEvents();

// Custom event component - Simple Pastel Style
const EventComponent = ({ event }) => {
  // Pastel colors array
  const pastelColors = [
    "#FFE4E1", // Misty Rose
    "#E0E6FF", // Lavender Blue
    "#E1F5E1", // Mint Green
    "#FFF0E6", // Peach
    "#F0E6FF", // Lavender
    "#E6F3FF", // Alice Blue
    "#FFE6F0", // Light Pink
    "#E6FFE6", // Honeydew
    "#FFFFE0", // Light Yellow
    "#E0F2E0", // Light Green
  ];

  // Get a consistent color based on date (use hash of date string)
  const getEventColor = (dateString) => {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return pastelColors[Math.abs(hash) % pastelColors.length];
  };

  // Get the display text and tooltip
  const eventCount = event.eventsCount || 1;
  const displayText = event.title; // This is already formatted as "X event(s) this date"

  // Create tooltip with all event titles
  const tooltipText = event.originalEvents
    ? event.originalEvents.map((e) => e.title).join("\n")
    : event.title;

  return (
    <div
      style={{
        background: getEventColor(event.start.toDateString()),
        color: "#374151",
        padding: "4px 8px",
        margin: "1px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: "500",
        minHeight: "20px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        cursor: "pointer",
        border: "1px solid rgba(0, 0, 0, 0.1)",
      }}
      title={tooltipText}
    >
      {displayText}
    </div>
  );
};

EventComponent.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
    eventsCount: PropTypes.number,
    originalEvents: PropTypes.array,
    resource: PropTypes.shape({
      type: PropTypes.string,
      patient: PropTypes.string,
    }),
  }).isRequired,
};

const EMUSSCalendar = ({
  className = "",
  events: propEvents,
  onEventsChange,
}) => {
  const [events, setEvents] = useState(propEvents || initialEvents);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState("month");

  // Helper function to update events both locally and in parent
  const updateEvents = (newEvents) => {
    if (typeof newEvents === "function") {
      setEvents((prevEvents) => {
        const updatedEvents = newEvents(prevEvents);
        if (onEventsChange) onEventsChange(updatedEvents);
        return updatedEvents;
      });
    } else {
      setEvents(newEvents);
      if (onEventsChange) onEventsChange(newEvents);
    }
  };

  // Group events by date and create representative events (Month View only)
  const getGroupedEvents = () => {
    const groupedByDate = {};

    // Group events by date
    events.forEach((event) => {
      const dateKey = event.start.toDateString();
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }
      groupedByDate[dateKey].push(event);
    });

    // Create one representative event per date
    return Object.keys(groupedByDate).map((dateKey) => {
      const eventsOnDate = groupedByDate[dateKey];
      const firstEvent = eventsOnDate[0];

      return {
        ...firstEvent,
        id: `grouped-${dateKey}`, // Unique ID for grouped event
        title: `${eventsOnDate.length} event${
          eventsOnDate.length === 1 ? "" : "s"
        } this date`,
        eventsCount: eventsOnDate.length,
        originalEvents: eventsOnDate, // Keep reference to original events
      };
    });
  };

  // Get events based on current view
  const getEventsForView = () => {
    if (currentView === "month") {
      return getGroupedEvents(); // Use grouped events for Month View
    } else {
      return events; // Use individual events for Week/Day/Agenda views
    }
  };

  // Custom event wrapper for grouped events
  const EventWrapper = ({ event }) => {
    return <EventComponent event={event} />;
  };

  // Get current school year (June-May academic year)
  const getCurrentSchoolYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based (0 = January, 5 = June)

    // School year starts in June (month 5) and ends in May (month 4)
    // If current month is June-December, school year is current-next year
    // If current month is January-May, school year is previous-current year
    if (currentMonth >= 5) {
      // June or later
      return `${currentYear} - ${currentYear + 1}`;
    } else {
      // January-May
      return `${currentYear - 1} - ${currentYear}`;
    }
  };
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    type: "consultation",
    patient: "",
    doctor: "",
    location: "",
  });

  // Handle selecting an event
  const handleSelectEvent = useCallback(
    (event) => {
      setSelectedEvent(event);

      // If it's a grouped event, show the event list modal
      if (event.originalEvents && event.originalEvents.length > 0) {
        setShowEventModal(true);
        return;
      }

      // If it's a single event, show the edit form
      setNewEvent({
        title: event.title,
        start: event.start,
        end: event.end,
        type: event.resource?.type || "consultation",
        patient: event.resource?.patient || "",
        doctor: event.resource?.doctor || "",
        location: event.resource?.location || "",
      });
      setShowEventModal(true);
    },
    [updateEvents]
  );

  // Handle selecting a time slot to create new event
  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      setNewEvent({
        title: "",
        start,
        end,
        type: "consultation",
        patient: "",
        doctor: "",
        location: "",
      });
      setSelectedEvent(null);
      setShowEventModal(true);
    },
    [updateEvents]
  );

  // Handle creating/updating events
  const handleSaveEvent = () => {
    // Validate required fields
    if (!newEvent.title.trim()) {
      alert("Please enter an event title");
      return;
    }

    if (selectedEvent) {
      // Update existing event
      const updatedEvent = {
        ...selectedEvent,
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        resource: {
          type: newEvent.type,
          patient: newEvent.patient,
          doctor: newEvent.doctor,
          location: newEvent.location,
        },
      };
      updateEvents(
        events.map((event) =>
          event.id === selectedEvent.id ? updatedEvent : event
        )
      );
    } else {
      // Create new event
      const event = {
        id: Date.now(), // Simple ID generation
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        resource: {
          type: newEvent.type,
          patient: newEvent.patient,
          doctor: newEvent.doctor,
          location: newEvent.location,
        },
      };
      console.log("Creating new event:", event);
      updateEvents([...events, event]);
      console.log("Total events after creation:", [...events, event].length);
    }
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  // Handle deleting events
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      updateEvents(events.filter((event) => event.id !== selectedEvent.id));
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  // Handle clearing all events for a specific date
  const handleClearAllEvents = () => {
    if (selectedEvent && selectedEvent.originalEvents) {
      const dateKey = selectedEvent.start.toDateString();
      updateEvents(
        events.filter((event) => event.start.toDateString() !== dateKey)
      );
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  // Handle individual event actions
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      start: event.start,
      end: event.end,
      type: event.resource?.type || "consultation",
      patient: event.resource?.patient || "",
      doctor: event.resource?.doctor || "",
      location: event.resource?.location || "",
    });
    // Keep modal open but switch to edit mode
  };

  const handleDeleteSingleEvent = (eventToDelete) => {
    updateEvents(events.filter((event) => event.id !== eventToDelete.id));
    // If this was the last event for the date, close modal
    const remainingEventsOnDate = events.filter(
      (event) =>
        event.start.toDateString() === eventToDelete.start.toDateString() &&
        event.id !== eventToDelete.id
    );

    if (remainingEventsOnDate.length === 0) {
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  const handleViewEvent = (event) => {
    // For now, just show alert with event details
    alert(
      `Event Details:\n\nTitle: ${
        event.title
      }\nStart: ${event.start.toLocaleString()}\nEnd: ${event.end.toLocaleString()}\nType: ${
        event.resource?.type || "N/A"
      }\nPatient: ${event.resource?.patient || "N/A"}\nLocation: ${
        event.resource?.location || "N/A"
      }`
    );
  };

  // Handle drag and drop events
  const handleEventDrop = useCallback(
    ({ event, start, end }) => {
      updateEvents((prevEvents) =>
        prevEvents.map((existingEvent) =>
          existingEvent.id === event.id
            ? { ...existingEvent, start, end }
            : existingEvent
        )
      );
    },
    [updateEvents]
  );

  // Handle resizing events
  const handleEventResize = useCallback(
    ({ event, start, end }) => {
      updateEvents((prevEvents) =>
        prevEvents.map((existingEvent) =>
          existingEvent.id === event.id
            ? { ...existingEvent, start, end }
            : existingEvent
        )
      );
    },
    [updateEvents]
  );

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border-2 border-emerald-300/80 ${className}`}
    >
      {/* Calendar Header */}
      <div className="p-6 border-b border-emerald-200/30">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold text-slate-800">
              MEDICAL CALENDAR
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              S.Y. {getCurrentSchoolYear()}
            </p>
          </div>
          <button
            onClick={() => {
              setNewEvent({
                title: "",
                start: new Date(),
                end: new Date(),
                type: "consultation",
                patient: "",
                doctor: "",
                location: "",
              });
              setSelectedEvent(null);
              setShowEventModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Component */}
      <div className="p-6">
        <div style={{ height: "600px" }}>
          <DragAndDropCalendar
            localizer={localizer}
            events={getEventsForView()}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            onView={(view) => setCurrentView(view)}
            selectable
            resizable
            views={["month", "week", "day", "agenda"]}
            defaultView="month"
            components={{
              event: EventWrapper,
            }}
            style={{ height: "100%" }}
            className="emuss-calendar"
            dayPropGetter={() => ({
              className:
                "hover:bg-emerald-50/50 transition-colors duration-200",
            })}
            slotPropGetter={() => ({
              className:
                "hover:bg-emerald-50/30 transition-colors duration-200",
            })}
            dragFromOutsideItem={() => ({
              id: "new",
              title: "New Event",
            })}
          />
        </div>
      </div>

      {/* Event Modal using Portal */}
      {showEventModal &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            style={{ zIndex: 99999 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[80vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-slate-800">
                  {selectedEvent && selectedEvent.originalEvents
                    ? `Events for ${selectedEvent.start.toLocaleDateString()}`
                    : selectedEvent
                    ? "Edit Event"
                    : "Create New Event"}
                </h3>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Show Events Table if it's a grouped event */}
                {selectedEvent && selectedEvent.originalEvents ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      {selectedEvent.originalEvents.length} event
                      {selectedEvent.originalEvents.length === 1
                        ? ""
                        : "s"}{" "}
                      scheduled for this date
                    </p>

                    {/* Events Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-200 rounded-lg">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Event Title
                            </th>
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Time
                            </th>
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Type
                            </th>
                            <th className="border border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/4">
                              Patient
                            </th>
                            <th className="border border-gray-200 px-2 py-3 text-center text-sm font-semibold text-gray-700 w-32">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEvent.originalEvents.map((event, index) => (
                            <tr
                              key={event.id}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                {event.title}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                {event.start.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                -{" "}
                                {event.end.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                                  {event.resource?.type || "N/A"}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-6 py-3 text-sm text-gray-600 w-1/4">
                                {event.resource?.patient || "N/A"}
                              </td>
                              <td className="border border-gray-200 px-2 py-3 text-center w-32">
                                <div className="flex justify-center space-x-1">
                                  <button
                                    onClick={() => handleViewEvent(event)}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors duration-200"
                                    title="View Details"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleEditEvent(event)}
                                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium hover:bg-emerald-200 transition-colors duration-200"
                                    title="Edit Event"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSingleEvent(event)
                                    }
                                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors duration-200"
                                    title="Delete Event"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* Show Event Edit Form */
                  <div className="space-y-4">
                    {/* Event Title */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter event title"
                      />
                    </div>

                    {/* Event Type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Event Type
                      </label>
                      <select
                        value={newEvent.type}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, type: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="consultation">
                          Medical Consultation
                        </option>
                        <option value="preemployment">
                          Pre-employment Exam
                        </option>
                        <option value="meeting">Staff Meeting</option>
                        <option value="maintenance">
                          Equipment Maintenance
                        </option>
                      </select>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Start Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={moment(newEvent.start).format(
                            "YYYY-MM-DDTHH:mm"
                          )}
                          onChange={(e) =>
                            setNewEvent({
                              ...newEvent,
                              start: new Date(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          End Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={moment(newEvent.end).format(
                            "YYYY-MM-DDTHH:mm"
                          )}
                          onChange={(e) =>
                            setNewEvent({
                              ...newEvent,
                              end: new Date(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Additional Fields */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Patient/Attendee
                      </label>
                      <input
                        type="text"
                        value={newEvent.patient}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, patient: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Patient name or attendees"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Doctor/Responsible Person
                      </label>
                      <input
                        type="text"
                        value={newEvent.doctor}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, doctor: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Doctor or responsible person"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={newEvent.location}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, location: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Room or location"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex-shrink-0 p-6 border-t border-gray-200 flex justify-between">
                <div>
                  {selectedEvent && selectedEvent.originalEvents ? (
                    /* Show "Clear All Events" button for grouped events */
                    <button
                      onClick={handleClearAllEvents}
                      className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200"
                    >
                      Clear All Events
                    </button>
                  ) : selectedEvent ? (
                    /* Show "Delete Event" button for individual events */
                    <button
                      onClick={handleDeleteEvent}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      Delete Event
                    </button>
                  ) : null}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEvent}
                    disabled={!newEvent.title}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedEvent ? "Update Event" : "Create Event"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

EMUSSCalendar.propTypes = {
  className: PropTypes.string,
  events: PropTypes.array,
  onEventsChange: PropTypes.func,
};

export default EMUSSCalendar;
