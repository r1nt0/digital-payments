import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import myImage from './pictures/caro1.jpg';
import myImage2 from './pictures/caros2.jpg';
import myImage3 from './pictures/caros3.jpg';

const MyCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={ myImage }
          alt="First slide"
        />
        
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={ myImage2 }
          alt="Second slide"
        />
       
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={ myImage3 }
          alt="Third slide"
        />
        
      </Carousel.Item>
    </Carousel>
  );
};

export default MyCarousel;
