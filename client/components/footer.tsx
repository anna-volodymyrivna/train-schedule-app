"use client";

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrain, faEnvelope, faPhone} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faGithub, faInstagram, faLinkedinIn, faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer">
        <div className="footer-about">
          <h4>RailPlan <FontAwesomeIcon icon={faTrain}/></h4>
          <p>
            A modern train schedule search and management system. Find current flights and plan your trips quickly and conveniently.
          </p>
        </div>

        <div className="footer-nav">
          <h4>Navigation</h4>
          <ul>
            <li><Link href="/" style={{color: '#fff'}}>Home page</Link></li>
            <li><Link href="/login" style={{color: '#fff'}}>Sign in</Link></li>
            <li><Link href="/register" style={{color: '#fff'}}>Sign up</Link></li>
          </ul>
        </div>

        <div className="footer-contacts">
          <h4>Contacts</h4>
          <ul>
            <li>
                <a href='mailto:support@railplan.ua'>
                    <FontAwesomeIcon icon={faEnvelope}/> support@railplan.ua
                </a>
            </li>
            <li>
                <a href='tel:+380321234567'>
                    <FontAwesomeIcon icon={faPhone}/> +38 (032) 123-45-67
                </a>
            </li>
          </ul>
          
          
        </div>

        <div className="footer-social">
          <h4>Social media</h4>
          <div className="footer-social-icon">
            <a href="https://github.com/anna-volodymyrivna/train-schedule-app.git" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="https://t.me/any_shka" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTelegram} />
            </a>
            <a href="https://www.instagram.com/any.sh.ka/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100022411786687&locale=uk_UA" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://www.linkedin.com/in/%D0%B0%D0%BD%D0%BD%D0%B0-%D0%BB%D0%B8%D1%82%D0%B2%D0%B8%D0%BD%D0%BE%D0%B2%D0%B0/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BumT1AHpVTOycHWkJXDy9bw%3D%3D" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <p>© {currentYear} RailPlane. All rights reserved</p>
      </div>
    </footer>
  );
}