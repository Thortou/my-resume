import type { Metadata } from 'next';
import { Card, Tabs } from 'antd';
import { PageHeader } from '@/components/ui';

export const metadata: Metadata = {
  title: 'ການຕັ້ງຄ່າ',
};

export default function SettingsPage() {
  const tabItems = [
    {
      key: 'general',
      label: 'ທົ່ວໄປ',
      children: (
        <div className="py-4">
          <h3 className="mb-4 text-lg font-medium">ການຕັ້ງຄ່າທົ່ວໄປ</h3>
          <p className="text-gray-600">
            ຕັ້ງຄ່າການຕັ້ງຄ່າແອັບພລິເຄຊັນທົ່ວໄປທີ່ນີ້.
          </p>
          {/* ເພີ່ມແບບຟອມການຕັ້ງຄ່າທົ່ວໄປທີ່ນີ້ */}
        </div>
      ),
    },
    {
      key: 'security',
      label: 'ຄວາມປອດໄພ',
      children: (
        <div className="py-4">
          <h3 className="mb-4 text-lg font-medium">ການຕັ້ງຄ່າຄວາມປອດໄພ</h3>
          <p className="text-gray-600">
            ຈັດການການຕັ້ງຄ່າຄວາມປອດໄພ ແລະ ການພິສູດຕົວຕົນ.
          </p>
          {/* ເພີ່ມແບບຟອມການຕັ້ງຄ່າຄວາມປອດໄພທີ່ນີ້ */}
        </div>
      ),
    },
    {
      key: 'notifications',
      label: 'ການແຈ້ງເຕືອນ',
      children: (
        <div className="py-4">
          <h3 className="mb-4 text-lg font-medium">ການຕັ້ງຄ່າການແຈ້ງເຕືອນ</h3>
          <p className="text-gray-600">
            ຕັ້ງຄ່າຄວາມມັກການແຈ້ງເຕືອນທາງອີເມວ ແລະ push.
          </p>
          {/* ເພີ່ມແບບຟອມການຕັ້ງຄ່າການແຈ້ງເຕືອນທີ່ນີ້ */}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="ການຕັ້ງຄ່າ"
        description="ຈັດການການຕັ້ງຄ່າແອັບພລິເຄຊັນ"
      />

      <Card>
        <Tabs defaultActiveKey="general" items={tabItems} />
      </Card>
    </div>
  );
}
