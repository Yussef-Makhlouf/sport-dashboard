"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ResetPasswordForm } from "@/components/reset-password-form"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export default function ResetPasswordPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  // Handle mouse movement for 3D effect
  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) - 0.5;
      const y = (clientY / window.innerHeight) - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Language switch button */}
      <div className="absolute top-4 right-4 z-50">
        <Button 
          onClick={toggleLanguage} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
        >
          <Globe className="h-4 w-4" />
          <span>{language === "ar" ? "English" : "العربية"}</span>
        </Button>
      </div>

      {/* Dynamic background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-all duration-500 ease-in-out">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#BB2121]/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#BB2121]/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 animate-float-slow-reverse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/5 dark:bg-white/5 rounded-full blur-[80px] animate-pulse-very-slow" />
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.02] bg-[size:50px_50px] opacity-20" />
      </div>

      {/* Main content container */}
      <div className="container relative z-10 px-4 py-10 mx-auto max-w-7xl">
        {/* Logo showcase - Main focal point */}
        <div className="flex flex-col items-center justify-center mb-12 relative">
          <div 
            className="relative transform transition-all duration-300 ease-out"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * -5}deg) rotateY(${mousePosition.x * 5}deg) scale3d(1, 1, 1)`,
            }}
          >
            <div className="absolute -inset-10 bg-[#BB2121]/20 rounded-full blur-3xl opacity-70 animate-pulse-slow" />
            <Image 
              src="/logo3.png" 
              alt="Sport Management Logo" 
              width={220} 
              height={220} 
              className="relative drop-shadow-2xl" 
              priority
            />
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 group-hover:ring-white/20" />
          </div>
          
          <h1 className="mt-8 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BB2121] to-[#FF6B6B] animate-gradient">
            {t("dashboard")}
          </h1>
          
          <div className="h-1 w-32 bg-gradient-to-r from-[#BB2121]/50 via-[#FF6B6B] to-[#BB2121]/50 rounded-full my-6 animate-shimmer"></div>
          
          <p className="text-xl text-center max-w-xl text-gray-600 dark:text-gray-300 mb-10">
            {t("platform.description")}
          </p>
        </div>

        {/* Content card with glassmorphism */}
        <div className="max-w-3xl mx-auto rounded-[2rem] overflow-hidden">
          {/* Form panel */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-8 lg:p-10 rounded-[2rem] shadow-xl border border-white/20 dark:border-gray-800/30 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#BB2121]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#BB2121]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("reset.password")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {t("reset.password.description")}
                </p>
              </div>
              
              {/* Form with enhanced styling */}
              <div className="bg-white dark:bg-gray-800/70 rounded-xl p-6 lg:p-8 shadow-lg border border-gray-100 dark:border-gray-700/50 max-w-md mx-auto">
                <ResetPasswordForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center w-full text-sm text-gray-500 dark:text-gray-400 z-10">
        {t("copyright").replace("{year}", new Date().getFullYear().toString())}
      </div>
    </div>
  )
}
