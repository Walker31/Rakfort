import { Box, Typography, Button } from '@mui/material';

export default function UsageDetailsHeader({ onLoadExample }) {
  return (
    <Box className="mb-4 flex items-center justify-between">
      <Typography variant="h4" gutterBottom>
        <span className="text-gray-700 dark:text-gray-50 font-bold">
          Usage Details
        </span>
      </Typography>

      <Button onClick={onLoadExample} className="p-0 min-w-0">
        <div className="bg-purple-700/40 rounded-[10px] border border-purple-500/40 px-4 py-2 text-gray-800 dark:text-gray-50 hover:bg-purple-700/60 transition">
          Load Example
        </div>
      </Button>
    </Box>
  );
}
