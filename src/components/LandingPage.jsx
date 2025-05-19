
//



import React, { useState, useEffect } from 'react';
import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isSignedIn, user } = useUser();

  const slides = [
    { emoji: '😊', caption: 'Happy kids learning' },
    { emoji: '📚', caption: 'Educational resources' },
    { emoji: '🎨', caption: 'Creative activities' },
    { emoji: '🤝', caption: 'Community support' },
  ];

  const provides = [
    { emoji: '🎨', title: 'Art Classes', description: 'Encourage creativity through various art forms.' },
    { emoji: '📚', title: 'Educational Support', description: 'Tutoring and homework help for all subjects.' },
    { emoji: '🤝', title: 'Mentorship', description: 'Guidance from experienced mentors.' },
    { emoji: '🏃', title: 'Physical Activities', description: 'Sports and games for physical development.' },
  ];

  // ... (keep all the existing useEffect hooks and animations the same)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Background shapes animation
    gsap.to('svg circle:nth-child(1)', {
      y: 20,
      x: 10,
      repeat: -1,
      yoyo: true,
      duration: 5,
      ease: 'sine.inOut',
    });
    gsap.to('svg circle:nth-child(2)', {
      y: -15,
      x: -20,
      repeat: -1,
      yoyo: true,
      duration: 4,
      ease: 'sine.inOut',
    });
    gsap.to('svg circle:nth-child(3)', {
      y: 25,
      x: 15,
      repeat: -1,
      yoyo: true,
      duration: 6,
      ease: 'sine.inOut',
    });

    // Moving star animation across sections
    gsap.set(`.${styles.movingStar}`, { x: '50%', y: '20%' });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `.${styles.container}`,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
    tl.to(`.${styles.movingStar}`, { x: '70%', y: '50%', duration: 1 })
      .to(`.${styles.movingStar}`, { x: '50%', y: '80%', duration: 1 });

    // Scrolling elements (left to right)
    gsap.set(`.${styles.scrollingElement}:nth-child(1)`, { top: '10%', left: '10%' });
    gsap.set(`.${styles.scrollingElement}:nth-child(2)`, { top: '50%', left: '20%' });
    gsap.set(`.${styles.scrollingElement}:nth-child(3)`, { top: '80%', left: '30%' });
    gsap.to(`.${styles.scrollingElement}`, {
      scrollTrigger: {
        trigger: `.${styles.container}`,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      x: '100vw',
      ease: 'none',
    });

    // Hero section animation
    gsap.from(`.${styles.heading}`, {
      y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });
      gsap.from(`.${styles.subheading}`, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power2.out',
      });
      gsap.from(`.${styles.buttonGroup} button`, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: 'back.out(1.7)',
      });

      // Introduction section animations
      gsap.from(`.${styles.introTitle}`, {
        scrollTrigger: {
          trigger: `.${styles.introduction}`,
          start: 'top 80%',
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });
      gsap.from(`.${styles.introText}`, {
        scrollTrigger: {
          trigger: `.${styles.introduction}`,
          start: 'top 80%',
        },
        x: 100,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power2.out',
      });
      gsap.from(`.${styles.introImage} img`, {
        scrollTrigger: {
          trigger: `.${styles.introduction}`,
          start: 'top 80%',
        },
        x: 200,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });

      // Provides section animations
      gsap.from(`.${styles.sectionTitle}`, {
        scrollTrigger: {
          trigger: `.${styles.provides}`,
          start: 'top 80%',
        },
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });
      gsap.from('.provideCard', {
        scrollTrigger: {
          trigger: `.${styles.provides}`,
          start: 'top 80%',
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: 'back.out(1.7)',
      });
    }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  return (
    <div className={styles.container}>
      {/* Background elements remain unchanged */}
      <svg className={styles.backgroundShapes} width="100%" height="100%">
        <circle cx="10%" cy="20%" r="50" fill="#ffcc00" />
        <circle cx="80%" cy="30%" r="30" fill="#00ccff" />
        <circle cx="50%" cy="70%" r="40" fill="#ff6699" />
      </svg>
      <svg className={styles.movingStar} width="50" height="50">
        <polygon points="25,5 30,20 45,20 35,30 40,45 25,35 10,45 15,30 5,20 20,20" fill="#ffcc00" />
      </svg>
      <div className={styles.scrollingElements}>
        <div className={styles.scrollingElement}></div>
        <div className={styles.scrollingElement}></div>
        <div className={styles.scrollingElement}></div>
      </div>

      {/* Updated Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.heading}>Welcome to OrphanAge!</h1>
        <p className={styles.subheading}>A place where kids can learn, grow, and thrive.</p>
        
        {isSignedIn ? (
          <div className={styles.greeting}>
            <h2>
              Hello {user?.publicMetadata?.role} {user?.firstName}!
            </h2>
            <p>Start exploring your dashboard or check today's activities!</p>
          </div>
        ) : (
          <div className={styles.buttonGroup}>
            <SignUpButton mode="redirect">
              <button className={styles.getStartedBtn}>Get Started</button>
            </SignUpButton>
            <SignInButton mode="redirect">
              <button className={styles.signInBtn}>Sign In</button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button className={styles.signUpBtn}>Sign Up</button>
            </SignUpButton>
          </div>
        )}
      </div>

      {/* Rest of the components remain the same */}
      <div className={styles.slider}>
        <button onClick={prevSlide} className={styles.arrowBtn}>←</button>
        <div className={styles.slideContainer}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
            >
              <span className={styles.emoji}>{slide.emoji}</span>
              <p className={styles.caption}>{slide.caption}</p>
            </div>
          ))}
        </div>
        <button onClick={nextSlide} className={styles.arrowBtn}>→</button>
      </div>

      <div className={styles.introduction}>
        <div className={styles.introContent}>
          <h2 className={styles.introTitle}>About OrphanAge</h2>
          <p className={styles.introText}>
            OrphanAge is dedicated to providing a nurturing environment for children to explore their potential. 
            Through a variety of educational programs, creative activities, and community support, 
            we aim to empower every child to achieve their dreams.
          </p>
        </div>
        <div className={styles.introImage}>
          <img
            src="https://img.freepik.com/free-vector/flat-children-back-school_52683-42315.jpg"
            alt="Children going back to school"
          />
        </div>
      </div>

      <div className={styles.provides}>
        <h2 className={styles.sectionTitle}>What We Provide</h2>
        <div className={styles.grid}>
          {provides.map((item, index) => (
            <div key={index} className={`${styles.card} provideCard`}>
              <span className={styles.cardEmoji}>{item.emoji}</span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;