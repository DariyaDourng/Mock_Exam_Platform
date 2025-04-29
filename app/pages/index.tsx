import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import HeroSection from '../components/Section/HeroSection';
import ExamCards from '../components/ExamCards/ExamCards';
import Footer from '../components/Footer/Footer';


const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ExamCards />
      <Footer />
    </>
  );
};

export default Home;
