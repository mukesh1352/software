"use client";
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Head>
        <title>Privacy Policy | Tourism Recommendation</title>
      </Head>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          Welcome to our Tourism Recommendation application. Your privacy is important to us, and we are committed to protecting your personal data.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <p className="mb-4">We may collect personal details such as your name, email, and location preferences to enhance your experience.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Data</h2>
        <p className="mb-4">Your data helps us provide personalized recommendations and improve our services.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h2>
        <p className="mb-4">We implement security measures to safeguard your data from unauthorized access.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Contact Us</h2>
        <p className="mb-4">If you have any questions, feel free to contact us at <span className="font-semibold">support@tourismapp.com</span>.</p>
      </div>
    </div>
  );
}
