import React from "react";
import BloodPosts from "./BloodPosts";
import HeroSection from "./HeroSection";
import AllReviews from "./AllReviews";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <BloodPosts />
      <AllReviews />
    </div>
  );
};

export default HomePage;
