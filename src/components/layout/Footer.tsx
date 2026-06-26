import React from 'react';
import { Layers, Twitter, Github, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      id="about"
      className="bg-bg-primary border-t border-white/6 pt-20 pb-10 px-6 md:px-12 select-none"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-16 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-5 flex flex-col gap-5">
            <a
              href="#"
              className="flex items-center gap-2.5"
              onClick={(e) => handleLinkClick(e, '#')}
              data-interactive="true"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-accent-blue shadow-md shadow-accent-blue/20">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold font-satoshi text-lg tracking-tight text-white">
                RecordFlow
              </span>
            </a>
            
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              The modern laboratory record and evaluation portal for Indian engineering colleges. 
              Built to replace physical observation and record books with a flawless, print-ready digital system.
            </p>

            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/6 text-text-secondary hover:text-white hover:border-accent-blue/30 hover:bg-accent-blue/10 transition-all duration-200"
                aria-label="Twitter"
                data-interactive="true"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/6 text-text-secondary hover:text-white hover:border-accent-blue/30 hover:bg-accent-blue/10 transition-all duration-200"
                aria-label="GitHub"
                data-interactive="true"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/6 text-text-secondary hover:text-white hover:border-accent-blue/30 hover:bg-accent-blue/10 transition-all duration-200"
                aria-label="LinkedIn"
                data-interactive="true"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary font-satoshi">
              Product
            </h4>
            <div className="flex flex-col gap-2.5">
              <a
                href="#features"
                onClick={(e) => handleLinkClick(e, '#features')}
                className="text-text-muted hover:text-text-secondary text-[13.5px] transition-colors duration-150"
                data-interactive="true"
              >
                Features
              </a>
              <a
                href="#workflow"
                onClick={(e) => handleLinkClick(e, '#workflow')}
                className="text-text-muted hover:text-text-secondary text-[13.5px] transition-colors duration-150"
                data-interactive="true"
              >
                Workflow
              </a>
              <a
                href="#faculty"
                onClick={(e) => handleLinkClick(e, '#faculty')}
                className="text-text-muted hover:text-text-secondary text-[13.5px] transition-colors duration-150"
                data-interactive="true"
              >
                Interactive Demo
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleLinkClick(e, '#pricing')}
                className="text-text-muted hover:text-text-secondary text-[13.5px] transition-colors duration-150"
                data-interactive="true"
              >
                Pricing
              </a>
            </div>
          </div>

          {/* Column 3: College */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary font-satoshi">
              College
            </h4>
            <div className="flex flex-col gap-2.5">
              <a
                href="#"
                className="text-text-muted hover:text-text-secondary text-[13.5px] transition-colors duration-150"
                data-interactive="true"
              >
                About Us
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-text-secondary text-[13.5px] transition-colors duration-150"
                data-interactive="true"
              >
                Contact
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-text-secondary text-[13.5px] transition-colors duration-150"
                data-interactive="true"
              >
                Blog
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-text-secondary text-[13.5px] transition-colors duration-150"
                data-interactive="true"
              >
                Careers
              </a>
            </div>
          </div>

          {/* Column 4: Legal */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary font-satoshi">
              Legal
            </h4>
            <div className="flex flex-col gap-2.5">
              <a
                href="#"
                className="text-text-muted hover:text-text-secondary text-[13.5px] transition-colors duration-150"
                data-interactive="true"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-text-secondary text-[13.5px] transition-colors duration-150"
                data-interactive="true"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-text-secondary text-[13.5px] transition-colors duration-150"
                data-interactive="true"
              >
                Cookie Settings
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-medium">
          <p>
            &copy; {currentYear} RecordFlow. All rights reserved. Built for Indian engineering colleges.
          </p>
          <p className="flex items-center gap-1">
            Made with care in{' '}
            <span className="text-text-secondary">Andhra Pradesh</span>
            <span className="text-red-500 scale-105 inline-flex items-center">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </span>{' '}
            🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
