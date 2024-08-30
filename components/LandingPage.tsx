import React from 'react';
import { signIn } from 'next-auth/react';
import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Our Blog Platform</h1>
      <p className={styles.description}>
        Create, share, and discover amazing blog posts with our AI-powered writing assistant.
      </p>
      <div className={styles.actions}>
        <button onClick={handleGoogleSignIn} className={styles.button}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LandingPage;