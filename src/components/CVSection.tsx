import React from "react";

interface Experience {
  role: string;
  period: string;
  location: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  period: string;
}

interface Publication {
  title: string;
  link: string;
}

interface Award {
  title: string;
  year: string;
}

interface Language {
  name: string;
  level: string;
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
  languages: Language[];
  publications: Publication[];
  awards: Award[];
}

export default function CVSection({ data }: { data: CVData }) {
  return (
    <div className="max-w-3xl w-full bg-white dark:bg-[#181818] shadow-xl rounded-lg p-8 border border-gray-200 dark:border-gray-700">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">{data.name}</h1>
        <h2 className="text-xl text-center text-gray-600 dark:text-gray-300 mb-4">{data.title}</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{data.contact.location}</span>
          <span>•</span>
          <a href={`mailto:${data.contact.email}`} className="hover:underline">{data.contact.email}</a>
          <span>•</span>
          <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
          <span>•</span>
          <a href={data.contact.github} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
        </div>
      </header>
      <section className="mb-8">
        <h3 className="font-semibold text-lg mb-2">Summary</h3>
        <p className="text-gray-700 dark:text-gray-200">{data.summary}</p>
      </section>
      <section className="mb-8">
        <h3 className="font-semibold text-lg mb-2">Professional Experience</h3>
        <ul className="space-y-4">
          {data.experience.map((exp, i) => (
            <li key={i}>
              <div className="font-semibold">{exp.role}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{exp.period} | {exp.location}</div>
              <div className="text-gray-700 dark:text-gray-200">{exp.description}</div>
            </li>
          ))}
        </ul>
      </section>
      {data.other_experience && data.other_experience.length > 0 && (
        <section className="mb-8">
          <h3 className="font-semibold text-lg mb-2">Other Relevant Experience</h3>
          <ul className="space-y-4">
            {data.other_experience.map((exp, i) => (
              <li key={i}>
                <div className="font-semibold">{exp.role}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{exp.period} | {exp.location}</div>
                <div className="text-gray-700 dark:text-gray-200">{exp.description}</div>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="mb-8">
        <h3 className="font-semibold text-lg mb-2">Education</h3>
        <ul className="space-y-2">
          {data.education.map((edu, i) => (
            <li key={i}>
              <div className="font-semibold">{edu.degree}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{edu.institution} | {edu.period}</div>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="font-semibold text-lg mb-2">Languages</h3>
        <ul className="flex flex-wrap gap-4">
          {data.languages.map((lang, i) => (
            <li key={i} className="text-gray-700 dark:text-gray-200">
              <span className="font-semibold">{lang.name}:</span> {lang.level}
            </li>
          ))}
        </ul>
      </section>
      {data.publications && data.publications.length > 0 && (
        <section className="mb-8">
          <h3 className="font-semibold text-lg mb-2">Selected Publications</h3>
          <ul className="list-disc list-inside">
            {data.publications.map((pub, i) => (
              <li key={i}>
                <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:underline">{pub.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {data.awards && data.awards.length > 0 && (
        <section className="mb-8">
          <h3 className="font-semibold text-lg mb-2">Scholarships, Awards & Further Academic Training</h3>
          <ul className="list-disc list-inside">
            {data.awards.map((award, i) => (
              <li key={i}>{award.title} ({award.year})</li>
            ))}
          </ul>
        </section>
      )}
      <div className="flex justify-end mt-8">
        <a
          href="/Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-700 text-white px-6 py-2 rounded shadow hover:bg-blue-800 transition"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}
