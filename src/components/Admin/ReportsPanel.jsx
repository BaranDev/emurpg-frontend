import { useState } from "react";
import {
  Download,
  FileText,
  Calendar,
  Globe,
  AlertCircle,
  CheckCircle,
  Loader2,
  History,
  FileSpreadsheet,
} from "lucide-react";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import AdminButton from "./shared/AdminButton";

const ReportsPanel = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [lastGenerated, setLastGenerated] = useState(null);
  const [error, setError] = useState(null);

  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  const generateReport = async (reportType) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/api/admin/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey,
        },
        body: JSON.stringify({
          type: reportType,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `emurpg-report-${reportType}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setLastGenerated({
        type: reportType,
        time: new Date().toLocaleString(),
        language: selectedLanguage,
      });
    } catch (err) {
      console.error("Error generating report:", err);
      setError(err.message || "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const reportTypes = [
    {
      id: "current",
      title: "Current Event Report",
      description:
        "Generate a CSV report for the current active event including all tables and players.",
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      id: "previous",
      title: "Previous Event Report",
      description: "Generate a CSV report for the most recent completed event.",
      icon: History,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      id: "all",
      title: "All Events Report",
      description:
        "Generate a comprehensive CSV report including all events, tables, and player data.",
      icon: FileSpreadsheet,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-cinzel">Reports</h2>
          <p className="text-gray-400 text-sm">
            Generate and download CSV reports
          </p>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Globe className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-white">Report Language</h3>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedLanguage("en")}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
              selectedLanguage === "en"
                ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
            }`}
          >
            <span className="text-2xl mb-1 block">EN</span>
            <span className="text-sm">English</span>
          </button>
          <button
            onClick={() => setSelectedLanguage("tr")}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
              selectedLanguage === "tr"
                ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
            }`}
          >
            <span className="text-2xl mb-1 block">TR</span>
            <span className="text-sm">Turkish</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Last Generated Info */}
      {lastGenerated && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div>
            <p className="text-green-400">
              Successfully generated{" "}
              <span className="font-semibold">{lastGenerated.type}</span> report
            </p>
            <p className="text-green-400/70 text-sm">
              {lastGenerated.time} ({lastGenerated.language.toUpperCase()})
            </p>
          </div>
        </div>
      )}

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className={`${report.bgColor} border ${report.borderColor} rounded-xl p-6 hover:border-opacity-60 transition-colors`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${report.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${report.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {report.title}
                </h3>
              </div>

              <p className="text-gray-400 text-sm mb-6">{report.description}</p>

              <AdminButton
                onClick={() => generateReport(report.id)}
                disabled={isGenerating}
                className="w-full"
                icon={isGenerating ? Loader2 : Download}
              >
                {isGenerating ? "Generating..." : "Download CSV"}
              </AdminButton>
            </div>
          );
        })}
      </div>

      {/* Report Info */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-white">
            Report Information
          </h3>
        </div>

        <div className="space-y-4 text-gray-400">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">
              Current Event Report
            </h4>
            <p className="text-sm">
              Contains all data from the currently active event, including:
            </p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-gray-500">
              <li>Event name, date, and location</li>
              <li>All tables with game information</li>
              <li>Quest masters and their contact info</li>
              <li>Registered players with status (approved/backup)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-300 mb-2">
              Previous Event Report
            </h4>
            <p className="text-sm">
              Contains the same data structure as current event but for the most
              recently finished event. Useful for post-event analysis and record
              keeping.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-300 mb-2">
              All Events Report
            </h4>
            <p className="text-sm">
              A comprehensive report spanning all events in the database. Use
              this for:
            </p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-gray-500">
              <li>Historical data analysis</li>
              <li>Player participation tracking across events</li>
              <li>Quest master history</li>
              <li>Annual or semester summaries</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-sm">
              <span className="text-yellow-500 font-medium">Note:</span> Reports
              are generated in CSV format and can be opened in Excel, Google
              Sheets, or any spreadsheet application. The language selection
              affects column headers and status labels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPanel;
