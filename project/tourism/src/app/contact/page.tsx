"use client";
import Chatbot1 from "../components/Chatbot1";
import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <motion.div 
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-extrabold text-gray-800 text-center">Contact Us</h1>
        <p className="text-gray-600 text-center mt-2">
          Have any questions? Ask our AI-powered chatbot!
        </p>

        <div className="mt-6">
          <Chatbot1 />
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
