import React from "react";
import { Code2, Github, Twitter, Linkedin, Mail } from "lucide-react";
import Logo from "./Logo";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 py-8 sm:pt-12 sm:pb-6 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="lg:col-span-1">
            <div className="mb-3 sm:mb-4">
              <Logo size={18} />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mb-3 sm:mb-4 max-w-md">
              SheetCode provides personalized coding practice to help you
              improve your skills and prepare for technical interviews.
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              <SocialLink icon={<Github size={14} />} href="#" />
              <SocialLink icon={<Twitter size={14} />} href="#" />
              <SocialLink icon={<Linkedin size={14} />} href="#" />
              <SocialLink icon={<Mail size={14} />} href="#" />
            </div>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
              Resources
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">Guides</FooterLink>
              <FooterLink href="#">API Reference</FooterLink>
              <FooterLink href="#">Community</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
              Company
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Press</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
              Legal
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <FooterLink href="#">Terms</FooterLink>
              <FooterLink href="#">Privacy</FooterLink>
              <FooterLink href="#">Cookies</FooterLink>
              <FooterLink href="#">Licenses</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 pt-3 sm:pt-4 mt-6 sm:mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-slate-400">
            © {new Date().getFullYear()} SheetCode. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="p-1.5 sm:p-2 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-600 dark:text-slate-400 hover:text-white hover:bg-primary transition-colors"
    >
      {icon}
    </a>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a 
        href={href} 
        className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
      >
        {children}
      </a>
    </li>
  );
}
