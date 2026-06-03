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

// Color palette
const colors = {
  darkNavy: '#071B2A',
  lightGray: '#E5E5E5',
  white: '#FFFFFF',
  darkText: '#111827',
  mutedText: '#6B7280',
  border: '#D1D5DB',
};

// Language proficiency to percentage mapping
const proficiencyToPercent = (level: string): number => {
  const lower = level.toLowerCase();
  if (lower.includes('native') || lower.includes('ພາສາແມ່')) return 100;
  if (lower.includes('fluent') || lower.includes('ຄ່ອງແຄ້ວ')) return 90;
  if (lower.includes('advanced') || lower.includes('ສູງ')) return 80;
  if (lower.includes('intermediate') || lower.includes('ກາງ')) return 60;
  if (lower.includes('basic') || lower.includes('ພື້ນຖານ')) return 40;
  if (lower.includes('beginner') || lower.includes('ເລີ່ມຕົ້ນ')) return 25;
  return 50;
};

export function ExecutiveProTemplate({
  data,
  className = '',
}: ResumeTemplateProps) {
  return (
    <div className={`resume-preview bg-white text-gray-900 ${className}`}>
      {/* A4 Paper - Two Column Layout */}
      <div
        className="resume-page mx-auto min-h-[297mm] w-[210mm] shadow-lg print:shadow-none"
        style={{ fontFamily: "'Inter', 'Noto Sans Lao', sans-serif" }}
      >
        <div className="flex h-full">
          {/* Left Sidebar - 32% */}
          <div
            className="flex w-[32%] flex-col"
            style={{ backgroundColor: colors.lightGray }}
          >
            {/* Profile Photo */}
            <div className="px-5 pt-6">
              {data.photoUrl ? (
                <div
                  className="mx-auto aspect-square w-full max-w-[140px] overflow-hidden border-4"
                  style={{ borderColor: colors.darkNavy }}
                >
                  <Image
                    src={data.photoUrl}
                    alt={data.fullName}
                    width={140}
                    height={140}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="mx-auto flex aspect-square w-full max-w-[140px] items-center justify-center border-4 bg-gray-300"
                  style={{ borderColor: colors.darkNavy }}
                >
                  <span className="text-4xl text-gray-500">
                    {data.fullName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Name & Role (Mobile visible, Desktop in header) */}
            <div className="mt-4 px-5 text-center md:hidden">
              <h2
                className="text-lg font-bold"
                style={{ color: colors.darkNavy }}
              >
                {data.fullName}
              </h2>
              {data.jobTitle && (
                <p className="text-sm" style={{ color: colors.mutedText }}>
                  {data.jobTitle}
                </p>
              )}
            </div>

            {/* Contact Section */}
            <div className="mt-6 px-5">
              <h3
                className="mb-3 border-b pb-2 text-xs font-bold uppercase tracking-wider"
                style={{
                  color: colors.darkNavy,
                  borderColor: colors.border,
                }}
              >
                ຂໍ້ມູນຕິດຕໍ່
              </h3>
              <div className="space-y-2.5">
                {data.email && (
                  <div className="flex items-start gap-2.5">
                    <MailOutlined
                      className="mt-0.5 text-sm"
                      style={{ color: colors.darkNavy }}
                    />
                    <span
                      className="break-all text-xs leading-tight"
                      style={{ color: colors.darkText }}
                    >
                      {data.email}
                    </span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-start gap-2.5">
                    <PhoneOutlined
                      className="mt-0.5 text-sm"
                      style={{ color: colors.darkNavy }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: colors.darkText }}
                    >
                      {data.phone}
                    </span>
                  </div>
                )}
                {data.address && (
                  <div className="flex items-start gap-2.5">
                    <EnvironmentOutlined
                      className="mt-0.5 text-sm"
                      style={{ color: colors.darkNavy }}
                    />
                    <span
                      className="text-xs leading-tight"
                      style={{ color: colors.darkText }}
                    >
                      {data.address}
                    </span>
                  </div>
                )}
                {data.website && (
                  <div className="flex items-start gap-2.5">
                    <GlobalOutlined
                      className="mt-0.5 text-sm"
                      style={{ color: colors.darkNavy }}
                    />
                    <a
                      href={data.website}
                      className="break-all text-xs leading-tight hover:underline"
                      style={{ color: colors.darkText }}
                    >
                      {data.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {data.linkedin && (
                  <div className="flex items-start gap-2.5">
                    <LinkedinOutlined
                      className="mt-0.5 text-sm"
                      style={{ color: colors.darkNavy }}
                    />
                    <a
                      href={data.linkedin}
                      className="break-all text-xs leading-tight hover:underline"
                      style={{ color: colors.darkText }}
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
              <div className="mt-6 px-5">
                <h3
                  className="mb-3 border-b pb-2 text-xs font-bold uppercase tracking-wider"
                  style={{
                    color: colors.darkNavy,
                    borderColor: colors.border,
                  }}
                >
                  ທັກສະ
                </h3>
                <ul className="space-y-1.5">
                  {data.skills.map((skill, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: colors.darkText }}
                    >
                      <span
                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: colors.darkNavy }}
                      ></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages Section with Progress Bars */}
            {data.languages.length > 0 && (
              <div className="mt-6 px-5 pb-6">
                <h3
                  className="mb-3 border-b pb-2 text-xs font-bold uppercase tracking-wider"
                  style={{
                    color: colors.darkNavy,
                    borderColor: colors.border,
                  }}
                >
                  ພາສາ
                </h3>
                <div className="space-y-3">
                  {data.languages.map((lang, index) => {
                    const percent = proficiencyToPercent(lang.level);
                    return (
                      <div key={index}>
                        <div className="mb-1 flex items-center justify-between">
                          <span
                            className="text-xs font-medium"
                            style={{ color: colors.darkText }}
                          >
                            {lang.name}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: colors.mutedText }}
                          >
                            {lang.level}
                          </span>
                        </div>
                        <div
                          className="h-1.5 w-full overflow-hidden rounded-full"
                          style={{ backgroundColor: colors.border }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: colors.darkNavy,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Content - 68% */}
          <div className="flex w-[68%] flex-col">
            {/* Header with Dark Navy Background */}
            <div
              className="px-6 py-5"
              style={{ backgroundColor: colors.darkNavy }}
            >
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {data.fullName}
              </h1>
              {data.jobTitle && (
                <p className="mt-1 text-sm font-light text-gray-300">
                  {data.jobTitle}
                </p>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 px-6 py-5">
              {/* Summary / Objective */}
              {data.objective && (
                <section className="mb-5">
                  <h2
                    className="mb-2 border-b pb-1.5 text-xs font-bold uppercase tracking-wider"
                    style={{
                      color: colors.darkNavy,
                      borderColor: colors.border,
                    }}
                  >
                    ສະຫຼຸບ
                  </h2>
                  <p
                    className="whitespace-pre-line text-xs leading-relaxed"
                    style={{ color: colors.mutedText }}
                  >
                    {data.objective}
                  </p>
                </section>
              )}

              {/* Experience */}
              {data.experience.length > 0 && (
                <section className="mb-5">
                  <h2
                    className="mb-3 border-b pb-1.5 text-xs font-bold uppercase tracking-wider"
                    style={{
                      color: colors.darkNavy,
                      borderColor: colors.border,
                    }}
                  >
                    ປະສົບການເຮັດວຽກ
                  </h2>
                  <div className="space-y-4">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="relative pl-4">
                        {/* Timeline dot and line */}
                        <div
                          className="absolute left-0 top-1.5 h-2 w-2 rounded-full"
                          style={{ backgroundColor: colors.darkNavy }}
                        ></div>
                        {index < data.experience.length - 1 && (
                          <div
                            className="absolute left-[3px] top-4 h-[calc(100%+8px)] w-0.5"
                            style={{ backgroundColor: colors.border }}
                          ></div>
                        )}

                        <div>
                          <div className="flex flex-wrap items-baseline justify-between gap-1">
                            <h3
                              className="text-sm font-semibold"
                              style={{ color: colors.darkText }}
                            >
                              {exp.role}
                            </h3>
                            <span
                              className="text-[10px]"
                              style={{ color: colors.mutedText }}
                            >
                              {exp.startDate} - {exp.endDate || 'ປັດຈຸບັນ'}
                            </span>
                          </div>
                          <p
                            className="text-xs font-medium"
                            style={{ color: colors.mutedText }}
                          >
                            {exp.company}
                          </p>
                          {exp.description && (
                            <p
                              className="mt-1.5 whitespace-pre-line text-xs leading-relaxed"
                              style={{ color: colors.mutedText }}
                            >
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
                <section className="mb-5">
                  <h2
                    className="mb-3 border-b pb-1.5 text-xs font-bold uppercase tracking-wider"
                    style={{
                      color: colors.darkNavy,
                      borderColor: colors.border,
                    }}
                  >
                    ການສຶກສາ
                  </h2>
                  <div className="space-y-3">
                    {data.education.map((edu, index) => (
                      <div key={index} className="relative pl-4">
                        {/* Timeline dot */}
                        <div
                          className="absolute left-0 top-1.5 h-2 w-2 rounded-full"
                          style={{ backgroundColor: colors.darkNavy }}
                        ></div>
                        {index < data.education.length - 1 && (
                          <div
                            className="absolute left-[3px] top-4 h-[calc(100%+4px)] w-0.5"
                            style={{ backgroundColor: colors.border }}
                          ></div>
                        )}

                        <div>
                          <div className="flex flex-wrap items-baseline justify-between gap-1">
                            <h3
                              className="text-sm font-semibold"
                              style={{ color: colors.darkText }}
                            >
                              {edu.degree}
                            </h3>
                            <span
                              className="text-[10px]"
                              style={{ color: colors.mutedText }}
                            >
                              {edu.startDate} - {edu.endDate || 'ປັດຈຸບັນ'}
                            </span>
                          </div>
                          <p
                            className="text-xs font-medium"
                            style={{ color: colors.mutedText }}
                          >
                            {edu.school}
                          </p>
                          {edu.description && (
                            <p
                              className="mt-1 whitespace-pre-line text-xs leading-relaxed"
                              style={{ color: colors.mutedText }}
                            >
                              {edu.description}
                            </p>
                          )}
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
          .resume-page > div {
            flex-direction: column;
          }
          .resume-page > div > div {
            width: 100% !important;
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
