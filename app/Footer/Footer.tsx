import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';

const Footer = () => {
  return (
<div>
  
      {/* Footer Section */}
      <footer className="bg-white py-8 ">
        <div className="text-center">
          <p className="text-gray-600 text-sm">© Online Exam, Inc. 2025. We love our users!</p>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <a href="#" className="text-gray-600">Facebook</a>
          <a href="#" className="text-gray-600">Twitter</a>
          <a href="#" className="text-gray-600">Instagram</a>
        </div>
      </footer>
</div>
  );
};

export default Footer;
