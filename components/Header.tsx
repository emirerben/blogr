import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import Button from './Button';
import styles from './Header.module.css';
import buttonStyles from './Button.module.css';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let left = (
    <div className={styles.left}>
    <Link href="/" className={styles.navLink} data-active={isActive('/')}>
  Feed
</Link>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className={styles.left}>
<Link href="/" className={styles.navLink} data-active={isActive('/')}>
  Feed
</Link>
      </div>
    );
    right = (
      <div className={styles.right}>
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className={styles.right}>
        <Button onClick={() => signIn('google')}>
          Sign in with Google
        </Button>
      </div>
    );
  }

  if (session) {
    left = (
      <div className={styles.left}>
<Link href="/" className={styles.navLink} data-active={isActive('/')}>
  Feed
</Link>
<Link href="/drafts" className={styles.navLink} data-active={isActive('/drafts')}>
  My drafts
</Link>
      </div>
    );
    right = (
      <div className={styles.right}>
        <p className={styles.userInfo}>
          {session.user.name} ({session.user.email})
        </p>
        <Link href="/create">
  <Button className={`${buttonStyles.button} ${buttonStyles.circularButton}`}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </Button>
</Link>
        <Button 
          className={`${styles.button} ${styles.logoutButton}`} 
          onClick={() => signOut()}
        >
          Log out
        </Button>
      </div>
    );
  }

  return (
    <nav className={styles.header}>
      {left}
      {right}
    </nav>
  );
};

export default Header;