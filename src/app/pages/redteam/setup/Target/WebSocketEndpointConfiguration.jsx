import React from 'react';

const WebSocketEndpointConfiguration = ({
  selectedTarget,
  updateWebSocketTarget,
  urlError,
}) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Custom WebSocket Endpoint Configuration
      </h2>
      <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm dark:bg-gray-900">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            WebSocket URL
          </label>
          <input
            type="text"
            value={selectedTarget.config.url}
            onChange={(e) => updateWebSocketTarget('url', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
              urlError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {urlError && (
            <p className="text-red-500 text-sm mt-1">{urlError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message Template
          </label>
          <textarea
            rows={3}
            value={selectedTarget.config.messageTemplate}
            onChange={(e) =>
              updateWebSocketTarget('messageTemplate', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Response Transform
          </label>
          <input
            type="text"
            value={selectedTarget.config.transformResponse}
            onChange={(e) =>
              updateWebSocketTarget('transformResponse', e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timeout (ms)
          </label>
          <input
            type="number"
            value={selectedTarget.config.timeoutMs}
            onChange={(e) =>
              updateWebSocketTarget('timeoutMs', Number.parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default WebSocketEndpointConfiguration;
