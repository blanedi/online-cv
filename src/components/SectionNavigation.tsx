"use client";
import React, { useState, useEffect } from "react";

interface SectionNavigationProps {
  lang: string;
}

const SECTION_TITLES: Record<string, Record<string, string>> = {
  en: {
    about: "About",
    experience: "Experience",
    other_experience: "Other Experience",
    education: "Education",
    skills: "Skills",
    publications: "Publications",
    awards: "Awards"
  },
  es: {
    about: "Sobre Mí",
    experience: "Experiencia",
    other_experience: "Otras Experiencias",
    education: "Educación",
    skills: "Habilidades",
    publications: "Publicaciones",
    awards: "Premios"
  },
  fr: {
    about: "À Propos",
    experience: "Expérience",
    other_experience: "Autres Expériences",
    education: "Éducation",
    skills: "Compétences",
    publications: "Publications",
    awards: "Prix"
  }
};

export default function SectionNavigation({ lang }: SectionNavigationProps) {
  const [activeSection, setActiveSection] = useState("");
  const t = SECTION_TITLES[lang] || SECTION_TITLES.en;

  const sections = [
    { id: "about", title: t.about },
    { id: "experience", title: t.experience },
    { id: "other-experience", title: t.other_experience },
    { id: "skills", title: t.skills },
    { id: "education", title: t.education },
    { id: "publications", title: t.publications },
    { id: "awards", title: t.awards }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-8">
        <ul className="flex items-center justify-center space-x-12 py-4">
          {sections.map(({ id, title }) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className={`text-base font-medium transition-all duration-300 hover:text-orange-400 cursor-pointer relative ${
                  activeSection === id
                    ? "text-orange-400"
                    : "text-gray-300"
                }`}
                title={`Go to ${title}`}
              >
                {title}
                {/* Underline indicator */}
                <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                  activeSection === id
                    ? "w-full bg-orange-400"
                    : "w-0 bg-orange-400 hover:w-full"
                }`}></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}