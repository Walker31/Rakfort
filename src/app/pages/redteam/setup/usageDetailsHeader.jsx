import Button from '@mui/material/Button';

export default function UsageDetailsHeader({ onLoadExample }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-50">
        Usage Details
      </h2>

      <Button
        onClick={onLoadExample}
        className="!bg-purple-200 dark:!bg-[#7904DF] hover:!bg-purple-700/60 !text-black dark:!text-black !rounded-[10px] !border !border-purple-500/40 !px-4 !py-2 normal-case font-medium text-sm shadow-sm transition"
        type="button"
      >
        Load Example
      </Button>
    </div>
  );
}
