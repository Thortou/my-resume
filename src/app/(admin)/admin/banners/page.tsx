'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { Banner } from '@prisma/client';
import { PageHeader } from '@/components/ui';
import { BannersTable } from '@/components/tables';
import { BannerForm } from '@/components/forms';
import { getBannersAction, createBannerAction, updateBannerAction } from '@/actions';
import type { CreateBannerInput } from '@/schemas';
import { useDebounce } from '@/hooks';
import { DEFAULT_PAGE_SIZE, MESSAGES } from '@/constants';

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const fetchBanners = useCallback(async () => {
    setIsLoading(true);
    const result = await getBannersAction({
      page,
      limit,
      search: debouncedSearch || undefined,
    });

    if (result.success && result.data) {
      setBanners(result.data.banners);
      setTotal(result.data.total);
    }
    setIsLoading(false);
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handlePageChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreateBannerInput) => {
    setIsSubmitting(true);

    const result = editingBanner
      ? await updateBannerAction(editingBanner.id, data)
      : await createBannerAction(data);

    if (result.success) {
      message.success(
        editingBanner ? MESSAGES.UPDATE_SUCCESS : MESSAGES.CREATE_SUCCESS
      );
      setIsModalOpen(false);
      setEditingBanner(null);
      fetchBanners();
    } else {
      message.error(result.error || MESSAGES.SERVER_ERROR);
    }

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  return (
    <div>
      <PageHeader
        title="ປ້າຍໂຄສະນາ"
        description="ຈັດການປ້າຍໂຄສະນາສະໄລ້ໂຊຂອງເວັບໄຊ"
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            ເພີ່ມປ້າຍໂຄສະນາ
          </Button>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="ຄົ້ນຫາປ້າຍໂຄສະນາ..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ maxWidth: 300 }}
        />
      </div>

      <BannersTable
        banners={banners}
        total={total}
        page={page}
        limit={limit}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onRefresh={fetchBanners}
      />

      <Modal
        title={editingBanner ? 'ແກ້ໄຂປ້າຍໂຄສະນາ' : 'ສ້າງປ້າຍໂຄສະນາ'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
        width={600}
      >
        <BannerForm
          banner={editingBanner}
          isLoading={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
}
