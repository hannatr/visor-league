const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-700 py-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center px-4">
        <p className="text-sm text-white mt-2 md:mt-0">
          &copy; {currentYear} Visor League. Created by Castle Industries.
          "Visor" is a CBall Joint.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
