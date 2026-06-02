'use client';

import type { ResumeTemplateProps } from '@/types/resume';

export function ATSFriendlyTemplate({
  data,
  className = '',
}: ResumeTemplateProps) {
  return (
    <div className={`resume-preview bg-white text-gray-900 ${className}`}>
      {/* A4 Paper - ATS Friendly Single Column Layout */}
      <div className="resume-page mx-auto min-h-[297mm] w-[210mm] bg-white p-12 shadow-lg print:shadow-none">
        {/* Header - Simple, clean text */}
        <header className="mb-6 border-b-2 border-gray-900 pb-4 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900">
            {data.fullName}
          </h1>
          {data.jobTitle && (
            <p className="mt-1 text-lg text-gray-700">{data.jobTitle}</p>
          )}

          {/* Contact Info - Single line format */}
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>| {data.phone}</span>}
            {data.address && <span>| {data.address}</span>}
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
            {data.website && (
              <span>{data.website.replace(/^https?:\/\//, '')}</span>
            )}
            {data.linkedin && (
              <span>
                {data.website ? '| ' : ''}
                {data.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            )}
          </div>
        </header>

        {/* Professional Summary / Objective */}
        {data.objective && (
          <section className="mb-6">
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-lg font-bold uppercase text-gray-900">
              Professional Summary
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {data.objective}
            </p>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-lg font-bold uppercase text-gray-900">
              Skills
            </h2>
            <p className="text-sm text-gray-700">{data.skills.join(' • ')}</p>
          </section>
        )}

        {/* Work Experience */}
        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-lg font-bold uppercase text-gray-900">
              Professional Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex flex-wrap items-baseline justify-between">
                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-sm italic text-gray-700">{exp.company}</p>
                  {exp.description && (
                    <div className="mt-2 whitespace-pre-line text-sm text-gray-700">
                      {exp.description.split('\n').map((line, i) => (
                        <p
                          key={i}
                          className={
                            line.trim().startsWith('•') ||
                            line.trim().startsWith('-')
                              ? ''
                              : ''
                          }
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-lg font-bold uppercase text-gray-900">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex flex-wrap items-baseline justify-between">
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <span className="text-sm text-gray-600">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-sm italic text-gray-700">{edu.school}</p>
                  {edu.description && (
                    <p className="mt-1 whitespace-pre-line text-sm text-gray-700">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-lg font-bold uppercase text-gray-900">
              Languages
            </h2>
            <p className="text-sm text-gray-700">
              {data.languages
                .map((lang) => `${lang.name} (${lang.level})`)
                .join(' • ')}
            </p>
          </section>
        )}
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media screen and (max-width: 767px) {
          .resume-page {
            width: 100%;
            min-height: auto;
            padding: 2rem;
          }
        }
        @media print {
          .resume-preview {
            margin: 0;
            padding: 0;
          }
          .resume-page {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
}
