interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
      <div className="bg-(--ctp-surface0) border border-(--ctp-red) rounded-lg p-6 max-w-md">
        <div className="flex items-center gap-3 mb-3">
          <svg
            className="w-6 h-6 text-(--ctp-red)"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-(--ctp-red)">Error</h3>
        </div>
        <p className="text-(--ctp-text) mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full px-4 py-2 bg-(--ctp-mauve) hover:bg-(--ctp-pink) text-(--ctp-crust) rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
