import React from 'react';

export const StarbucksLogo: React.FC = () => {
  return (
    <div className="w-full h-full relative">
      {/* Create the glowing effect based on the provided image */}
      <div className="absolute inset-0 bg-gradient-radial from-[#006241] via-[#006241]/60 to-transparent opacity-80 blur-xl"></div>
      
      {/* Starbucks logo with glow effect */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        <div className="w-[90%] h-[90%] rounded-full border-[1px] border-[#006241]/30 relative">
          {/* Star */}
          <div className="absolute top-[14%] left-[50%] transform -translate-x-1/2 w-[10%] h-[6%] border-t-[2px] border-l-[2px] border-r-[2px] border-[#006241]/60"></div>
          
          {/* Crown Left */}
          <div className="absolute top-[18%] left-[35%] transform -translate-x-1/2 w-[15%] h-[8%] border-t-[2px] border-l-[2px] border-[#006241]/60"></div>
          
          {/* Crown Right */}
          <div className="absolute top-[18%] right-[35%] transform translate-x-1/2 w-[15%] h-[8%] border-t-[2px] border-r-[2px] border-[#006241]/60"></div>
          
          {/* Face Outline */}
          <div className="absolute top-[30%] left-[50%] transform -translate-x-1/2 w-[16%] h-[35%] rounded-b-[100px] border-l-[2px] border-r-[2px] border-b-[2px] border-[#006241]/60"></div>
          
          {/* Hair Strands */}
          <div className="absolute top-[30%] left-[44%] h-[35%] border-l-[2px] border-[#006241]/60"></div>
          <div className="absolute top-[30%] left-[48%] h-[38%] border-l-[2px] border-[#006241]/60"></div>
          <div className="absolute top-[30%] left-[52%] h-[38%] border-l-[2px] border-[#006241]/60"></div>
          <div className="absolute top-[30%] right-[44%] h-[35%] border-l-[2px] border-[#006241]/60"></div>
          
          {/* Left Side Fins */}
          <div className="absolute top-[25%] left-[20%] w-[12%] h-[8%] border-t-[2px] border-l-[2px] border-[#006241]/60"></div>
          <div className="absolute top-[38%] left-[16%] w-[10%] h-[4%] border-t-[2px] border-l-[2px] border-[#006241]/60"></div>
          <div className="absolute top-[48%] left-[16%] w-[10%] h-[4%] border-t-[2px] border-l-[2px] border-[#006241]/60"></div>
          <div className="absolute top-[58%] left-[17%] w-[9%] h-[4%] border-t-[2px] border-l-[2px] border-[#006241]/60"></div>
          <div className="absolute top-[68%] left-[20%] w-[8%] h-[4%] border-t-[2px] border-l-[2px] border-[#006241]/60"></div>
          
          {/* Right Side Fins */}
          <div className="absolute top-[25%] right-[20%] w-[12%] h-[8%] border-t-[2px] border-r-[2px] border-[#006241]/60"></div>
          <div className="absolute top-[38%] right-[16%] w-[10%] h-[4%] border-t-[2px] border-r-[2px] border-[#006241]/60"></div>
          <div className="absolute top-[48%] right-[16%] w-[10%] h-[4%] border-t-[2px] border-r-[2px] border-[#006241]/60"></div>
          <div className="absolute top-[58%] right-[17%] w-[9%] h-[4%] border-t-[2px] border-r-[2px] border-[#006241]/60"></div>
          <div className="absolute top-[68%] right-[20%] w-[8%] h-[4%] border-t-[2px] border-r-[2px] border-[#006241]/60"></div>
          
          {/* Registered Mark */}
          <div className="absolute bottom-[15%] right-[15%] w-[4%] h-[4%] rounded-full border-[1px] border-[#006241]/60 flex items-center justify-center text-[8px] text-[#006241]/60">®</div>
        </div>
      </div>
    </div>
  );
};

export default StarbucksLogo;