import { Alert } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

export default function InfoAlert({ children }) {
  const theme = useTheme();
  return (
    <Alert
      severity="info"
      className={`dark:bg-blue-300 dark:text-white`}
      sx={{
        color:'white',
        '& .MuiAlert-icon': { color: 'info.main' },
        backgroundColor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.info.main, 0.1)
            : alpha(theme.palette.info.main, 0.05),
        border:
          `1px solid ${
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.info.main, 0.3)
              : alpha(theme.palette.info.main, 0.2)
          }`,
        '& .MuiAlert-message': { color: 'text.primary' },
      }}
    >
      {children}
    </Alert>
  );
}
