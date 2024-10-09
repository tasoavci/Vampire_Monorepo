import React, { useEffect, useState } from 'react'; // React ve gerekli hookları ithal edin
import { useRouter } from 'next/router';

export default function VerifyEmail() {
    const router = useRouter();
    const { token } = router.query;
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (token) {
            verifyEmailToken(token);
        }
    }, [token]);

    const verifyEmailToken = async (token) => {
        try {
            const response = await fetch(`/api/verify-email?token=${token}`);
            const data = await response.json();
            setMessage(data.message || 'Failed to verify email.');
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-800 bodyBackground'>
            <div className='w-full max-w-md p-10 mx-4 sm:mx-0 space-y-6 bg-white rounded-xl shadow-lg'>
                <h1 className='sm:text-2xl text-xl font-bold text-center text-gray-800'>Email Verification</h1>
                <p className='text-center text-gray-600 sm:text-base text-xs'>{message}</p>
            </div>
        </div>
    );
}