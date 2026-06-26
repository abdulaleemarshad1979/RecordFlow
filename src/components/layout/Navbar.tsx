import React, { useState, useEffect } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { Menu, X, Layers } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar() {
  const { scrollY } = useScrollProgress();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsScrolled(scrollY > 80);
  }, [scrollY]);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'Faculty', href: '#faculty' },
    { label: 'Students', href: '#students' },
    { label: 'About', href: '#about' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Navbar Wrapper */}
      <nav
        id="navbar"
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-40 w-[90%] md:w-full md:max-w-4xl transition-all duration-300 rounded-full
          ${isScrolled 
            ? 'bg-bg-secondary/85 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
            : 'bg-bg-secondary/60 border-white/8 shadow-[0_8px_24px_rgba(0,0,0,0.3)]'
          }
          border backdrop-blur-xl saturate-[180%] py-2.5 px-5 md:px-6
        `}
        style={{
          boxShadow: '0 0 0 1px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 select-none"
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

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-[13.5px] font-medium text-slate-400 hover:text-white transition-colors duration-150 py-1"
                data-interactive="true"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" data-interactive="true">
              Log in
            </Button>
            <Button
              variant="primary"
              size="sm"
              showArrow
              className="px-4.5 py-2 text-[13px]"
              data-interactive="true"
              onClick={() => {
                const ctaSec = document.getElementById('cta-section');
                if (ctaSec) ctaSec.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get started
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center justify-center p-1.5 rounded-full bg-white/5 border border-white/8 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
            data-interactive="true"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-30 bg-bg-primary/95 backdrop-blur-2xl md:hidden flex flex-col pt-28 px-8 pb-10"
        >
          {/* Menu items */}
          <div className="flex flex-col gap-6 mb-8 border-b border-white/6 pb-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-2xl font-semibold font-satoshi text-slate-300 hover:text-white transition-colors"
                data-interactive="true"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Call to actions in drawer */}
          <div className="flex flex-col gap-4 mt-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full text-base"
              onClick={() => setIsMobileMenuOpen(false)}
              data-interactive="true"
            >
              Log in
            </Button>
            <Button
              variant="primary"
              size="lg"
              showArrow
              className="w-full text-base"
              data-interactive="true"
              onClick={() => {
                setIsMobileMenuOpen(false);
                const ctaSec = document.getElementById('cta-section');
                if (ctaSec) ctaSec.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get started free
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
