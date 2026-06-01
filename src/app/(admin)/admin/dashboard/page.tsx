import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Row, Col, Card, Spin } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui';
import { StatCard } from '@/components/admin';
import { userService } from '@/services';

export const metadata: Metadata = {
  title: 'ແຜງຄວບຄຸມ',
};

async function DashboardStats() {
  const result = await userService.getStatistics();
  const stats = result.data;

  if (!stats) {
    return <div>ໂຫລດສະຖິຕິລົ້ມເຫລວ</div>;
  }

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="ຜູ້ໃຊ້ທັງໝົດ"
          value={stats.total}
          icon={<UserOutlined className="text-2xl" />}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="ຜູ້ບໍລິຫານ"
          value={stats.admins}
          icon={<SafetyOutlined className="text-2xl" />}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="ຜູ້ໃຊ້ປົກກະຕິ"
          value={stats.users}
          icon={<TeamOutlined className="text-2xl" />}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="ຜູ້ໃຊ້ທີ່ໃຊ້ງານຢູ່"
          value={stats.active}
          icon={<CheckCircleOutlined className="text-2xl" />}
        />
      </Col>
    </Row>
  );
}

function StatsLoading() {
  return (
    <Row gutter={[24, 24]}>
      {[1, 2, 3, 4].map((i) => (
        <Col xs={24} sm={12} lg={6} key={i}>
          <Card className="h-[120px] flex items-center justify-center">
            <Spin />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="ແຜງຄວບຄຸມ"
        description="ຍິນດີຕ້ອນຮັບສູ່ແຜງຄວບຄຸມຜູ້ບໍລິຫານ"
      />

      <Suspense fallback={<StatsLoading />}>
        <DashboardStats />
      </Suspense>

      {/* ເພີ່ມເນື້ອຫາແຜງຄວບຄຸມເພີ່ມເຕີມທີ່ນີ້ */}
      <div className="mt-8">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <div className="rounded-lg border bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold">ກິດຈະກຳຫຼ້າສຸດ</h3>
              <p className="text-gray-500">ບໍ່ມີກິດຈະກຳຫຼ້າສຸດໃຫ້ສະແດງ.</p>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className="rounded-lg border bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold">ການດຳເນີນການດ່ວນ</h3>
              <p className="text-gray-500">ຕັ້ງຄ່າວິດເຈັດແຜງຄວບຄຸມຂອງທ່ານ.</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
