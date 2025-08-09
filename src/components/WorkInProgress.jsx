import PropTypes from "prop-types";

const WorkInProgress = ({
  icon: IconComponent,
  title = "This Page is Work in Progress",
  description = "We're working hard to bring you this feature. Stay tuned for updates!",
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-emerald-200/30 p-6 ${className}`}
    >
      <div style={{ minHeight: "500px" }}>
        <div
          className="h-full flex flex-col items-center justify-center text-center"
          style={{ paddingTop: "80px" }}
        >
          <div className="text-6xl mb-6">
            {IconComponent ? (
              <IconComponent className="w-16 h-16 text-slate-400" />
            ) : (
              "🚧"
            )}
          </div>
          <h4 className="text-xl font-medium text-slate-800 mb-3">{title}</h4>
          <p className="text-slate-600 max-w-md">{description}</p>
          <div className="mt-6">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

WorkInProgress.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
};

export default WorkInProgress;
