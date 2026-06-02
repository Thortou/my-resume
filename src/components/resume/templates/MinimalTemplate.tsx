'use client';

import type { ResumeTemplateProps } from '@/types/resume';
import Image from 'next/image';

export function MinimalTemplate({ data, className = '' }: ResumeTemplateProps) {
  return (
    <div className={`resume-preview bg-white text-gray-800 ${className}`}>
      {/* A4 Paper - Minimal Clean Layout */}
      <div className="resume-page mx-auto min-h-[297mm] w-[210mm] bg-white px-16 py-12 shadow-lg print:shadow-none">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-light tracking-tight text-gray-900">
                {data.fullName}
              </h1>
              {data.jobTitle && (
                <p className="mt-1 text-lg font-light text-gray-500">
                  {data.jobTitle}
                </p>
              )}
            </div>
            {data.photoUrl && (
              <div className="h-20 w-20 overflow-hidden rounded-full grayscale">
                <Image
                  src={data.photoUrl}
                  alt={data.fullName}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Contact - Subtle line below */}
          <div className="mt-6 flex flex-wrap gap-6 border-t border-gray-200 pt-6 text-sm text-gray-500">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.address && <span>{data.address}</span>}
            {data.website && (
              <a
                href={data.website}
                className="transition-colors hover:text-gray-900"
              >
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {data.linkedin && (
              <a
                href={data.linkedin}
                className="transition-colors hover:text-gray-900"
              >
                LinkedIn
              </a>
            )}
          </div>
        </header>

        {/* Objective */}
        {data.objective && (
          <section className="mb-10">
            <p className="whitespace-pre-line font-light leading-relaxed text-gray-600">
              {data.objective}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Experience
            </h2>
            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <div key={index} className="grid grid-cols-[140px_1fr] gap-6">
                  <div className="text-sm text-gray-400">
                    <p>{exp.startDate}</p>
                    <p>{exp.endDate || 'Present'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{exp.role}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {exp.company}
                    </p>
                    {exp.description && (
                      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Education
            </h2>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index} className="grid grid-cols-[140px_1fr] gap-6">
                  <div className="text-sm text-gray-400">
                    <p>{edu.startDate}</p>
                    <p>{edu.endDate || 'Present'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">{edu.school}</p>
                    {edu.description && (
                      <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Languages - Side by side */}
        <div className="grid grid-cols-2 gap-12">
          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">{lang.name}</span>
                    <span className="text-gray-400">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Responsive & Print Styles */}
      <style jsx>{`
        @media screen and (max-width: 767px) {
          .resume-page {
            width: 100%;
            min-height: auto;
            padding: 2rem;
          }
          .resume-page .grid-cols-\\[140px_1fr\\] {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .resume-page .grid-cols-2 {
            grid-template-columns: 1fr;
            gap: 2rem;
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
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
}
