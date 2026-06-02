'use client';

import { useState } from 'react';
import { Card, Button, Empty, Modal, message, Tag, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  CopyOutlined,
  GlobalOutlined,
  LockOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import type { ResumeData } from '@/types/resume';
import { deleteResumeAction } from '@/actions/resume.actions';
import { format } from 'date-fns';

interface ResumeListProps {
  resumes: ResumeData[];
}

export function ResumeList({ resumes: initialResumes }: ResumeListProps) {
  const [resumes, setResumes] = useState(initialResumes);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      const result = await deleteResumeAction(deletingId);
      if (result.success) {
        message.success('Resume deleted successfully');
        setResumes(resumes.filter((r) => r.id !== deletingId));
      } else {
        message.error(result.error || 'Failed to delete resume');
      }
    } catch {
      message.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const copyPublicLink = (slug: string) => {
    const url = `${window.location.origin}/r/${slug}`;
    navigator.clipboard.writeText(url);
    message.success('Public link copied to clipboard');
  };

  if (resumes.length === 0) {
    return (
      <Empty description="You don't have any resumes yet" className="py-12">
        <Link href="/resumes/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Create Your First Resume
          </Button>
        </Link>
      </Empty>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => (
          <Card
            key={resume.id}
            hoverable
            className="relative"
            actions={[
              <Tooltip key="edit" title="Edit">
                <Link href={`/resumes/${resume.id}/edit`}>
                  <Button type="text" icon={<EditOutlined />} />
                </Link>
              </Tooltip>,
              <Tooltip
                key="view"
                title={resume.isPublic ? 'View Public Page' : 'Preview'}
              >
                {resume.isPublic ? (
                  <Link href={`/r/${resume.slug}`} target="_blank">
                    <Button type="text" icon={<EyeOutlined />} />
                  </Link>
                ) : (
                  <Link href={`/resumes/${resume.id}/edit`}>
                    <Button type="text" icon={<EyeOutlined />} />
                  </Link>
                )}
              </Tooltip>,
              <Tooltip key="copy" title="Copy Public Link">
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => copyPublicLink(resume.slug)}
                  disabled={!resume.isPublic}
                />
              </Tooltip>,
              <Tooltip key="delete" title="Delete">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteClick(resume.id)}
                />
              </Tooltip>,
            ]}
          >
            <Card.Meta
              title={
                <div className="flex items-center gap-2">
                  <span className="truncate">{resume.title}</span>
                  {resume.isPublic ? (
                    <Tag color="green" icon={<GlobalOutlined />}>
                      Public
                    </Tag>
                  ) : (
                    <Tag icon={<LockOutlined />}>Private</Tag>
                  )}
                </div>
              }
              description={
                <div className="space-y-1">
                  <p className="font-medium text-gray-600">{resume.fullName}</p>
                  {resume.jobTitle && (
                    <p className="text-sm text-gray-500">{resume.jobTitle}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Updated {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
                  </p>
                </div>
              }
            />
          </Card>
        ))}

        {/* Add New Card */}
        <Link href="/resumes/new">
          <Card
            hoverable
            className="flex h-full min-h-[180px] items-center justify-center border-dashed"
          >
            <div className="text-center text-gray-400">
              <PlusOutlined className="mb-2 text-4xl" />
              <p>Create New Resume</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Resume"
        open={deleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setDeletingId(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true, loading: isDeleting }}
        cancelButtonProps={{ disabled: isDeleting }}
      >
        <p>
          Are you sure you want to delete this resume? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
}
