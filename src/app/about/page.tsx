import React from "react";
import Image from "next/image";
import NavigationBar from "../component/navbar";
import Footer from "../component/footer";
import Banner from "../component/banner";

const AboutUsPage = () => {
  return (
    <div className="w-screen h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 h-full">
        <Banner title="About Us" imagePath="/banner.jpg" />
        <div className="text-black flex flex-col items-center tracking-widest leading-[2]">
          <h1 className="font-bold text-5xl mt-12">
            Hello! We make water bottles
          </h1>
          <h2 className="mt-12 font-semibold text-lg w-3/5">
            Why? Because we’re a passionate team of dreamers and designers with
            one simple motto: “Do more of what you love.” And for us, that means
            crafting products that make life easier and a whole lot more
            enjoyable.
          </h2>
          <div className="mt-6 w-3/5">
            With so many water bottles on the market, we had to ask: why are 3
            out of 4 people still struggling with chronic dehydration? We all
            know that being dehydrated makes us feel and look awful—more like
            sluggish zombies than vibrant humans. And let’s face it, zombies
            aren’t exactly known for living their best lives. When we dug
            deeper, we realized the problem: most water bottles are either way
            too complex or just plain underwhelming. Do you really need a bottle
            built for scaling Mount Everest to sit on your office desk? Or for
            running errands? Or hitting the gym to the tunes of Post Malone?
            What you need is a bottle that’s your trusty companion, not a
            high-maintenance guide. So, we got to work. After more than three
            years of dedication, we’ve crafted what we believe are the best
            water bottles out there—designed to help you do more of what you
            love. What are you waiting for? Grab one, stay hydrated, and seize
            the day like a boss.
          </div>
          <div className="w-full flex items-center flex-col bg-secondary mt-6 py-8">
            <h1 className="text-white text-2xl font-semibold">Why you should choose TYESO?</h1>
            <div className="flex w-full justify-center gap-6 my-6">
              {/* Product 1 */}
              <div className="flex flex-col items-center">
                <img
                  src="/a.jpg"
                  alt="Product 1"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
                <p className="mt-4 text-white text-center text-xs font-light">
                  Description for Product 1
                </p>
              </div>

              {/* Product 2 */}
              <div className="flex flex-col items-center">
                <img
                  src="/a.jpg"
                  alt="Product 2"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
                <p className="mt-4 text-white text-center text-xs font-light">
                  Description for Product 2
                </p>
              </div>

              {/* Product 3 */}
              <div className="flex flex-col items-center">
                <img
                  src="/a.jpg"
                  alt="Product 3"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
                <p className="mt-4 text-white text-center text-xs font-light">
                  Description for Product 3
                </p>
              </div>

              {/* Product 4 */}
              <div className="flex flex-col items-center">
                <img
                  src="/a.jpg"
                  alt="Product 4"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
                <p className="mt-4 text-white text-center text-xs font-light">
                  Description for Product 4
                </p>
              </div>
            </div>
          </div>

          <button className="mt-6 bg-secondary text-white font-medium border-2  transition duration-500 hover:bg-white hover:border-secondary hover:border-2 hover:text-secondary py-2 px-4 rounded-full">
            See Our Product
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AboutUsPage;
