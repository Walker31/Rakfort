import clsx from 'clsx';

export default function PresetCard({ name, description, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'w-full h-full p-4 rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden',
        'hover:shadow-md hover:-translate-y-0.5',
        isSelected
          ? 'border-indigo-500 bg-indigo-200 dark:bg-[#3C1C5E] text-indigo-800 dark:text-indigo-300 hover:bg-indigo-300 dark:hover:bg-[#4B2473]'
          : 'border-gray-400 bg-gray-50 dark:bg-[#2B1449] text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#34165A]'
      )}
    >
      <h3
        className={clsx(
          'text-lg font-semibold mb-2 transition-colors duration-200',
          isSelected ? 'text-indigo-800 dark:text-indigo-300' : 'text-gray-900 dark:text-white'
        )}
      >
        {name}
      </h3>
      <p
        className={clsx(
          'text-sm leading-relaxed',
          isSelected ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'
        )}
      >
        {description}
      </p>
    </div>
  );
}
