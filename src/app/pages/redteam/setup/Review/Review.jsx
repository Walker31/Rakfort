import React, { useState } from "react";
import Button from "@mui/material/Button";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import TextField from "@mui/material/TextField";
import yaml from "js-yaml";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import { useRedTeamConfig } from "../hooks/useRedTeamConfig"; // Update path as needed

const Review = () => {
  // Zustand store: config and update methods
  const {
    config,
    updateConfig,
    updatePlugins,
    updateApplicationDefinition,
  } = useRedTeamConfig();

  // Dialog states (local UI state)
  const [isYamlDialogOpen, setIsYamlDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Job simulation states (for demo)
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [jobId, setJobId] = useState(null);

  // Run settings (local UI state, can be persisted if you want)
  const [debugMode, setDebugMode] = useState(false);
  const [delay, setDelay] = useState(0);

  // Handlers for config updates
  const handleDescriptionChange = (e) => {
    updateConfig("description", e.target.value);
  };

  const handleRemovePlugin = (idx) => {
    updatePlugins(config.plugins.filter((_, i) => i !== idx));
  };

  const handleRemoveStrategy = (idx) => {
    updateConfig(
      "strategies",
      config.strategies.filter((_, i) => i !== idx)
    );
  };

  // YAML actions
  const handleSaveYaml = () => {
    const yamlStr = yaml.dump(config);
    const blob = new Blob([yamlStr], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "config.yaml";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleViewYaml = () => setIsYamlDialogOpen(true);
  const handleCloseYamlDialog = () => setIsYamlDialogOpen(false);

  // Run simulation (replace with real API)
  const handleRunNow = async () => {
    setIsRunning(true);
    setLogs([]);
    const fakeJobId = Date.now();
    setJobId(fakeJobId);

    let count = 0;
    const interval = setInterval(() => {
      setLogs((l) => [...l, `Log line ${++count}`]);
      if (count === 5) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, delay || 1000);
  };

  const handleCancel = () => {
    setIsRunning(false);
    setLogs((l) => [...l, "Job cancelled by user"]);
  };

  return (
    <div className="p-6 flex flex-col text-white gap-6">
      <div className="text-3xl font-bold">Review your Configuration.</div>

      {/* Configuration Description */}
      <div className="p-4 flex flex-col gap-4">
        <div className="text-xl font-semibold">Configuration Description</div>
        <label htmlFor="config-description" className="text-sm font-medium">
          Description
        </label>
        <TextField
          value={config.description}
          onChange={handleDescriptionChange}
          variant="outlined"
          className="mb-2 bg-[#2B1449] rounded-xl"
          InputProps={{ style: { color: "white" } }}
        />
      </div>

      {/* Configuration Summary */}
      <div className="p-4 flex flex-col gap-4">
        <div className="text-xl font-semibold">Configuration Summary</div>

        {/* Plugins */}
        <div className="p-6 rounded-2xl bg-[#2B1449]">
          <div className="text-xl font-medium mb-2">Plugins</div>
          <div className="flex flex-wrap gap-2">
            {config.plugins.map((plugin, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1 bg-[#9747FF] text-white font-semibold rounded-full px-3 py-1"
              >
                <span>{typeof plugin === "string" ? plugin : plugin.id}</span>
                <CancelSharpIcon
                  sx={{ fontSize: 18 }}
                  className="cursor-pointer"
                  titleAccess="Remove"
                  onClick={() => handleRemovePlugin(i)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Strategies */}
        <div className="p-6 rounded-2xl bg-[#2B1449]">
          <div className="text-xl font-medium mb-2">Strategies</div>
          <div className="flex flex-wrap gap-3">
            {config.strategies.map((strategy, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1 bg-[#9747FF] text-white font-semibold rounded-full px-3 py-1"
              >
                <span>
                  {typeof strategy === "string"
                    ? strategy
                    : strategy.id || JSON.stringify(strategy)}
                </span>
                <CancelSharpIcon
                  sx={{ fontSize: 18 }}
                  className="cursor-pointer"
                  titleAccess="Remove"
                  onClick={() => handleRemoveStrategy(i)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className="p-6 rounded-2xl bg-[#2B1449] flex flex-col gap-2">
          <div className="text-xl font-medium">Additional Details</div>
          <div className="text-sm text-white">
            <strong>Purpose:</strong> {config.purpose || "No purpose provided."}
          </div>
        </div>

        {/* CLI Option */}
        <div>
          <div className="bg-[#2B1449] p-6 rounded-t-2xl flex flex-col gap-6 border-b-2 border-gray-500">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col gap-2 max-w-md">
                <div className="text-xl font-semibold">
                  Option 1: Save and run via CLI
                </div>
                <div className="text-gray-300 text-sm">
                  Save your configuration and run it from the command line. Full
                  control over the evaluation process, good for larger scale.
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Button
                  variant="contained"
                  onClick={handleSaveYaml}
                  sx={{
                    bgcolor: "#7904DF",
                    borderRadius: 2,
                    ":hover": { bgcolor: "#9747FF" },
                    color: "white",
                  }}
                >
                  Save YAML
                </Button>
                <Button
                  variant="contained"
                  onClick={handleViewYaml}
                  sx={{
                    bgcolor: "#7904DF",
                    borderRadius: 2,
                    ":hover": { bgcolor: "#9747FF" },
                    color: "white",
                  }}
                >
                  View YAML
                </Button>
                <Dialog open={isYamlDialogOpen} onClose={handleCloseYamlDialog}>
                  <DialogTitle>YAML Configuration</DialogTitle>
                  <DialogContent>
                    <pre className="whitespace-pre-wrap text-xs">
                      {yaml.dump(config)}
                    </pre>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Browser Run Option */}
          <div className="bg-[#2B1449] p-6 rounded-b-2xl flex flex-col md:flex-row justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-md">
              <div className="text-xl font-semibold">
                Option 2: Run directly in Browser
              </div>
              <div className="text-gray-300 text-sm">
                Run the red team evaluation right here. Simpler but less
                powerful than the CLI, good for tests and small scans.
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  variant="contained"
                  onClick={handleRunNow}
                  disabled={isRunning}
                  sx={{
                    bgcolor: "#7904DF",
                    borderRadius: 2,
                    ":hover": { bgcolor: "#9747FF" },
                    color: "white",
                  }}
                >
                  {isRunning ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Run Now"
                  )}
                </Button>
                <Button onClick={() => setIsSettingsOpen(true)}>
                  Run Settings
                </Button>
                {isRunning && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              {logs.length > 0 && (
                <div className="bg-black text-green-400 p-2 mt-2 rounded max-h-40 overflow-y-auto text-xs">
                  {logs.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
              {!isRunning && jobId && (
                <div className="flex gap-2 mt-2">
                  <a
                    href={`/report?jobId=${jobId}`}
                    className="text-blue-400 underline"
                  >
                    View Report
                  </a>
                  <a
                    href={`/eval?jobId=${jobId}`}
                    className="text-blue-400 underline"
                  >
                    View Probes
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Run Settings Dialog */}
          <Dialog open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
            <DialogTitle>Run Settings</DialogTitle>
            <DialogContent>
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span>Debug Mode</span>
                  <Switch
                    checked={debugMode}
                    onChange={(e) => setDebugMode(e.target.checked)}
                  />
                </div>
                <TextField
                  label="Delay (ms)"
                  type="number"
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  fullWidth
                />
                <TextField
                  label="Number of Tests"
                  type="number"
                  value={config.numTests}
                  onChange={(e) =>
                    updateConfig("numTests", Number(e.target.value))
                  }
                  fullWidth
                />
                <Button
                  onClick={() => setIsSettingsOpen(false)}
                  sx={{ mt: 1 }}
                  variant="outlined"
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Review;
