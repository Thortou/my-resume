'use client';

import { useState, useCallback } from 'react';
import { Button, App } from 'antd';
import { EditOutlined, EyeOutlined, PrinterOutlined } from '@ant-design/icons';
import { ResumeForm } from './ResumeForm';
import { getTemplateById, getDefaultTemplate } from './templates';
import type { ResumeData } from '@/types/resume';
import type {
  CreateResumeInput,
  UpdateResumeInput,
} from '@/schemas/resume.schema';
import {
  createResumeAction,
  updateResumeAction,
} from '@/actions/resume.actions';
import { useRouter } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResumeFormData = Record<string, any>;

interface ResumeBuilderProps {
  initialData?: ResumeData;
  mode: 'create' | 'edit';
}

export function ResumeBuilder({ initialData, mode }: ResumeBuilderProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit');

  // Live preview data
  const [previewData, setPreviewData] = useState<ResumeData>(() => {
    if (initialData) return initialData;
    return {
      id: '',
      title: 'My Resume',
      slug: '',
      fullName: '',
      jobTitle: null,
      email: '',
      phone: null,
      address: null,
      website: null,
      linkedin: null,
      photoUrl: null,
      objective: null,
      skills: [],
      languages: [],
      experience: [],
      education: [],
      templateId: 'professional',
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  // Handle form changes for live preview
  const handleFormChange = useCallback((data: ResumeFormData) => {
    setPreviewData((prev) => ({
      ...prev,
      ...data,
      skills: data.skills || [],
      languages: data.languages || [],
      experience: data.experience || [],
      education: data.education || [],
    }));
  }, []);

  // Handle form submission
  const handleSubmit = async (data: ResumeFormData) => {
    setIsLoading(true);
    try {
      let result;
      if (mode === 'create') {
        result = await createResumeAction(data as CreateResumeInput);
      } else if (initialData) {
        result = await updateResumeAction(
          initialData.id,
          data as UpdateResumeInput
        );
      }

      if (result?.success) {
        message.success(result.message || 'Resume saved successfully');
        if (mode === 'create' && result.data) {
          router.push(`/resumes/${result.data.id}/edit`);
        }
      } else {
        message.error(result?.error || 'Failed to save resume');
      }
    } catch (error) {
      message.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Get template component
  const template =
    getTemplateById(previewData.templateId) || getDefaultTemplate();
  const TemplateComponent = template.component;

  return (
    <div className="resume-builder">
      {/* Mobile Toggle */}
      <div className="sticky top-0 z-10 flex gap-2 border-b bg-white p-3 md:hidden">
        <Button
          type={activeView === 'edit' ? 'primary' : 'default'}
          icon={<EditOutlined />}
          onClick={() => setActiveView('edit')}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          type={activeView === 'preview' ? 'primary' : 'default'}
          icon={<EyeOutlined />}
          onClick={() => setActiveView('preview')}
          className="flex-1"
        >
          Preview
        </Button>
        <Button
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          className="print:hidden"
        >
          Print
        </Button>
      </div>

      {/* Desktop Split View */}
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Form Panel */}
        <div
          className={`resume-form-panel p-4 md:h-screen md:w-1/2 md:overflow-y-auto md:border-r md:p-6 ${
            activeView !== 'edit' ? 'hidden md:block' : ''
          }`}
        >
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 hidden items-center justify-between md:flex">
              <h2 className="text-xl font-semibold">
                {mode === 'create' ? 'Create New Resume' : 'Edit Resume'}
              </h2>
              <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                Print Resume
              </Button>
            </div>
            <ResumeForm
              initialData={initialData}
              onSubmit={handleSubmit}
              onChange={handleFormChange}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div
          className={`resume-preview-panel bg-gray-100 p-4 md:h-screen md:w-1/2 md:overflow-y-auto ${
            activeView !== 'preview' ? 'hidden md:block' : ''
          }`}
        >
          <div className="sticky top-4">
            <div className="mb-4 hidden items-center justify-between md:flex">
              <h3 className="text-lg font-medium text-gray-700">
                Live Preview
              </h3>
              <span className="text-sm text-gray-500">
                Changes update automatically
              </span>
            </div>
            <div className="max-h-[calc(100vh-8rem)] overflow-auto md:max-h-[calc(100vh-6rem)]">
              <div
                className="origin-top-left scale-[0.6] transform md:scale-[0.55] lg:scale-[0.65] xl:scale-[0.75]"
                style={{ width: '167%' }}
              >
                <TemplateComponent data={previewData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .resume-preview,
          .resume-preview * {
            visibility: visible;
          }
          .resume-preview {
            position: absolute;
            left: 0;
            top: 0;
          }
          .resume-form-panel,
          .resume-preview-panel > div:first-child,
          nav,
          header,
          footer,
          .print\\:hidden {
            display: none !important;
          }
          .resume-preview-panel {
            width: 100% !important;
            padding: 0 !important;
            background: white !important;
          }
          .resume-preview-panel > div > div {
            transform: none !important;
            width: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
