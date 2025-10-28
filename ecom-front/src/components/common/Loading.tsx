export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-(--ctp-surface1) rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-(--ctp-mauve) border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
