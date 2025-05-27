import React from 'react';

const ProviderResponse = ({ providerResponse }) => (
  <div className="space-y-4 mt-4">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
      Headers:
    </h3>
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-[200px] overflow-auto shadow-sm">
      <table className="min-w-full text-sm table-auto border-collapse">
        <thead>
          <tr className="text-left text-gray-600 dark:text-gray-400">
            <th className="pr-4 pb-2">Header</th>
            <th className="pb-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(providerResponse?.metadata?.headers || {}).map(
            ([key, value]) => (
              <tr key={key} className="border-t border-gray-200 dark:border-gray-700">
                <td className="pr-4 py-2 max-w-[200px] break-words text-gray-800 dark:text-gray-100">{key}</td>
                <td className="py-2 max-w-[300px] break-words text-gray-800 dark:text-gray-100">{value}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>

    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
      Raw Result:
    </h3>
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-[200px] overflow-auto text-sm">
      <pre className="whitespace-pre-wrap break-words m-0">
        {typeof providerResponse?.raw === 'string'
          ? providerResponse.raw
          : JSON.stringify(providerResponse?.raw, null, 2)}
      </pre>
    </div>

    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
      Parsed Result:
    </h3>
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-[200px] overflow-auto text-sm">
      <pre className="whitespace-pre-wrap break-words m-0">
        {typeof providerResponse?.output === 'string'
          ? providerResponse.output
          : JSON.stringify(providerResponse?.output, null, 2)}
      </pre>
    </div>

    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
      Session ID:
    </h3>
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-[200px] overflow-auto text-sm">
      <pre className="whitespace-pre-wrap break-words m-0">
        {providerResponse?.sessionId}
      </pre>
    </div>
  </div>
);

export default ProviderResponse;
