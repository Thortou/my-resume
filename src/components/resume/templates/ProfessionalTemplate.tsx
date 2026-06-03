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

export function ProfessionalTemplate({
  data,
  className = '',
}: ResumeTemplateProps) {
  return (
    <div className={`resume-preview bg-white text-gray-900 ${className}`}>
      {/* A4 Paper - Two Column Layout */}
      <div className="resume-page mx-auto min-h-[297mm] w-[210mm] shadow-lg print:shadow-none">
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="flex w-[70mm] flex-col bg-slate-700 p-6 text-white print:bg-slate-700">
            {/* Photo */}
            {data.photoUrl && (
              <div className="mb-6 flex justify-center">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/20">
                  <Image
                    src={data.photoUrl}
                    alt={data.fullName}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="mb-6">
              <h3 className="mb-3 border-b border-slate-500 pb-1 text-sm font-semibold uppercase tracking-wider text-slate-300">
                ຂໍ້ມູນຕິດຕໍ່
              </h3>
              <div className="space-y-2 text-sm">
                {data.email && (
                  <div className="flex items-start gap-2">
                    <MailOutlined className="mt-1 text-slate-400" />
                    <span className="break-all">{data.email}</span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-start gap-2">
                    <PhoneOutlined className="mt-1 text-slate-400" />
                    <span>{data.phone}</span>
                  </div>
                )}
                {data.address && (
                  <div className="flex items-start gap-2">
                    <EnvironmentOutlined className="mt-1 text-slate-400" />
                    <span>{data.address}</span>
                  </div>
                )}
                {data.website && (
                  <div className="flex items-start gap-2">
                    <GlobalOutlined className="mt-1 text-slate-400" />
                    <a
                      href={data.website}
                      className="break-all text-slate-200 hover:text-white"
                    >
                      {data.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {data.linkedin && (
                  <div className="flex items-start gap-2">
                    <LinkedinOutlined className="mt-1 text-slate-400" />
                    <a
                      href={data.linkedin}
                      className="break-all text-slate-200 hover:text-white"
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

            {/* Skills Section */}
            {data.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 border-b border-slate-500 pb-1 text-sm font-semibold uppercase tracking-wider text-slate-300">
                  ທັກສະ
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded bg-slate-600 px-2 py-0.5 text-xs text-slate-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Section */}
            {data.languages.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 border-b border-slate-500 pb-1 text-sm font-semibold uppercase tracking-wider text-slate-300">
                  ພາສາ
                </h3>
                <div className="space-y-2 text-sm">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{lang.name}</span>
                      <span className="text-slate-400">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Content */}
          <div className="flex-1 p-8">
            {/* Header */}
            <div className="mb-6 border-b-2 border-slate-200 pb-4">
              <h1 className="mb-1 text-3xl font-bold text-slate-800">
                {data.fullName}
              </h1>
              {data.jobTitle && (
                <p className="text-lg text-slate-600">{data.jobTitle}</p>
              )}
            </div>

            {/* Objective */}
            {data.objective && (
              <div className="resume-section mb-6">
                <h2 className="mb-2 border-b border-slate-200 pb-1 text-base font-semibold uppercase tracking-wider text-slate-700">
                  ຈຸດປະສົງ
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {data.objective}
                </p>
              </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
              <div className="resume-section mb-6">
                <h2 className="mb-3 border-b border-slate-200 pb-1 text-base font-semibold uppercase tracking-wider text-slate-700">
                  ປະສົບການ
                </h2>
                <div className="space-y-4">
                  {data.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="mb-1 flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {exp.role}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {exp.company}
                          </p>
                        </div>
                        <span className="whitespace-nowrap text-xs text-slate-500">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
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
              <div className="resume-section mb-6">
                <h2 className="mb-3 border-b border-slate-200 pb-1 text-base font-semibold uppercase tracking-wider text-slate-700">
                  ການສຶກສາ
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <div className="mb-1 flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {edu.degree}
                          </h3>
                          <p className="text-sm text-slate-600">{edu.school}</p>
                        </div>
                        <span className="whitespace-nowrap text-xs text-slate-500">
                          {edu.startDate} - {edu.endDate || 'Present'}
                        </span>
                      </div>
                      {edu.description && (
                        <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout - Stacked */}
      <style jsx>{`
        @media screen and (max-width: 767px) {
          .resume-page {
            width: 100%;
            min-height: auto;
          }
          .resume-page > div {
            flex-direction: column;
          }
          .resume-page > div > div:first-child {
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
