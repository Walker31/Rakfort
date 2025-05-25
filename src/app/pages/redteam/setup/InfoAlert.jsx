import { Alert } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

export default function InfoAlert({ children }) {
  const theme = useTheme();
  return (
    <Alert
      severity="info"
      className={` dark:!text-white !text-black`}
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
      }}
    >
      {children}
    </Alert>
  );
}
