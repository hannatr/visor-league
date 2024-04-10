import Image from 'next/image';
import logo from '@/assets/images/logo-white.png';

const Navbar = () => {
  return (
    <nav className='bg-green-700 border-b border-green-500'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-20 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            <a className='flex flex-shrink-0 items-center' href='/'>
              <Image className='h-10 w-auto' src={logo} alt='Visor League' />
              <span className='text-white text-2xl font-bold ml-2'>Visor League</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
