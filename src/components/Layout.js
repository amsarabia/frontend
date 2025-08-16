   import Header from './Header';
   import Footer from './Footer';
   import { Outlet } from 'react-router-dom';

   const Layout = () => {
     return (
       <>
         <Header />
         <main className="flex-grow">
           <Outlet />
         </main>
         <Footer />
       </>
     );
   };

   export default Layout;