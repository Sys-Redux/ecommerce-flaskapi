export const Footer = () => {
  return (
    <footer className="bg-(--ctp-mantle) border-t border-(--ctp-surface0) mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-(--ctp-subtext0) text-sm">
            © {new Date().getFullYear()} Catppuccin Store. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/catppuccin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--ctp-subtext0) hover:text-(--ctp-mauve) transition-colors text-sm"
            >
              GitHub
            </a>
            <a
              href="https://catppuccin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--ctp-subtext0) hover:text-(--ctp-mauve) transition-colors text-sm"
            >
              Catppuccin Theme
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
