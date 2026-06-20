"use client";

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrain} from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  return (
    <nav>
        <Link  href="/"><h1>RailPlan <FontAwesomeIcon icon={faTrain}/></h1></Link>
        <div className="nav-button">
          <button><Link href="/login">Log in</Link></button>
          <button><Link href="/register">Log out</Link></button>
        </div>
      </nav>
  );
}