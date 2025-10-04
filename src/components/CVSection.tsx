"use client";
import React, { useState } from "react";

interface Experience {
  role: string;
  organization?: string;
  period: string;
  location: string;
  description?: string | string[];
}

interface Education {
  degree: string;
  institution: string;
  period: string;
}

interface Publication {
  title: string;
  year?: string | number;
  link?: string;
  pdf_file?: string;
  description?: string;
}

interface Award {
  title: string;
  year: string | number;
}

interface Language {
  name: string;
  level: string;
}

interface Skill {
  name: string;
  level: number;
}

interface Skills {
  technical: Skill[];
  soft?: Skill[];
}

interface CVData {
  name: string;
  title: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experience: Experience[];
  other_experience: Experience[];
  education: Education[];
  skills: Skills;
  languages: Language[];
  publications: Publication[];
  awards: Award[];
}


// Detect language from data or fallback to 'en'
const detectLang = (data: CVData) => {
  if (data && data.languages && data.languages.length > 0) {
    const langs = data.languages.map(l => l.name.toLowerCase());
    if (langs.includes("español") || langs.includes("espanol")) return "es";
    if (langs.includes("français") || langs.includes("francais")) return "fr";
  }
  return "en";
};

const SECTION_TITLES: Record<string, Record<string, string>> = {
  en: {
    summary: "About Me",
    experience: "Professional Experience",
    other_experience: "Other Relevant Experience",
    education: "Education",
    skills: "Skills & Languages",
    technical_skills: "What I Bring to the Table",
    languages: "Languages",
    publications: "Publications",
    awards: "Scholarships, Awards & Further Academic Training",
    download: "Download PDF"
  },
  es: {
    summary: "Sobre Mí",
    experience: "Experiencia Profesional",
    other_experience: "Otras Experiencias Relevantes",
    education: "Educación",
    skills: "Habilidades e Idiomas",
    technical_skills: "Lo que Aporto",
    languages: "Idiomas",
    publications: "Publicaciones",
    awards: "Becas, Premios y Formación Académica Adicional",
    download: "Descargar PDF"
  },
  fr: {
    summary: "À Propos de Moi",
    experience: "Expérience Professionnelle",
    other_experience: "Autres Expériences Pertinentes",
    education: "Éducation",
    skills: "Compétences et Langues",
    technical_skills: "Ce que j'apporte",
    languages: "Langues",
    publications: "Publications",
    awards: "Bourses, Prix et Formation Supplémentaire",
    download: "Télécharger le PDF"
  }
};

