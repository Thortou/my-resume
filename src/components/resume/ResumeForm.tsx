'use client';

import '@/lib/suppress-warnings';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Form,
  Input,
  Button,
  Alert,
  Switch,
  Collapse,
  Space,
  Divider,
  Upload,
  App,
  Tag,
} from 'antd';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  CrownOutlined,
  LockOutlined,
} from '@ant-design/icons';
import {
  createResumeSchema,
  updateResumeSchema,
  type CreateResumeInput,
} from '@/schemas/resume.schema';
import type {
  ResumeData,
  ExperienceEntry,
  EducationEntry,
  LanguageEntry,
} from '@/types/resume';
import { uploadImageAction } from '@/actions/upload.actions';
import { checkProTemplateAccessAction } from '@/actions/payment.actions';
import { CLOUDINARY_FOLDERS } from '@/constants';
import type { CloudinaryFolder } from '@/constants';
import Image from 'next/image';
import { RESUME_TEMPLATES } from './templates';
import { PaymentModal } from './PaymentModal';

const { TextArea } = Input;
const { Panel } = Collapse;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResumeFormData = Record<string, any>;

interface ResumeFormProps {
  initialData?: ResumeData;
  onSubmit: (data: ResumeFormData) => Promise<void>;
  onChange?: (data: ResumeFormData) => void;
  isLoading?: boolean;
}

type FormData = CreateResumeInput & {
  experience: ExperienceEntry[];
  education: EducationEntry[];
  languages: LanguageEntry[];
  skills: string[];
};

