'use client';

import { Button } from 'antd';
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ResumeData } from '@/types/resume';
import {
  getTemplateById,
  getDefaultTemplate,
} from '@/components/resume/templates';

interface PublicResumeViewProps {
  resumeData: ResumeData;
}

export function PublicResumeView({ resumeData }: PublicResumeViewProps) {
  const template =
    getTemplateById(resumeData.templateId) || getDefaultTemplate();
  const TemplateComponent = template.component;

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
      {/* Action Bar - Hidden when printing */}
      <div className="mx-auto mb-6 max-w-4xl px-4 print:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {resumeData.fullName}
            </h1>
            {resumeData.jobTitle && (
              <p className="text-gray-600">{resumeData.jobTitle}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              Print
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => window.print()}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="flex justify-center print:block">
        <TemplateComponent data={resumeData} />
      </div>
    </div>
  );
}
