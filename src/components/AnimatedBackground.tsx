
import React from 'react';
import { Book, GraduationCap, Laptop, Video } from 'lucide-react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Student images */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
          alt="Student studying"
          className="absolute top-0 left-0 w-1/3 h-1/3 object-cover opacity-20 rounded-2xl animate-float"
        />
        <img 
          src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
          alt="Student with laptop"
          className="absolute top-1/3 right-0 w-1/3 h-1/3 object-cover opacity-20 rounded-2xl animate-float"
          style={{ animationDelay: '-2s' }}
        />
        <img 
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
          alt="Group studying"
          className="absolute bottom-0 left-1/4 w-1/3 h-1/3 object-cover opacity-20 rounded-2xl animate-float"
          style={{ animationDelay: '-4s' }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-chainlearn-purple/10 via-chainlearn-pink/10 to-chainlearn-blue/10" />
      
      {/* Floating icons */}
      <div className="absolute top-1/4 left-1/4 animate-float opacity-20">
        <Book className="w-16 h-16 text-chainlearn-purple" />
      </div>
      <div className="absolute top-1/3 right-1/3 animate-float opacity-20" style={{ animationDelay: '-2s' }}>
        <GraduationCap className="w-16 h-16 text-chainlearn-pink" />
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-float opacity-20" style={{ animationDelay: '-4s' }}>
        <Laptop className="w-16 h-16 text-chainlearn-blue" />
      </div>
      <div className="absolute top-2/3 right-1/4 animate-float opacity-20" style={{ animationDelay: '-6s' }}>
        <Video className="w-16 h-16 text-chainlearn-purple" />
      </div>

      {/* Animated circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-chainlearn-purple rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-chainlearn-pink rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-chainlearn-blue rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '-5s' }} />
    </div>
  );
};

export default AnimatedBackground;
