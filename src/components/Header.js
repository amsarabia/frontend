import { useState } from 'react';
   import { Link } from 'react-router-dom';
   import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
   import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

   const Header = () => {
     const [navOpen, setNavOpen] = useState(false);

     return (
       <header>
         <nav className="bg-white shadow-md">
           <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
             <Link to="/" className="text-2xl font-bold">
               Logo
             </Link>
             <button className="md:hidden" onClick={() => setNavOpen(!navOpen)}>
               <FontAwesomeIcon icon={navOpen ? faTimes : faBars} />
             </button>
             <div className={`flex-col md:flex md:flex-row ${navOpen ? 'flex' : 'hidden'} md:flex`}>
               <Link to="/home" className="p-2">Home</Link>
               <Link to="/pricing" className="p-2">Pricing</Link>
               <Link to="/contact" className="p-2">Contact Us</Link>
               <Link to="/sign-in" className="p-2">Sign In</Link>
               <button className="bg-blue-500 text-white px-4 py-2 rounded">
                 Sign Up Now
               </button>
             </div>
           </div>
         </nav>
       </header>
     );
   };

   export default Header;