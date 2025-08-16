import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';

   const Footer = () => {
     return (
       <footer className="bg-gray-100 p-4">
         <div className="max-w-7xl mx-auto">
           <h3 className="text-lg font-bold">Contact Us</h3>
           <p>Phone: +1 123-456-7890</p>
           <p>Email: sales@example.com</p>
           <div className="flex space-x-4 mt-4">
             <Link to="#"><FontAwesomeIcon icon={faFacebook} /></Link>
             <Link to="#"><FontAwesomeIcon icon={faInstagram} /></Link>
             <Link to="#"><FontAwesomeIcon icon={faTwitter} /></Link>
             <Link to="#"><FontAwesomeIcon icon={faLinkedin} /></Link>
             <Link to="#"><FontAwesomeIcon icon={faYoutube} /></Link>
           </div>
         </div>
       </footer>
     );
   };

   export default Footer;