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

export function CreativeTemplate({
  data,
  className = '',
}: ResumeTemplateProps) {
  return (
    <div className={`resume-preview bg-gray-100 text-gray-900 ${className}`}>
      {/* A4 Paper - Creative Bold Layout */}
      <div className="resume-page mx-auto min-h-[297mm] w-[210mm] overflow-hidden bg-white shadow-lg print:shadow-none">
        {/* Creative Header with diagonal */}
        <div className="relative">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
          </div>

          {/* Profile Card */}
          <div className="absolute -bottom-20 left-1/2 flex -translate-x-1/2 transform flex-col items-center">
            {data.photoUrl ? (
              <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-xl">
                <Image
                  src={data.photoUrl}
                  alt={data.fullName}
                  width={144}
                  height={144}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-rose-500 to-orange-400 shadow-xl">
                <span className="text-4xl font-bold text-white">
                  {data.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Name & Title (below profile) */}
        <div className="px-8 pb-6 pt-24 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{data.fullName}</h1>
          {data.jobTitle && (
            <p className="mt-1 text-lg font-medium text-rose-500">
              {data.jobTitle}
            </p>
          )}

          {/* Contact Icons Row */}
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-1.5 transition-colors hover:text-rose-500"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                  <MailOutlined className="text-rose-500" />
                </span>
                <span>{data.email}</span>
              </a>
            )}
            {data.phone && (
              <span className="flex items-center gap-1.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <PhoneOutlined className="text-orange-500" />
                </span>
                <span>{data.phone}</span>
              </span>
            )}
            {data.address && (
              <span className="flex items-center gap-1.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
                  <EnvironmentOutlined className="text-pink-500" />
                </span>
                <span>{data.address}</span>
              </span>
            )}
          </div>
          <div className="mt-2 flex justify-center gap-4 text-sm text-gray-600">
            {data.website && (
              <a
                href={data.website}
                className="flex items-center gap-1.5 transition-colors hover:text-rose-500"
              >
                <GlobalOutlined className="text-gray-400" />{' '}
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {data.linkedin && (
              <a
                href={data.linkedin}
                className="flex items-center gap-1.5 transition-colors hover:text-rose-500"
              >
                <LinkedinOutlined className="text-gray-400" /> LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-10 pb-8">
          {/* Objective */}
          {data.objective && (
            <section className="mx-auto mb-8 max-w-2xl text-center">
              <p className="whitespace-pre-line italic leading-relaxed text-gray-600">
                &ldquo;{data.objective}&rdquo;
              </p>
            </section>
          )}

          {/* Skills Bar */}
          {data.skills.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-rose-500">
                Expertise
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-2 text-sm font-medium text-white shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-8">
            {/* Experience */}
            <div>
              {data.experience.length > 0 && (
                <section>
                  <h2 className="mb-4 border-b-2 border-rose-100 pb-2 text-sm font-bold uppercase tracking-widest text-rose-500">
                    Work Experience
                  </h2>
                  <div className="space-y-6">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full bg-gradient-to-br from-rose-500 to-orange-400"></div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">
                              {exp.role}
                            </h3>
                            <p className="text-sm font-medium text-rose-500">
                              {exp.company}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400">
                              {exp.startDate} - {exp.endDate || 'Present'}
                            </p>
                            {exp.description && (
                              <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Education & Languages */}
            <div>
              {data.education.length > 0 && (
                <section className="mb-8">
                  <h2 className="mb-4 border-b-2 border-rose-100 pb-2 text-sm font-bold uppercase tracking-widest text-rose-500">
                    Education
                  </h2>
                  <div className="space-y-6">
                    {data.education.map((edu, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-400"></div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">
                              {edu.degree}
                            </h3>
                            <p className="text-sm font-medium text-rose-500">
                              {edu.school}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400">
                              {edu.startDate} - {edu.endDate || 'Present'}
                            </p>
                            {edu.description && (
                              <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                                {edu.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {data.languages.length > 0 && (
                <section>
                  <h2 className="mb-4 border-b-2 border-rose-100 pb-2 text-sm font-bold uppercase tracking-widest text-rose-500">
                    Languages
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {data.languages.map((lang, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-gradient-to-r from-rose-50 to-orange-50 p-3 text-center"
                      >
                        <p className="font-semibold text-gray-900">
                          {lang.name}
                        </p>
                        <p className="text-xs text-rose-500">{lang.level}</p>
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
          .resume-page .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
        @media print {
          .resume-preview {
            margin: 0;
            padding: 0;
            background: white;
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
