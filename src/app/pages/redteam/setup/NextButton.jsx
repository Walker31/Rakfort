import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Button from '@mui/material/Button';

export default function NextButton({ onNext, disabled }) {
  return (
    <div className="pt-4 flex justify-end">
      <Button
        variant="contained"
        onClick={onNext}
        disabled={disabled}
        endIcon={<ArrowRightIcon />}
        className={`
          normal-case font-semibold text-sm
          !px-6 !py-2 !rounded !shadow-md !transition
          !border-1 !border-purple-400
          ${disabled 
            ? '!bg-gray-400 dark:!bg-gray-600 !cursor-not-allowed' 
            : '!bg-purple-200 !text-black hover:!bg-purple-700 dark:!bg-[#7904DF] dark:hover:!bg-purple-500'}
        `}
      >
        Next
      </Button>
    </div>
  );
}
