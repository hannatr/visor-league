export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/80 bg-primary py-4">
      <div className="container mx-auto flex flex-col items-center justify-center px-4 md:flex-row">
        <p className="mt-2 text-sm text-primary-foreground md:mt-0">
          &copy; {currentYear} Visor League. Created by Castle Industries.
          &ldquo;Visor&rdquo; is a CBall Joint.
        </p>
      </div>
    </footer>
  );
}
