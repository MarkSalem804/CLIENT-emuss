import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const TodaysAppointments = ({ events = [] }) => {
  // Filter events for today only
  const todaysEvents = useMemo(() => {
    const today = new Date();
    const todayDateString = today.toDateString();

    return events
      .filter((event) => event.start.toDateString() === todayDateString)
      .map((event) => ({
        id: event.id,
        time: `${event.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${event.end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        title: event.title,
        type: event.resource?.type || "consultation",
        patient: event.resource?.patient || "N/A",
        doctor: event.resource?.doctor || "N/A",
        location: event.resource?.location || "N/A",
        original: event,
      }))
      .sort(
        (a, b) =>
          new Date(`1970/01/01 ${a.time.split(" - ")[0]}`) -
          new Date(`1970/01/01 ${b.time.split(" - ")[0]}`)
      );
  }, [events]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "time",
        header: "Time",
        size: 140,
        cell: ({ getValue }) => (
          <div className="font-medium text-gray-900">{getValue()}</div>
        ),
      },
      {
        accessorKey: "title",
        header: "Appointment",
        size: 280,
        cell: ({ getValue }) => (
          <div
            className="truncate font-medium text-gray-900"
            title={getValue()}
          >
            {getValue()}
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        size: 120,
        cell: ({ getValue }) => {
          const type = getValue();
          const getTypeColor = (type) => {
            switch (type) {
              case "consultation":
                return "bg-emerald-100 text-emerald-800";
              case "preemployment":
                return "bg-blue-100 text-blue-800";
              case "meeting":
                return "bg-yellow-100 text-yellow-800";
              case "maintenance":
                return "bg-purple-100 text-purple-800";
              default:
                return "bg-gray-100 text-gray-800";
            }
          };

          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                type
              )}`}
            >
              {type}
            </span>
          );
        },
      },
      {
        accessorKey: "patient",
        header: "Patient",
        size: 160,
        cell: ({ getValue }) => (
          <div className="text-gray-600 truncate" title={getValue()}>
            {getValue()}
          </div>
        ),
      },
      {
        accessorKey: "location",
        header: "Location",
        size: 120,
        cell: ({ getValue }) => (
          <div className="text-gray-600 text-sm truncate" title={getValue()}>
            {getValue()}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        size: 120,
        cell: ({ row }) => (
          <div className="flex space-x-1">
            <button
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
              title="View Details"
            >
              View
            </button>
            <button
              className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium hover:bg-emerald-200 transition-colors"
              title="Edit Appointment"
            >
              Edit
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: todaysEvents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: "time", desc: false }], // Sort by time ascending
    },
  });

  const getTodayFormatted = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-200/30 p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              📅 Today's Appointments
            </h3>
            <p className="text-sm text-slate-600">
              {getTodayFormatted()} • {todaysEvents.length} appointment
              {todaysEvents.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">
              {todaysEvents.length}
            </div>
            <div className="text-xs text-slate-500">appointments</div>
          </div>
        </div>
      </div>

      <div style={{ minHeight: "450px" }}>
        {todaysEvents.length === 0 ? (
          <div
            className="h-full flex flex-col items-center justify-center text-center"
            style={{ paddingTop: "60px" }}
          >
            <div className="text-6xl mb-6">📅</div>
            <h4 className="text-lg font-medium text-slate-800 mb-3">
              No appointments today
            </h4>
            <p className="text-slate-600">
              You have a free day! Enjoy your time or catch up on other tasks.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto" style={{ minHeight: "500px" }}>
            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-emerald-50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border border-gray-200 px-3 py-3 text-left text-sm font-semibold text-emerald-800 cursor-pointer hover:bg-emerald-100 transition-colors"
                        style={{ width: header.getSize() }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center space-x-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() && (
                            <span className="text-emerald-600">
                              {header.column.getIsSorted() === "desc"
                                ? "↓"
                                : "↑"}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-emerald-50 transition-colors`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border border-gray-200 px-3 py-3 text-sm"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Fill remaining space if there are few appointments */}
                {todaysEvents.length < 8 &&
                  Array.from({ length: 8 - todaysEvents.length }).map(
                    (_, index) => (
                      <tr key={`empty-${index}`} className="bg-white">
                        <td
                          className="border border-gray-200 px-3 py-3 text-sm"
                          colSpan={6}
                        >
                          <div style={{ height: "41px" }}></div>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysAppointments;
