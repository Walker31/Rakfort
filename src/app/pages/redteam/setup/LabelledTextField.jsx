import { Box, Typography, TextField } from '@mui/material';

export default function LabeledTextField({ label, description, ...props }) {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
        {label}
      </Typography>
      {description && (
        <Typography variant="body1">{description}</Typography>
      )}

      <TextField key={label} fullWidth margin="normal" {...props} className='dark:bg-[#2B1449] text-white' slotProps={{
        input: { className:'!text-gray-900 dark:!text-white' }
      }}/>
      
      
    </Box>
  );
}