export function ResumeForm({
  initialData,
  onSubmit,
  onChange,
  isLoading = false,
}: ResumeFormProps) {
  const { message } = App.useApp();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [hasProAccess, setHasProAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const isEditMode = !!initialData;

  // Check if user has pro template access
  const checkProAccess = useCallback(async () => {
    setCheckingAccess(true);
    const result = await checkProTemplateAccessAction();
    if (result.success && result.data) {
      setHasProAccess(result.data.hasAccess);
    }
    setCheckingAccess(false);
  }, []);

  useEffect(() => {
    checkProAccess();
  }, [checkProAccess]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(isEditMode ? updateResumeSchema : createResumeSchema),
    defaultValues: {
      title: initialData?.title || 'My Resume',
      fullName: initialData?.fullName || '',
      jobTitle: initialData?.jobTitle || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      website: initialData?.website || '',
      linkedin: initialData?.linkedin || '',
      photoUrl: initialData?.photoUrl || '',
      objective: initialData?.objective || '',
      skills: initialData?.skills || [],
      languages: initialData?.languages || [],
      experience: initialData?.experience || [],
      education: initialData?.education || [],
      templateId: initialData?.templateId || 'professional',
      isPublic: initialData?.isPublic || false,
    },
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control, name: 'experience' });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: 'education' });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({ control, name: 'languages' });

  // Watch form values for live preview
  const formValues = watch();
  const prevFormValuesRef = useRef<string>('');

  // Notify parent of changes for live preview
  useEffect(() => {
    if (onChange) {
      const serialized = JSON.stringify(formValues);
      if (serialized !== prevFormValuesRef.current) {
        prevFormValuesRef.current = serialized;
        onChange(formValues);
      }
    }
  }, [formValues, onChange]);

  const handleFormSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      await onSubmit(data);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        const result = await uploadImageAction(
          base64,
          CLOUDINARY_FOLDERS.RESUMES as CloudinaryFolder
        );
        if (result.success && result.data) {
          setValue('photoUrl', result.data.secureUrl);
          message.success('Photo uploaded successfully');
        } else {
          message.error(result.error || 'Upload failed');
        }
        setUploading(false);
      };
      reader.onerror = () => {
        message.error('Failed to read file');
        setUploading(false);
      };
    } catch {
      message.error('Upload failed');
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = formValues.skills || [];
      if (!currentSkills.includes(skillInput.trim())) {
        setValue('skills', [...currentSkills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = formValues.skills || [];
    setValue(
      'skills',
      currentSkills.filter((_, i) => i !== index)
    );
  };

  const photoUrl = watch('photoUrl');

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(handleFormSubmit)}
      className="resume-form space-y-4"
    >
      {submitError && (
        <Alert
          message={submitError}
          type="error"
          showIcon
          closable
          onClose={() => setSubmitError(null)}
          className="mb-4"
        />
      )}

      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore - Using deprecated Panel API to avoid array nesting issues */}
      <Collapse
        defaultActiveKey={[
          'template',
          'personal',
          'objective',
          'skills',
          'experience',
          'education',
          'languages',
        ]}
      >
        <Panel header="Choose Template" key="template">
          <Controller
            name="templateId"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {RESUME_TEMPLATES.map((template) => {
                  const isPro = template.isPro;
                  const isLocked = isPro && !hasProAccess;
                  const isSelected = field.value === template.id;

                  const handleClick = () => {
                    if (isLocked) {
                      setPaymentModalOpen(true);
                    } else {
                      field.onChange(template.id);
                    }
                  };

                  return (
                    <div
                      key={template.id}
                      onClick={handleClick}
                      className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-md ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : isLocked
                            ? 'border-amber-300 bg-amber-50 hover:border-amber-400'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Pro Badge */}
                      {isPro && (
                        <div className="absolute -right-1 -top-1 z-10">
                          <Tag
                            color="gold"
                            className="flex items-center gap-1 px-1.5 py-0 text-[10px] font-bold"
                          >
                            <CrownOutlined />
                            PRO
                          </Tag>
                        </div>
                      )}

                      {/* Lock Overlay */}
                      {isLocked && (
                        <div className="absolute inset-0 z-[5] flex items-center justify-center rounded-lg bg-black/10">
                          <div className="rounded-full bg-white p-2 shadow-lg">
                            <LockOutlined className="text-lg text-amber-500" />
                          </div>
                        </div>
                      )}

                      <div className="mb-2 flex aspect-[3/4] items-center justify-center overflow-hidden rounded bg-gray-100 text-xs text-gray-400">
                        {template.id === 'professional' && (
                          <div className="flex h-full w-full bg-gradient-to-r from-slate-600 to-slate-700">
                            <div className="w-1/3 bg-slate-700"></div>
                            <div className="flex-1 bg-white p-1">
                              <div className="mb-1 h-2 w-full bg-slate-200"></div>
                              <div className="h-1 w-3/4 bg-slate-100"></div>
                            </div>
                          </div>
                        )}
                        {template.id === 'modern' && (
                          <div className="flex h-full w-full flex-col">
                            <div className="h-1/4 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                            <div className="flex-1 bg-white p-1">
                              <div className="mb-1 h-1 w-full bg-indigo-100"></div>
                              <div className="h-1 w-2/3 bg-gray-100"></div>
                            </div>
                          </div>
                        )}
                        {template.id === 'creative' && (
                          <div className="flex h-full w-full flex-col">
                            <div className="relative h-1/3 bg-gradient-to-br from-rose-500 to-orange-400">
                              <div className="absolute bottom-0 left-1/2 h-6 w-6 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-rose-200 bg-white"></div>
                            </div>
                            <div className="flex-1 bg-white p-1 pt-4">
                              <div className="mx-auto mb-1 h-1 w-2/3 bg-rose-100"></div>
                              <div className="mx-auto h-1 w-1/2 bg-gray-100"></div>
                            </div>
                          </div>
                        )}
                        {template.id === 'minimal' && (
                          <div className="flex h-full w-full flex-col bg-white p-2">
                            <div className="mb-1 h-2 w-3/4 bg-gray-200"></div>
                            <div className="mb-2 h-1 w-1/2 bg-gray-100"></div>
                            <div className="border-t border-gray-200 pt-1">
                              <div className="mb-1 h-1 w-full bg-gray-50"></div>
                              <div className="h-1 w-2/3 bg-gray-50"></div>
                            </div>
                          </div>
                        )}
                        {template.id === 'ats-friendly' && (
                          <div className="flex h-full w-full flex-col items-center bg-white p-2">
                            <div className="mb-1 h-2 w-3/4 bg-gray-800"></div>
                            <div className="mb-1 h-1 w-1/2 bg-gray-400"></div>
                            <div className="mt-1 w-full border-t border-gray-300 pt-1">
                              <div className="mb-1 h-1 w-full bg-gray-200"></div>
                              <div className="h-1 w-full bg-gray-100"></div>
                            </div>
                          </div>
                        )}
                        {template.id === 'pro' && (
                          <div className="flex h-full w-full flex-col">
                            <div className="h-1/4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>
                            <div className="flex flex-1">
                              <div className="flex-1 bg-white p-1">
                                <div className="mb-1 h-1 w-full bg-indigo-100"></div>
                                <div className="h-1 w-2/3 bg-gray-100"></div>
                              </div>
                              <div className="w-1/4 bg-gray-50"></div>
                            </div>
                          </div>
                        )}
                        {template.id === 'executive-pro' && (
                          <div className="flex h-full w-full">
                            <div className="w-[32%] bg-[#E5E5E5] p-1">
                              <div className="mx-auto mb-1 aspect-square w-3/4 bg-[#071B2A]"></div>
                              <div className="mb-0.5 h-0.5 w-full bg-gray-400"></div>
                              <div className="h-0.5 w-2/3 bg-gray-300"></div>
                            </div>
                            <div className="flex w-[68%] flex-col">
                              <div className="h-1/5 bg-[#071B2A]"></div>
                              <div className="flex-1 bg-white p-1">
                                <div className="mb-0.5 h-0.5 w-full bg-gray-200"></div>
                                <div className="h-0.5 w-2/3 bg-gray-100"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-sm font-medium ${
                            isSelected
                              ? 'text-blue-600'
                              : isPro
                                ? 'text-amber-700'
                                : 'text-gray-700'
                          }`}
                        >
                          {template.name}
                        </p>
                        {isPro && (
                          <p className="text-[10px] text-amber-600">
                            {hasProAccess ? 'ປົດລັອກແລ້ວ' : template.price}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          />

          {/* Payment Modal */}
          <PaymentModal
            open={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
            onSuccess={() => {
              setHasProAccess(true);
              setPaymentModalOpen(false);
              message.success(
                'ຊື້ Pro Template ສຳເລັດ! ທ່ານສາມາດໃຊ້ Pro Template ໄດ້ແລ້ວ'
              );
            }}
            templateName="Pro Template"
          />
        </Panel>

        <Panel header="Personal Information" key="personal">
          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item
              label="Resume Title"
              validateStatus={errors.title ? 'error' : undefined}
              help={errors.title?.message}
            >
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="My Resume" maxLength={200} />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Make Public"
              validateStatus={errors.isPublic ? 'error' : undefined}
              help={errors.isPublic?.message}
            >
              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    checkedChildren="Public"
                    unCheckedChildren="Private"
                  />
                )}
              />
            </Form.Item>
          </div>

          <Form.Item label="Photo">
            <div className="flex items-center gap-4">
              {photoUrl && (
                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200">
                  <Image
                    src={photoUrl}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <Upload
                showUploadList={false}
                beforeUpload={handlePhotoUpload}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  {photoUrl ? 'Change Photo' : 'Upload Photo'}
                </Button>
              </Upload>
              {photoUrl && (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setValue('photoUrl', '')}
                >
                  Remove
                </Button>
              )}
            </div>
          </Form.Item>

          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item
              label="Full Name"
              validateStatus={errors.fullName ? 'error' : undefined}
              help={errors.fullName?.message}
              required
            >
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<UserOutlined />}
                    placeholder="John Doe"
                    maxLength={100}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Job Title"
              validateStatus={errors.jobTitle ? 'error' : undefined}
              help={errors.jobTitle?.message}
            >
              <Controller
                name="jobTitle"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder="Software Engineer"
                    maxLength={100}
                  />
                )}
              />
            </Form.Item>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item
              label="Email"
              validateStatus={errors.email ? 'error' : undefined}
              help={errors.email?.message}
              required
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<MailOutlined />}
                    type="email"
                    placeholder="john@example.com"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Phone"
              validateStatus={errors.phone ? 'error' : undefined}
              help={errors.phone?.message}
            >
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    prefix={<PhoneOutlined />}
                    placeholder="+1 234 567 890"
                    maxLength={20}
                  />
                )}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Address"
            validateStatus={errors.address ? 'error' : undefined}
            help={errors.address?.message}
          >
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  prefix={<EnvironmentOutlined />}
                  placeholder="City, Country"
                  maxLength={200}
                />
              )}
            />
          </Form.Item>

          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item
              label="Website"
              validateStatus={errors.website ? 'error' : undefined}
              help={errors.website?.message}
            >
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    prefix={<GlobalOutlined />}
                    placeholder="https://yourwebsite.com"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="LinkedIn"
              validateStatus={errors.linkedin ? 'error' : undefined}
              help={errors.linkedin?.message}
            >
              <Controller
                name="linkedin"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    prefix={<LinkedinOutlined />}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                )}
              />
            </Form.Item>
          </div>
        </Panel>

        <Panel header="Career Objective" key="objective">
          <Form.Item
            validateStatus={errors.objective ? 'error' : undefined}
            help={errors.objective?.message}
          >
            <Controller
              name="objective"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  value={field.value || ''}
                  placeholder="A brief summary of your career goals and what you bring to the table..."
                  rows={4}
                  maxLength={1000}
                  showCount
                />
              )}
            />
          </Form.Item>
        </Panel>

        <Panel header="Skills" key="skills">
          <div className="mb-3 flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add a skill"
              onPressEnter={(e) => {
                e.preventDefault();
                addSkill();
              }}
            />
            <Button icon={<PlusOutlined />} onClick={addSkill}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formValues.skills || []).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
              >
                {skill}
                <DeleteOutlined
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => removeSkill(index)}
                />
              </span>
            ))}
          </div>
        </Panel>

        <Panel header="Work Experience" key="experience">
          {experienceFields.map((field, index) => (
            <div
              key={field.id}
              className="mb-4 rounded-lg border bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <h4 className="font-medium">Experience {index + 1}</h4>
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => removeExperience(index)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Form.Item label="Company" required>
                  <Controller
                    name={`experience.${index}.company`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Company Name" />
                    )}
                  />
                </Form.Item>
                <Form.Item label="Role" required>
                  <Controller
                    name={`experience.${index}.role`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Job Title" />
                    )}
                  />
                </Form.Item>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Form.Item label="Start Date" required>
                  <Controller
                    name={`experience.${index}.startDate`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Jan 2020" />
                    )}
                  />
                </Form.Item>
                <Form.Item label="End Date">
                  <Controller
                    name={`experience.${index}.endDate`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="Present"
                      />
                    )}
                  />
                </Form.Item>
              </div>
              <Form.Item label="Description">
                <Controller
                  name={`experience.${index}.description`}
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      value={field.value || ''}
                      placeholder="Key responsibilities and achievements..."
                      rows={3}
                    />
                  )}
                />
              </Form.Item>
            </div>
          ))}
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() =>
              appendExperience({
                company: '',
                role: '',
                startDate: '',
                endDate: '',
                description: '',
              })
            }
          >
            Add Experience
          </Button>
        </Panel>

        <Panel header="Education" key="education">
          {educationFields.map((field, index) => (
            <div
              key={field.id}
              className="mb-4 rounded-lg border bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <h4 className="font-medium">Education {index + 1}</h4>
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => removeEducation(index)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Form.Item label="School/University" required>
                  <Controller
                    name={`education.${index}.school`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="University Name" />
                    )}
                  />
                </Form.Item>
                <Form.Item label="Degree" required>
                  <Controller
                    name={`education.${index}.degree`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Bachelor of Science in Computer Science"
                      />
                    )}
                  />
                </Form.Item>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Form.Item label="Start Date" required>
                  <Controller
                    name={`education.${index}.startDate`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Sep 2016" />
                    )}
                  />
                </Form.Item>
                <Form.Item label="End Date">
                  <Controller
                    name={`education.${index}.endDate`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="Jun 2020"
                      />
                    )}
                  />
                </Form.Item>
              </div>
              <Form.Item label="Description">
                <Controller
                  name={`education.${index}.description`}
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      value={field.value || ''}
                      placeholder="Achievements, GPA, etc..."
                      rows={2}
                    />
                  )}
                />
              </Form.Item>
            </div>
          ))}
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() =>
              appendEducation({
                school: '',
                degree: '',
                startDate: '',
                endDate: '',
                description: '',
              })
            }
          >
            Add Education
          </Button>
        </Panel>

        <Panel header="Languages" key="languages">
          {languageFields.map((field, index) => (
            <div key={field.id} className="mb-2 flex items-center gap-2">
              <Controller
                name={`languages.${index}.name`}
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Language" className="flex-1" />
                )}
              />
              <Controller
                name={`languages.${index}.level`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Level (e.g., Fluent)"
                    className="flex-1"
                  />
                )}
              />
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeLanguage(index)}
              />
            </div>
          ))}
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() => appendLanguage({ name: '', level: '' })}
          >
            Add Language
          </Button>
        </Panel>
      </Collapse>

      <Divider />

      <Form.Item className="sticky bottom-0 -mx-4 mb-0 border-t bg-white px-4 py-4 md:relative md:mx-0 md:border-0 md:px-0">
        <Space className="w-full justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            icon={<SaveOutlined />}
            size="large"
          >
            {isEditMode ? 'Save Changes' : 'Create Resume'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
