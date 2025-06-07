import React from 'react';

import HeroSection from './Section/HeroSection';
import About from '../components/Button/About';
import Resources from '../components/Button/Resources';
import ExamCards from './ExamCards/ExamCards';
import Footer from './Footer/Footer';
import Contact from '../components/Button/Contact';
import Login from './login/page';
import Navbar from '../components/Navbar/Navbar';



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
