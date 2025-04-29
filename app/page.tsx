import React from 'react';

import HeroSection from './Section/HeroSection';
import About from './Button/About';
import Resources from './Button/Resources';
import ExamCards from './ExamCards/ExamCards';
import Footer from './Footer/Footer';
import Contact from './Button/Contact';
import Login from './login/page';
import Navbar from './Navbar/Navbar';



const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <About/>
      <Resources/>
      <ExamCards />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
