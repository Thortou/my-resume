'use client';

import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import type { ResumeTemplateProps } from '@/types/resume';
import Image from 'next/image';

export function ModernTemplate({ data, className = '' }: ResumeTemplateProps) {
  return (
    <div className={`resume-preview bg-white text-gray-900 ${className}`}>
      {/* A4 Paper - Modern Clean Layout */}
      <div className="resume-page mx-auto min-h-[297mm] w-[210mm] bg-white shadow-lg print:shadow-none">
        {/* Header with accent */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-8 text-white">
          <div className="flex items-center gap-6">
            {data.photoUrl && (
              <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-full border-4 border-white/30 shadow-lg">
                <Image
                  src={data.photoUrl}
                  alt={data.fullName}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight">
                {data.fullName}
              </h1>
              {data.jobTitle && (
                <p className="mt-1 text-xl font-light text-indigo-100">
                  {data.jobTitle}
                </p>
              )}
              {/* Contact Row */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-indigo-100">
                {data.email && (
                  <span className="flex items-center gap-1.5">
                    <MailOutlined /> {data.email}
                  </span>
                )}
                {data.phone && (
                  <span className="flex items-center gap-1.5">
                    <PhoneOutlined /> {data.phone}
                  </span>
                )}
                {data.address && (
                  <span className="flex items-center gap-1.5">
                    <EnvironmentOutlined /> {data.address}
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-indigo-100">
                {data.website && (
                  <a
                    href={data.website}
                    className="flex items-center gap-1.5 hover:text-white"
                  >
                    <GlobalOutlined />{' '}
                    {data.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {data.linkedin && (
                  <a
                    href={data.linkedin}
                    className="flex items-center gap-1.5 hover:text-white"
                  >
                    <LinkedinOutlined /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-10 py-8">
          {/* Objective */}
          {data.objective && (
            <section className="mb-8">
              <h2 className="mb-3 flex items-center text-lg font-bold uppercase tracking-wider text-indigo-600">
                <span className="mr-3 h-0.5 w-8 bg-indigo-600"></span>
                About Me
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-gray-600">
                {data.objective}
              </p>
            </section>
          )}

          {/* Two Column Layout for Experience & Skills */}
          <div className="flex gap-8">
            {/* Left Column - Experience & Education */}
            <div className="flex-1">
              {/* Experience */}
              {data.experience.length > 0 && (
                <section className="mb-8">
                  <h2 className="mb-4 flex items-center text-lg font-bold uppercase tracking-wider text-indigo-600">
                    <span className="mr-3 h-0.5 w-8 bg-indigo-600"></span>
                    Experience
                  </h2>
                  <div className="space-y-5">
                    {data.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="relative border-l-2 border-indigo-200 pl-5"
                      >
                        <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-indigo-600"></div>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {exp.role}
                            </h3>
                            <p className="text-sm font-medium text-indigo-600">
                              {exp.company}
                            </p>
                          </div>
                          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <section className="mb-8">
                  <h2 className="mb-4 flex items-center text-lg font-bold uppercase tracking-wider text-indigo-600">
                    <span className="mr-3 h-0.5 w-8 bg-indigo-600"></span>
                    Education
                  </h2>
                  <div className="space-y-5">
                    {data.education.map((edu, index) => (
                      <div
                        key={index}
                        className="relative border-l-2 border-indigo-200 pl-5"
                      >
                        <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-indigo-600"></div>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {edu.degree}
                            </h3>
                            <p className="text-sm font-medium text-indigo-600">
                              {edu.school}
                            </p>
                          </div>
                          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                            {edu.startDate} - {edu.endDate || 'Present'}
                          </span>
                        </div>
                        {edu.description && (
                          <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Skills & Languages */}
            <div className="w-56 flex-shrink-0">
              {/* Skills */}
              {data.skills.length > 0 && (
                <section className="mb-8">
                  <h2 className="mb-4 flex items-center text-lg font-bold uppercase tracking-wider text-indigo-600">
                    <span className="mr-3 h-0.5 w-8 bg-indigo-600"></span>
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {data.languages.length > 0 && (
                <section className="mb-8">
                  <h2 className="mb-4 flex items-center text-lg font-bold uppercase tracking-wider text-indigo-600">
                    <span className="mr-3 h-0.5 w-8 bg-indigo-600"></span>
                    Languages
                  </h2>
                  <div className="space-y-3">
                    {data.languages.map((lang, index) => (
                      <div key={index}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-medium text-gray-900">
                            {lang.name}
                          </span>
                          <span className="text-gray-500">{lang.level}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            style={{
                              width:
                                lang.level.toLowerCase().includes('native') ||
                                lang.level.toLowerCase().includes('fluent')
                                  ? '100%'
                                  : lang.level
                                        .toLowerCase()
                                        .includes('advanced')
                                    ? '80%'
                                    : lang.level
                                          .toLowerCase()
                                          .includes('intermediate')
                                      ? '60%'
                                      : '40%',
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive & Print Styles */}
      <style jsx>{`
        @media screen and (max-width: 767px) {
          .resume-page {
            width: 100%;
            min-height: auto;
          }
          .resume-page .flex.gap-8 {
            flex-direction: column;
          }
          .resume-page .w-56 {
            width: 100%;
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
