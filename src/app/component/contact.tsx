"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';

const ContactButton = () => {
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await fetch(`${process.env.ADDRESS}/admin`, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch contact info');
                }

                const data = await response.json();
                console.log(data)
                setPhoneNumber(data.response[0].senderPhoneNumber);
            } catch (error) {
                console.error('Error fetching contact info:', error);
                setPhoneNumber('6200000000000');
            }
        };

        fetchContactInfo();
    }, []);

    // Format phone number for WhatsApp link
    const whatsappLink = `https://wa.me/${phoneNumber?.replace(/\D/g, '')}`;

    return (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 right-4 bg-secondary z-50 text-white text-sm w-8 h-8 aspect-square shadow-lg rounded-full flex items-center justify-center transition-all hover:scale-110"
        >
            <Image
                src="/icons/wa.png"
                alt="WhatsApp"
                width={20}
                height={20}
                priority
            />
        </a>
    );
};

export default ContactButton;