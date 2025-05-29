import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRedTeamConfig } from "../hooks/useRedTeamConfig"; // Update path as needed

// Example strategy constants (replace with your actual constants)
const SINGLE_TURN_STRATEGIES = [
  { id: "audio", title: "Audio", description: "Tests detection of audio-based payloads." },
  // ...other single-turn strategies
];
const MULTI_TURN_STRATEGIES = [
  { id: "crescendo", title: "Multi turn Crescendo", description: "Progressive multi turn attacks." },
  // ...other multi-turn strategies
];
const STRATEGY_PRESETS = {
  Quick: ["audio", "basic"],
  Medium: ["audio", "basic", "best-of-n"],
  Large: ["audio", "basic", "best-of-n", "crescendo"],
  Custom: [],
};

const Strategies = () => {
  const navigate = useNavigate();
  const { config, updateConfig } = useRedTeamConfig();
  const [selectedPreset, setSelectedPreset] = useState("Custom");

  // Derived state for selected IDs
  const selectedSingle = useMemo(
    () => config.strategies.filter((s) => SINGLE_TURN_STRATEGIES.some(st => st.id === s)).map(s => s),
    [config.strategies]
  );
  const selectedMulti = useMemo(
    () => config.strategies.filter((s) => MULTI_TURN_STRATEGIES.some(mt => mt.id === s)).map(s => s),
    [config.strategies]
  );

  // Preset selection handler
  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    updateConfig("strategies", STRATEGY_PRESETS[preset]);
  };

  // Toggle strategy
  const handleCardClick = (id) => {
    setSelectedPreset("Custom");
    const current = config.strategies;
    updateConfig(
      "strategies",
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id]
    );
  };

  // Estimated probes (dummy logic)
  const estimatedProbes = config.strategies.length * 1000;

  return (
    <div className="flex flex-col p-10 gap-5">
      <div className="dark:text-white text-3xl">Strategy Configuration</div>
      <div className="dark:text-white dark:bg-[#2B1449] rounded-xl my-4 mx-6 py-3 px-6 flex items-center gap-2">
        Estimated probes: <span className="font-bold">{estimatedProbes}</span>
        <Tooltip title="Probes are the number of requests to the target application">
          <InfoOutlinedIcon fontSize="small" />
        </Tooltip>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap gap-4 justify-around">
        {Object.keys(STRATEGY_PRESETS).map((label, idx) => (
          <div
            key={idx}
            className={`dark:bg-[#2B1449] p-5 rounded-2xl w-[220px] flex flex-col gap-2 cursor-pointer hover:ring-2 ring-indigo-400 transition
              ${selectedPreset === label ? "ring-2 ring-indigo-500" : ""}`}
            tabIndex={0}
            role="button"
            onClick={() => handlePresetSelect(label)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handlePresetSelect(label);
            }}
          >
            <div className="dark:text-white">{label}</div>
            {/* ...preset descriptions as before */}
          </div>
        ))}
      </div>

      {/* Single-turn Strategies */}
      <div>
        <div className="text-3xl dark:text-white mb-4">Single-turn Strategies</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SINGLE_TURN_STRATEGIES.map((strategy, index) => (
            <div
              key={index}
              className={`dark:bg-[#2B1449] flex flex-row p-4 rounded-xl cursor-pointer transition ring-0 hover:ring-2 ring-indigo-400
                ${selectedSingle.includes(strategy.id) ? "ring-2 ring-indigo-500" : ""}`}
              tabIndex={0}
              role="button"
              onClick={() => handleCardClick(strategy.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCardClick(strategy.id);
              }}
            >
              <div onClick={e => e.stopPropagation()} className="flex items-center">
                <Checkbox
                  checked={selectedSingle.includes(strategy.id)}
                  onChange={() => handleCardClick(strategy.id)}
                />
              </div>
              <div className="flex flex-col px-2">
                <div className="text-white">{strategy.title}</div>
                <div className="text-gray-400 text-sm">{strategy.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-turn Strategies */}
      <div>
        <div className="dark:text-white text-2xl mt-8 mb-4">Multi-turn Strategies</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {MULTI_TURN_STRATEGIES.map((strategy, index) => (
            <div
              key={index}
              className={`dark:bg-[#2B1449] flex flex-row p-4 rounded-xl cursor-pointer transition ring-0 hover:ring-2 ring-indigo-400
                ${selectedMulti.includes(strategy.id) ? "ring-2 ring-indigo-500" : ""}`}
              tabIndex={0}
              role="button"
              onClick={() => handleCardClick(strategy.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCardClick(strategy.id);
              }}
            >
              <div onClick={e => e.stopPropagation()} className="flex items-center">
                <Checkbox
                  checked={selectedMulti.includes(strategy.id)}
                  onChange={() => handleCardClick(strategy.id)}
                />
              </div>
              <div className="flex flex-col px-2">
                <div className="text-white">{strategy.title}</div>
                <div className="text-gray-400 text-sm">{strategy.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-10">
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/redteam/setup/plugin")}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={config.strategies.length === 0}
          onClick={() => {
            if (config.strategies.length === 0) {
              alert("Select at least one strategy!");
              return;
            }
            navigate("/redteam/setup/review");
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Strategies;