export default function CVSection({ data }: { data: CVData }) {
  const lang = detectLang(data);
  const t = SECTION_TITLES[lang] || SECTION_TITLES.en;
  
  // State for tracking expanded experience items
  const [expandedExperience, setExpandedExperience] = useState<Set<number>>(new Set());
  const [expandedOtherExperience, setExpandedOtherExperience] = useState<Set<number>>(new Set());
  
  const toggleExperience = (index: number) => {
    const newExpanded = new Set(expandedExperience);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedExperience(newExpanded);
  };
  
  const toggleOtherExperience = (index: number) => {
    const newExpanded = new Set(expandedOtherExperience);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedOtherExperience(newExpanded);
  };
  
  return (
    <div className="w-full">
      {/* Header Section - Geometric Background */}
      <section 
        className="w-full py-20 pt-28 bg-gray-50 dark:bg-slate-900 relative overflow-hidden"
        style={{
          backgroundImage: 'url(images/hero-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Grey overlay for better text readability */}
        <div className="absolute inset-0 bg-gray-800/60 dark:bg-gray-900/70"></div>
        
        <div className="max-w-5xl mx-auto px-8 relative z-10">
          <header className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 text-white drop-shadow-lg">{data.name}</h1>
            <h2 className="text-3xl md:text-4xl text-gray-100 mb-10 font-medium drop-shadow-lg leading-tight">
              {(() => {
                // Split logic for different languages
                const title = data.title;
                let firstLine = '';
                let secondLine = '';
                
                if (title.includes(' for ')) {
                  // English: Split at " for "
                  const parts = title.split(' for ');
                  const beforeFor = parts[0];
                  const afterFor = parts[1];
                  
                  // Split the first part at the last " | " to get a better break
                  const beforeForParts = beforeFor.split(' | ');
                  if (beforeForParts.length >= 3) {
                    firstLine = beforeForParts.slice(0, 2).join(' | ');
                    secondLine = beforeForParts.slice(2).join(' | ') + ' for ' + afterFor;
                  } else {
                    firstLine = beforeFor;
                    secondLine = 'for ' + afterFor;
                  }
                } else if (title.includes(' en ') && (title.includes('Migración') || title.includes('Social'))) {
                  // Spanish: Split at " en "
                  const parts = title.split(' en ');
                  const beforeEn = parts[0];
                  const afterEn = parts[1];
                  
                  const beforeEnParts = beforeEn.split(' | ');
                  if (beforeEnParts.length >= 3) {
                    firstLine = beforeEnParts.slice(0, 2).join(' | ');
                    secondLine = beforeEnParts.slice(2).join(' | ') + ' en ' + afterEn;
                  } else {
                    firstLine = beforeEn;
                    secondLine = 'en ' + afterEn;
                  }
                } else if (title.includes(' pour ') && (title.includes('migration') || title.includes('sociale'))) {
                  // French: Split at " pour "
                  const parts = title.split(' pour ');
                  const beforePour = parts[0];
                  const afterPour = parts[1];
                  
                  const beforePourParts = beforePour.split(' | ');
                  if (beforePourParts.length >= 3) {
                    firstLine = beforePourParts.slice(0, 2).join(' | ');
                    secondLine = beforePourParts.slice(2).join(' | ') + ' pour ' + afterPour;
                  } else {
                    firstLine = beforePour;
                    secondLine = 'pour ' + afterPour;
                  }
                } else {
                  // Fallback: just display as is
                  firstLine = title;
                }
                
                return (
                  <>
                    <div>{firstLine}</div>
                    {secondLine && <div>{secondLine}</div>}
                  </>
                );
              })()}
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-lg md:text-xl text-gray-100">
              <span className="font-medium">{data.contact.location}</span>
              <span className="hidden sm:inline">•</span>
              <a href={`mailto:${data.contact.email}`} className="hover:underline hover:text-orange-300 transition-colors font-medium">{data.contact.email}</a>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-4">
                <a 
                  href={data.contact.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:scale-110 transition-transform duration-200"
                  aria-label="LinkedIn Profile"
                >
                  <svg className="w-6 h-6 fill-gray-100 hover:fill-orange-300 transition-colors" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href={data.contact.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:scale-110 transition-transform duration-200"
                  aria-label="GitHub Profile"
                >
                  <svg className="w-6 h-6 fill-gray-100 hover:fill-orange-300 transition-colors" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Download Button */}
            <div className="mt-12">
              <a
                href="/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-400 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-orange-500 transition font-semibold drop-shadow-lg"
              >
                {t.download}
              </a>
            </div>
          </header>
        </div>
      </section>

      {/* About Me Section - Light Orange Background */}
      <section id="about" className="w-full bg-orange-50 dark:bg-slate-800 py-14">
        <div className="max-w-5xl mx-auto px-8">
          <h3 className="font-semibold text-2xl mb-6">
            <span className="inline-block pb-1 border-b-4 border-orange-500">{t.summary}</span>
          </h3>
          <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">{data.summary}</p>
        </div>
      </section>

      {/* Experience Section - White Background */}
      <section id="experience" className="w-full bg-white dark:bg-slate-900 py-14">
        <div className="max-w-5xl mx-auto px-8">
          <h3 className="font-semibold text-2xl mb-8">
            <span className="inline-block pb-1 border-b-4 border-orange-500">{t.experience}</span>
          </h3>
          <ul className="space-y-8">
            {data.experience.map((exp, i) => {
              // Get organization logo based on organization name
              const getOrgLogo = (organization: string) => {
                if (!organization) return null;
                const lowerOrg = organization.toLowerCase();
                if (lowerOrg.includes('icmpd')) return 'images/icmpd-logo.png';
                if (lowerOrg.includes('ilo') || lowerOrg.includes('international labour')) return 'images/ilo-logo.png';
                if (lowerOrg.includes('unicef')) return 'images/unicef-logo.png';
                if (lowerOrg.includes('housing') || lowerOrg.includes('vivienda')) return 'images/ministry-housing-peru-logo.jpg';
                if (lowerOrg.includes('economy') || lowerOrg.includes('finance') || lowerOrg.includes('economía')) return 'images/ministry-finance-peru-logo.jpg';
                if (lowerOrg.includes('education') || lowerOrg.includes('educación')) return 'images/ministry-education-peru-logo.jpg';
                return null;
              };
              
              const logoSrc = getOrgLogo(exp.organization || '');
              
              return (
                <li key={i} className="mb-8">
                  <div 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
                    onClick={() => toggleExperience(i)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Organization Logo */}
                        {logoSrc && (
                          <div className="flex-shrink-0">
                            <img 
                              src={logoSrc}
                              alt={`${exp.organization} logo`}
                              className="w-12 h-12 object-contain rounded"
                            />
                          </div>
                        )}
                        
                        {/* Experience Content */}
                        <div className="flex-1">
                          <div className="font-semibold text-lg text-gray-700 dark:text-gray-300">{exp.role}{exp.organization ? `, ${exp.organization}` : ''}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{exp.period} | {exp.location}</div>
                        </div>
                      </div>
                      <div className="text-orange-500 ml-4">
                        {expandedExperience.has(i) ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                {expandedExperience.has(i) && (
                  <div className="mt-3 ml-3">
                    {Array.isArray(exp.description) ? (
                      <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-200 space-y-1">
                        {exp.description.map((d, j) => <li key={j}>{d}</li>)}
                      </ul>
                    ) : (
                      <div className="text-gray-700 dark:text-gray-200">{exp.description}</div>
                    )}
                  </div>
                )}
              </li>
            );})}
          </ul>
        </div>
      </section>

      {/* Other Experience Section - Light Orange Background */}
      {data.other_experience && data.other_experience.length > 0 && (
        <section id="other-experience" className="w-full bg-orange-50 dark:bg-slate-800 py-14">
          <div className="max-w-5xl mx-auto px-8">
            <h3 className="font-semibold text-2xl mb-8">
              <span className="inline-block pb-1 border-b-4 border-orange-500">{t.other_experience}</span>
            </h3>
            <ul className="space-y-6">
              {data.other_experience.map((exp, i) => (
                <li key={i} className="mb-4">
                  <div 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
                    onClick={() => toggleOtherExperience(i)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-gray-700 dark:text-gray-300">{exp.role}{exp.organization ? `, ${exp.organization}` : ''}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{exp.period} | {exp.location}</div>
                      </div>
                      <div className="text-orange-500 ml-4">
                        {expandedOtherExperience.has(i) ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedOtherExperience.has(i) && exp.description && (
                    <div className="mt-3 ml-3">
                      {Array.isArray(exp.description) ? (
                        <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-200 space-y-1">
                          {exp.description.map((d, j) => <li key={j}>{d}</li>)}
                        </ul>
                      ) : (
                        <div className="text-gray-700 dark:text-gray-200">{exp.description}</div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Skills & Languages Section - White Background */}
      <section id="skills" className="w-full bg-white dark:bg-slate-900 py-14">
        <div className="max-w-5xl mx-auto px-8">
          <h3 className="font-semibold text-2xl mb-12">
            <span className="inline-block pb-1 border-b-4 border-orange-500">{t.skills}</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Technical Skills */}
            <div>
              <h4 className="font-semibold text-lg mb-6 text-gray-800 dark:text-gray-200">Technical Skills</h4>
              <div className="space-y-4">
                {data.skills.technical.map((skill, i) => (
                  <div key={i} className="">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-200 font-medium">{skill.name}</span>
                    </div>
                    <div className="w-4/5 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-orange-500 dark:bg-orange-400 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Soft Skills */}
            {data.skills.soft && (
              <div>
                <h4 className="font-semibold text-lg mb-6 text-gray-800 dark:text-gray-200">Soft Skills</h4>
                <div className="space-y-4">
                  {data.skills.soft.map((skill, i) => (
                    <div key={i} className="">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 dark:text-gray-200 font-medium">{skill.name}</span>
                      </div>
                      <div className="w-4/5 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-orange-500 dark:bg-orange-400 h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Languages Section - Flag-based display */}
          <div className="mt-12">
            <h4 className="font-semibold text-lg mb-6 text-gray-800 dark:text-gray-200">Languages</h4>
            <div className="flex justify-between items-center flex-wrap gap-4">
              {data.languages.map((lang, i) => {
                // Map language names to country codes for flags
                const getCountryCode = (langName: string) => {
                  const lowerName = langName.toLowerCase();
                  if (lowerName.includes('english') || lowerName.includes('anglais') || lowerName.includes('inglés')) return 'gb';
                  if (lowerName.includes('spanish') || lowerName.includes('espanol') || lowerName.includes('español') || lowerName.includes('castilian')) return 'es';
                  if (lowerName.includes('french') || lowerName.includes('français') || lowerName.includes('francés')) return 'fr';
                  return 'gb'; // fallback
                };
                
                // Get language level percentage
                const getLanguageLevel = (level: string) => {
                  const lowerLevel = level.toLowerCase();
                  if (lowerLevel.includes('native') || lowerLevel.includes('nativ')) return 100;
                  if (lowerLevel.includes('full professional') || lowerLevel.includes('professionnel complet') || lowerLevel.includes('profesional completo') || lowerLevel.includes('c1')) return 95;
                  if (lowerLevel.includes('professional working') || lowerLevel.includes('compétence professionnelle') || lowerLevel.includes('competencia profesional') || lowerLevel.includes('b1')) return 85;
                  if (lowerLevel.includes('a2')) return 70;
                  return 80;
                };
                
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`fi fi-${getCountryCode(lang.name)} circular`}></div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 dark:text-gray-200 font-medium">{lang.name}</span>
                      <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-orange-500 dark:bg-orange-400 h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${getLanguageLevel(lang.level)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section - Light Orange Background */}
      <section id="education" className="w-full bg-orange-50 dark:bg-slate-800 py-14">
        <div className="max-w-5xl mx-auto px-8">
          <h3 className="font-semibold text-2xl mb-8">
            <span className="inline-block pb-1 border-b-4 border-orange-500">{t.education}</span>
          </h3>
          <ul className="space-y-6">
            {data.education.map((edu, i) => {
              // Get school logo based on institution
              const getSchoolLogo = (institution: string) => {
                const lowerInstitution = institution.toLowerCase();
                if (lowerInstitution.includes('hertie')) return 'images/hertie-school.png';
                if (lowerInstitution.includes('pacifico')) return 'images/universidad-del-pacifico.png';
                return null;
              };
              
              // Get university website URL
              const getUniversityUrl = (institution: string) => {
                const lowerInstitution = institution.toLowerCase();
                if (lowerInstitution.includes('hertie')) return 'https://www.hertie-school.org/';
                if (lowerInstitution.includes('pacifico')) return 'https://www.up.edu.pe/';
                return null;
              };
              
              const logoSrc = getSchoolLogo(edu.institution);
              const universityUrl = getUniversityUrl(edu.institution);
              
              return (
                <li key={i} className="mb-4">
                  <div className="flex items-center gap-4">
                    {/* School Logo */}
                    {logoSrc && (
                      <div className="flex-shrink-0">
                        {universityUrl ? (
                          <a 
                            href={universityUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:opacity-80 transition-opacity duration-200"
                          >
                            <img 
                              src={logoSrc}
                              alt={`${edu.institution} logo`}
                              className="w-12 h-12 object-contain rounded"
                            />
                          </a>
                        ) : (
                          <img 
                            src={logoSrc}
                            alt={`${edu.institution} logo`}
                            className="w-12 h-12 object-contain rounded"
                          />
                        )}
                      </div>
                    )}
                    
                    {/* Education Content */}
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{edu.degree}</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {universityUrl ? (
                          <a 
                            href={universityUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                          >
                            {edu.institution}
                          </a>
                        ) : (
                          edu.institution
                        )}
                        {" | "}{edu.period}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Publications Section - White Background */}
      {data.publications && data.publications.length > 0 && (
        <section id="publications" className="w-full bg-white dark:bg-slate-900 py-14">
          <div className="max-w-5xl mx-auto px-8">
            <h3 className="font-semibold text-2xl mb-8">
              <span className="inline-block pb-1 border-b-4 border-orange-500">{t.publications}</span>
            </h3>
            <div className="space-y-8">
              {data.publications.map((pub, i) => {
                // Map publication to correct thumbnail filename
                const getThumbnailFilename = (pub: Publication) => {
                  if (pub.pdf_file) {
                    const filename = pub.pdf_file;
                    // Map to actual thumbnail filenames
                    if (filename.includes('impact_ai_digitalisation_indigenous_communities_2025')) {
                      return 'ai_indigenous_communities_2025.png';
                    } else if (filename.includes('forging_just_transition_green_jobs_2023')) {
                      return 'gsp_report_2023.png';
                    } else if (filename.includes('women_participation_politics_care_policies_latin_america_2023')) {
                      return 'women_participation_politics_2023.png';
                    } else if (filename.includes('nuevas_herramientas_analizar_territorio_peruano_2021')) {
                      return 'territory_analysis_peru_2021.png';
                    } else if (filename.includes('reporte_brechas_relevancias_centros_poblados_rurales_2021')) {
                      return 'rural_centers_report_2021.png';
                    }
                  }
                  return null;
                };
                
                const thumbnailFile = getThumbnailFilename(pub);
                
                return (
                  <div key={i} className="flex gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {/* Thumbnail on the left */}
                    {thumbnailFile && (
                      <div className="flex-shrink-0">
                        <img 
                          src={`images/publications/${thumbnailFile}`}
                          alt={`${pub.title} preview`}
                          className="w-24 h-32 object-cover rounded shadow-md border border-gray-200 dark:border-gray-600"
                        />
                      </div>
                    )}
                    
                    {/* Content on the right */}
                    <div className="flex-1">
                      {/* Title with PDF icon */}
                      <div className="flex items-center mb-3">
                        {pub.link ? (
                          <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-orange-600 dark:text-orange-400 hover:underline font-medium text-lg">{pub.title}</a>
                        ) : (
                          <span className="font-medium text-lg">{pub.title}</span>
                        )}
                        {pub.year && <span className="text-gray-500 dark:text-gray-400 ml-2 text-lg">({pub.year})</span>}
                        {pub.pdf_file && (
                          <a 
                            href={`/publications/${pub.pdf_file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 hover:scale-110 transition-transform duration-200 flex-shrink-0"
                            title="Download PDF"
                            aria-label={`Download PDF: ${pub.title}`}
                          >
                            <img 
                              src="images/pdf-icon.png"
                              alt="PDF Download" 
                              className="w-5 h-5 hover:opacity-75 transition-opacity"
                            />
                          </a>
                        )}
                      </div>
                      
                      {/* Description */}
                      {pub.description && (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{pub.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Awards Section - Light Orange Background */}
      {data.awards && data.awards.length > 0 && (
        <section id="awards" className="w-full bg-orange-50 dark:bg-slate-800 py-14">
          <div className="max-w-5xl mx-auto px-8">
            <h3 className="font-semibold text-2xl mb-8">
              <span className="inline-block pb-1 border-b-4 border-orange-500">{t.awards}</span>
            </h3>
            <div className="space-y-6">
              {data.awards.map((award, i) => {
                // Get logo/thumbnail for each award
                const getAwardVisual = (title: string) => {
                  const lowerTitle = title.toLowerCase();
                  if (lowerTitle.includes('good practices') || lowerTitle.includes('buenas prácticas')) {
                    return { type: 'pdf', src: 'awards/good-practices-award-2019.pdf', thumbnail: 'images/awards/good-practices-award-thumbnail.png' };
                  } else if (lowerTitle.includes('hertie')) {
                    return { type: 'logo', src: '/images/hertie-school.png', link: 'https://www.hertie-school.org/' };
                  } else if (lowerTitle.includes('geneva') || lowerTitle.includes('un')) {
                    return { type: 'logo', src: 'images/un-geneva-logo.png', link: 'https://www.ungeneva.org/' };
                  }
                  return null;
                };
                
                const visual = getAwardVisual(award.title);
                
                return (
                  <div key={i} className="flex gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {/* Visual on the left */}
                    {visual && (
                      <div className="flex-shrink-0">
                        {visual.link ? (
                          <a 
                            href={visual.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity duration-200"
                          >
                            <img 
                              src={visual.src.startsWith('/') ? visual.src.slice(1) : visual.src}
                              alt={`${award.title} logo`}
                              className={`object-contain rounded ${
                                visual.src.includes('un-geneva') 
                                  ? 'w-20 h-20' 
                                  : 'w-16 h-16'
                              }`}
                            />
                          </a>
                        ) : (
                          <a 
                            href={visual.src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity duration-200"
                          >
                            <img 
                              src={visual.thumbnail ? (visual.thumbnail.startsWith('/') ? visual.thumbnail.slice(1) : visual.thumbnail) : ''}
                              alt="Award document"
                              className="w-24 h-32 object-cover rounded shadow-md border border-gray-200 dark:border-gray-600"
                            />
                          </a>
                        )}
                      </div>
                    )}
                    
                    {/* Award content */}
                    <div className="flex-1">
                      <div className="font-semibold text-lg mb-1">{award.title}</div>
                      <div className="text-gray-500 dark:text-gray-400">({award.year})</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
