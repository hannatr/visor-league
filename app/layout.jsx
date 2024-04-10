import React from 'react';
import '@/assets/styles/globals.css';
import NavBar from '@/components/NavBar';

export const metadata = {
    title: 'Visor League',
}

const MainLayout = ({ children }) => {
  return (
    <html lang='en'>
        <body>
            <NavBar/>
            <main>{children}</main>
        </body>
    </html>
  )
}

export default MainLayout;