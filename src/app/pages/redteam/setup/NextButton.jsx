import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Button from '@mui/material/Button'; // Added import for MUI Button

export default function NextButton({ onNext, disabled }) {
  return (
    <div className="pt-4 justify-end">
      <Button
        variant="contained"
        color="primary"
        onClick={onNext}
        disabled={disabled}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-md"
        endIcon={<ArrowRightIcon />} // Optional icon for better UX
      >
        Next
      </Button>
    </div>
  );
}
