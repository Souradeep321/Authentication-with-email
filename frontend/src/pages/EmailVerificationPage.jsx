import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { error, isLoading, verifyEmail, resendVerificationEmail } = useAuthStore();

  // Get email from navigation state or store
  const email = location.state?.email || useAuthStore.getState().user?.email;

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 6) return;
    
    try {
      const response = await verifyEmail(verificationCode);
      if(response?.success) {
        console.log("Email verified successfully");
         navigate("/", { replace: true });
      }
      console.log("Email verified successfully");
       navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !email) return;

    try {
      await resendVerificationEmail(email);
      
      // Start 60-second cooldown timer
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.log(error);
    }
  };

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  // Format cooldown timer
  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  return (
    <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
      >
        <h2 className='text-3xl font-bold mb-6 text-center bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
          Verify Your Email
        </h2>
        
        <p className='text-center text-gray-300 mb-2'>
          Enter the 6-digit code sent to
        </p>
        <p className='text-center text-green-400 font-semibold mb-6'>
          {email || "your email"}
        </p>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex justify-between gap-2'>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type='text'
                maxLength='6'
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none transition-colors'
              />
            ))}
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-red-400 text-center font-semibold'
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type='submit'
            disabled={isLoading || code.some((digit) => !digit)}
            className='w-full bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 transition-all'
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>

        {/* Resend Code Section */}
        <div className='mt-6 pt-6 border-t border-gray-700'>
          <p className='text-center text-gray-400 text-sm mb-4'>
            Didn't receive the code?
          </p>
          
          <motion.button
            whileHover={resendCooldown === 0 ? { scale: 1.05 } : {}}
            whileTap={resendCooldown === 0 ? { scale: 0.95 } : {}}
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || !email}
            className='w-full bg-linear-to-r from-blue-500 to-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
          >
            {resendCooldown > 0 
              ? `Resend available in ${formatTime(resendCooldown)}` 
              : "Resend Verification Code"
            }
          </motion.button>
          
          {resendCooldown === 0 && email && (
            <p className='text-center text-gray-400 text-xs mt-2'>
              Check your spam folder if you don't see the email
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;