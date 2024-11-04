import React from 'react';
import Image from 'next/image';
import NavigationBar from '../component/navbar';

const AboutUsPage: React.FC = () => {
    return (
        <div className="w-screen bg-white">
            <NavigationBar />
            <div className="p-6 mt-20 flex flex-col lg:flex-row items-center">
                <div className="lg:w-5/12 mb-6 lg:mb-0 lg:mr-6">
                    <Image
                        src="/a.jpg"
                        alt="About Us"
                        width={300}
                        height={200}
                        className="rounded-lg shadow-md w-full h-auto"
                    />
                </div>

                <div className="lg:w-2/3">
                    <h1 className="text-3xl font-bold mb-4 text-black">About Us</h1>

                    <p className="mb-4 text-gray-700">
                        Welcome to our company! We are passionate about providing high-quality products that enhance your everyday life. Our journey began with a simple idea: to create stylish and functional cups and bottles that cater to all hydration needs.
                    </p>

                    <h2 className="text-black text-xl font-semibold mt-6 mb-4">Our Mission</h2>
                    <p className="mb-4 text-gray-700">
                        Our mission is to provide eco-friendly, innovative hydration solutions that inspire a healthier lifestyle. We believe in sustainability and are committed to using materials that are kind to the planet.
                    </p>

                    <h2 className="text-black text-xl font-semibold mt-6 mb-4">Our Values</h2>
                    <ul className="list-disc ml-6 mb-4 text-gray-700">
                        <li>Quality: We prioritize quality in everything we do.</li>
                        <li>Innovation: We constantly seek to innovate and improve our products.</li>
                        <li>Sustainability: We are dedicated to protecting the environment.</li>
                        <li>Customer Focus: Our customers are at the heart of our business.</li>
                    </ul>

                    <h2 className="text-black text-xl font-semibold mt-6 mb-4">Meet the Team</h2>
                    <p className="mb-4 text-gray-700">
                        Our team is made up of passionate individuals with diverse backgrounds, all committed to our mission. From product design to customer support, we work together to ensure you have the best experience possible.
                    </p>

                    <h2 className="text-black text-xl font-semibold mt-6 mb-4">Join Us on Our Journey</h2>
                    <p className="mb-4 text-gray-700">
                        We invite you to explore our products and join us in our commitment to sustainability and quality. Thank you for being a part of our community!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
