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

export function ProTemplate({ data, className = '' }: ResumeTemplateProps) {
  return (
    <div className={`resume-preview bg-white text-gray-900 ${className}`}>
      {/* A4 Paper - Modern Pro Layout */}
      <div className="resume-page mx-auto min-h-[297mm] w-[210mm] shadow-lg print:shadow-none">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-8 py-8 text-white">
          <div className="flex items-center gap-6">
            {/* Photo */}
            {data.photoUrl && (
              <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white/30 shadow-xl">
                <Image
                  src={data.photoUrl}
                  alt={data.fullName}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Name & Title */}
            <div className="flex-1">
              <h1 className="mb-1 text-4xl font-bold tracking-tight">
                {data.fullName}
              </h1>
              {data.jobTitle && (
                <p className="text-xl font-light text-white/90">
                  {data.jobTitle}
                </p>
              )}

              {/* Contact Info - Horizontal */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/80">
                {data.email && (
                  <div className="flex items-center gap-1.5">
                    <MailOutlined className="text-white/60" />
                    <span>{data.email}</span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-center gap-1.5">
                    <PhoneOutlined className="text-white/60" />
                    <span>{data.phone}</span>
                  </div>
                )}
                {data.address && (
                  <div className="flex items-center gap-1.5">
                    <EnvironmentOutlined className="text-white/60" />
                    <span>{data.address}</span>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-white/80">
                {data.website && (
                  <div className="flex items-center gap-1.5">
                    <GlobalOutlined className="text-white/60" />
                    <a
                      href={data.website}
                      className="hover:text-white hover:underline"
                    >
                      {data.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {data.linkedin && (
                  <div className="flex items-center gap-1.5">
                    <LinkedinOutlined className="text-white/60" />
                    <a
                      href={data.linkedin}
                      className="hover:text-white hover:underline"
                    >
                      {data.linkedin.replace(
                        /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                        ''
                      )}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Left Column - Main Content */}
          <div className="flex-1 p-8">
            {/* Objective / Professional Summary */}
            {data.objective && (
              <div className="mb-6">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-indigo-600">
                  <span className="h-1 w-8 rounded bg-gradient-to-r from-indigo-600 to-purple-600"></span>
                  ສະຫຼຸບ
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                  {data.objective}
                </p>
              </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-indigo-600">
                  <span className="h-1 w-8 rounded bg-gradient-to-r from-indigo-600 to-purple-600"></span>
                  ປະສົບການເຮັດວຽກ
                </h2>
                <div className="space-y-5">
                  {data.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="relative border-l-2 border-indigo-200 pl-4"
                    >
                      <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-indigo-500"></div>
                      <div className="mb-1">
                        <h3 className="text-base font-semibold text-gray-800">
                          {exp.role}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-600">
                            {exp.company}
                          </p>
                          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
                            {exp.startDate} - {exp.endDate || 'ປັດຈຸບັນ'}
                          </span>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-indigo-600">
                  <span className="h-1 w-8 rounded bg-gradient-to-r from-indigo-600 to-purple-600"></span>
                  ການສຶກສາ
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div
                      key={index}
                      className="relative border-l-2 border-purple-200 pl-4"
                    >
                      <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-purple-500"></div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {edu.degree}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-purple-600">
                          {edu.school}
                        </p>
                        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600">
                          {edu.startDate} - {edu.endDate || 'ປັດຈຸບັນ'}
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
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-[180px] bg-gray-50 p-6">
            {/* Skills */}
            {data.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-indigo-600">
                  ທັກສະ
                </h3>
                <div className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="group">
                      <div className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-indigo-50 hover:text-indigo-700">
                        {skill}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-purple-600">
                  ພາສາ
                </h3>
                <div className="space-y-2">
                  {data.languages.map((lang, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-white px-3 py-2 shadow-sm"
                    >
                      <div className="text-xs font-medium text-gray-800">
                        {lang.name}
                      </div>
                      <div className="text-[10px] text-purple-500">
                        {lang.level}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-8 py-2 text-center text-xs text-white/70">
          Pro Template • Generated with Resume Builder
        </div>
      </div>

      {/* Responsive & Print Styles */}
      <style jsx>{`
        @media screen and (max-width: 767px) {
          .resume-page {
            width: 100%;
            min-height: auto;
          }
          .resume-page > div:nth-child(2) {
            flex-direction: column;
          }
          .resume-page > div:nth-child(2) > div:last-child {
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
