import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { ArrowBackIos } from "@mui/icons-material";
import { ArrowForward } from "@mui/icons-material";

const singleTurnStrategies = [
  {
    title: "Audio",
    description:
      "Tests detection and handling of audio-based malicious payloads.",
  },
  {
    title: "Base64 encoding",
    description:
      "Tests detection and handling of base64 based malicious payloads.",
  },
  {
    title: "Basic",
    description:
      "Equivalent to no strategy. Always included. Can be disabled in configuration.",
  },
  {
    title: "Best-of-N",
    description:
      "Jailbreak technique published by Anthropic and Stanford.",
  },
  {
    title: "Authority Bias",
    description:
      "Exploits academic authority bias to circumvent content filtering mechanism.",
  },
];

const multiTurnStrategies = [
  {
    title: "Multi turn Crescendo",
    description:
      "Executes progressive multi turn attacks with escalating malicious intent.",
  },
  {
    title: "Generative Offensive agent tester",
    description:
      "Deploys dynamic attack generation using advanced adversial techniques.",
  },
];

const Strategies = () => {
  const [selectedSingle, setSelectedSingle] = useState([]);
  const [selectedMulti, setSelectedMulti] = useState([]);
  const navigate = useNavigate();

  const handleCardClick = (title, type) => {
    if (type === "single") {
      setSelectedSingle((prev) =>
        prev.includes(title)
          ? prev.filter((t) => t !== title)
          : [...prev, title]
      );
    } else {
      setSelectedMulti((prev) =>
        prev.includes(title)
          ? prev.filter((t) => t !== title)
          : [...prev, title]
      );
    }
  };

  return (
    <div className="flex flex-col p-10 gap-5">
      <div className="dark:text-white text-3xl">Strategy Configuration</div>

      <div className="dark:text-white dark:bg-[#2B1449] rounded-xl my-4 mx-6 py-3 px-6">
        Estimated probes: 5600
      </div>

      <div className="flex flex-wrap gap-4 justify-around">
        {["Quick", "Medium", "Large", "Custom"].map((label, idx) => (
          <div
            key={idx}
            className="dark:bg-[#2B1449] p-5 rounded-2xl w-[220px] flex flex-col gap-2 cursor-pointer hover:ring-2 ring-indigo-400 transition"
            tabIndex={0}
            role="button"
            onClick={() => alert(`Selected: ${label}`)} // Replace with your logic
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                alert(`Selected: ${label}`);
              }
            }}
          >
            <div className="dark:text-white">{label}</div>
            <div className="dark:text-gray-400 text-sm">
              {label === "Quick" && (
                <>
                  <p>Use to verify that your</p>
                  <p>configuration is correct.</p>
                </>
              )}
              {label === "Medium" && (
                <>
                  <p>Recommended strategies</p>
                  <p>for moderate coverage.</p>
                </>
              )}
              {label === "Large" && (
                <>
                  <p>A large set of strategies for</p>
                  <p>a more comprehensive red team.</p>
                </>
              )}
              {label === "Custom" && (
                <>
                  <p>Configure your own set of</p>
                  <p>strategies.</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-3xl dark:text-white mb-4">
          Single-turn Strategies
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {singleTurnStrategies.map((strategy, index) => (
            <div
              key={index}
              className={`dark:bg-[#2B1449] flex flex-row p-4 rounded-xl cursor-pointer transition ring-0 hover:ring-2 ring-indigo-400 ${
                selectedSingle.includes(strategy.title) ? "ring-2 ring-indigo-500" : ""
              }`}
              tabIndex={0}
              role="button"
              onClick={() => handleCardClick(strategy.title, "single")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleCardClick(strategy.title, "single");
                }
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center"
              >
                <Checkbox
                  checked={selectedSingle.includes(strategy.title)}
                  onChange={() => handleCardClick(strategy.title, "single")}
                />
              </div>
              <div className="flex flex-col px-2">
                <div className="text-white">{strategy.title}</div>
                <div className="text-gray-400 text-sm">
                  {strategy.description.split('.').map((line, i) =>
                    line.trim() ? <p key={i}>{line.trim()}.</p> : null
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="dark:text-white text-2xl mt-8 mb-4">
          Multi-turn Strategies
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {multiTurnStrategies.map((strategy, index) => (
            <div
              key={index}
              className={`dark:bg-[#2B1449] flex flex-row p-4 rounded-xl cursor-pointer transition ring-0 hover:ring-2 ring-indigo-400 ${
                selectedMulti.includes(strategy.title) ? "ring-2 ring-indigo-500" : ""
              }`}
              tabIndex={0}
              role="button"
              onClick={() => handleCardClick(strategy.title, "multi")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleCardClick(strategy.title, "multi");
                }
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center"
              >
                <Checkbox
                  checked={selectedMulti.includes(strategy.title)}
                  onChange={() => handleCardClick(strategy.title, "multi")}
                />
              </div>
              <div className="flex flex-col px-2">
                <div className="text-white">{strategy.title}</div>
                <div className="text-gray-400 text-sm">
                  {strategy.description.split('.').map((line, i) =>
                    line.trim() ? <p key={i}>{line.trim()}.</p> : null
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-10">
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ArrowBackIos />}
            className="min-w-[120px]"
            onClick={() => navigate("/redteam/setup/plugin")}
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForward />}
            className="min-w-[120px]"
            onClick={() => navigate("/redteam/setup/review")}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Strategies;
