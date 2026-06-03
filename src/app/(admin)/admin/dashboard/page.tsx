import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Row, Col, Card, Spin, Tag, Progress, Empty } from 'antd';
import {
  AppstoreOutlined,
  FileTextOutlined,
  DollarOutlined,
  WarningOutlined,
  RiseOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui';
import {
  StatCard,
  SimpleLineChart,
  SimpleBarChart,
  SimpleDonutChart,
  RecentOrdersTable,
} from '@/components/admin';
import { ROUTES } from '@/constants';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { orderService } from '@/services/order.service';
import { userService } from '@/services/user.service';

export const metadata: Metadata = {
  title: 'ແຜງຄວບຄຸມ | Admin',
};

// Dashboard Statistics
async function DashboardStats() {
  const [productStats, orderStats, categoryCount] = await Promise.all([
    productService.getStats(),
    orderService.getStats(),
    categoryService.getTotalCount(),
  ]);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="ສິນຄ້າທັງໝົດ"
          value={productStats.total}
          icon={<InboxOutlined className="text-2xl" />}
          suffix={
            <span className="text-xs text-gray-500">
              ({productStats.active} ໃຊ້ງານ)
            </span>
          }
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="ໝວດໝູ່"
          value={categoryCount}
          icon={<AppstoreOutlined className="text-2xl" />}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="ຄຳສັ່ງຊື້ທັງໝົດ"
          value={orderStats.total}
          icon={<FileTextOutlined className="text-2xl" />}
          suffix={
            orderStats.pending > 0 && (
              <Tag color="orange" className="ml-2">
                {orderStats.pending} ລໍຖ້າ
              </Tag>
            )
          }
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="ລາຍຮັບລວມ"
          value={orderStats.revenue}
          precision={0}
          prefix=""
          suffix="₭"
          icon={<DollarOutlined className="text-2xl" />}
        />
      </Col>
    </Row>
  );
}

// Stock Alerts
async function StockAlerts() {
  const [lowStockProducts, outOfStockProducts] = await Promise.all([
    productService.getLowStock(5) as Promise<any[]>,
    productService.getOutOfStock(5),
  ]);

  const hasAlerts =
    (lowStockProducts?.length || 0) > 0 ||
    (outOfStockProducts?.length || 0) > 0;

  if (!hasAlerts) {
    return (
      <Card
        title={
          <span>
            <WarningOutlined className="mr-2 text-yellow-500" />
            ການແຈ້ງເຕືອນສິນຄ້າ
          </span>
        }
      >
        <Empty description="ບໍ່ມີການແຈ້ງເຕືອນ" />
      </Card>
    );
  }

  return (
    <Card
      title={
        <span>
          <WarningOutlined className="mr-2 text-yellow-500" />
          ການແຈ້ງເຕືອນສິນຄ້າ
        </span>
      }
      extra={
        <Link href={ROUTES.ADMIN_STOCK} className="text-blue-500">
          ເບິ່ງທັງໝົດ
        </Link>
      }
    >
      <div className="space-y-3">
        {outOfStockProducts?.map((product: any) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-lg bg-red-50 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-red-100">
                <InboxOutlined className="text-red-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">
                  {product.category?.name || 'ບໍ່ມີໝວດໝູ່'}
                </p>
              </div>
            </div>
            <Tag color="red">ໝົດສິນຄ້າ</Tag>
          </div>
        ))}
        {(lowStockProducts as any[])?.map((product: any) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-lg bg-yellow-50 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-yellow-100">
                <WarningOutlined className="text-yellow-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">
                  ເຫຼືອ {product.stockQuantity || product.stock_quantity} ໜ່ວຍ
                </p>
              </div>
            </div>
            <Tag color="orange">ໃກ້ໝົດ</Tag>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Recent Orders
async function RecentOrders() {
  const ordersRaw = await orderService.getRecent(5);

  // Serialize orders for client component (convert Decimal to number)
  const orders = ordersRaw.map((order: any) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    total: Number(order.total),
    status: order.status,
    user: order.user,
    _count: order._count,
  }));

  return <RecentOrdersTable orders={orders} />;
}

// Best Selling Products
async function BestSellingProducts() {
  const products = await productService.getBestSelling(5);

  return (
    <Card
      title={
        <span>
          <RiseOutlined className="mr-2 text-green-500" />
          ສິນຄ້າຂາຍດີ
        </span>
      }
      extra={
        <Link href={ROUTES.ADMIN_PRODUCTS} className="text-blue-500">
          ເບິ່ງທັງໝົດ
        </Link>
      }
    >
      {products.length === 0 ? (
        <Empty description="ບໍ່ມີຂໍ້ມູນ" />
      ) : (
        <div className="space-y-4">
          {products.map((product: any, index) => (
            <div key={product.id} className="flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">
                  {product._count?.orderItems || 0} ຄັ້ງ
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {Number(product.salePrice || product.price).toLocaleString()}{' '}
                  ₭
                </p>
                <Progress
                  percent={Math.min(
                    100,
                    (product._count?.orderItems || 0) * 10
                  )}
                  showInfo={false}
                  size="small"
                  strokeColor="#10B981"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// Revenue Chart
async function RevenueChart() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const revenueData = await orderService.getRevenueByPeriod(
    startDate,
    endDate,
    'day'
  );

  // Generate all days in the range
  const days = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayData = revenueData.find((d) => d.period === dateStr);
    days.push({
      label: currentDate.toLocaleDateString('lo-LA', {
        weekday: 'short',
        day: 'numeric',
      }),
      value: dayData ? Number(dayData.revenue) : 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <SimpleLineChart
      data={days}
      title="ລາຍຮັບ 7 ມື້ຫຼ້າສຸດ"
      height={250}
      suffix=" ₭"
    />
  );
}

// Order Status Chart
async function OrderStatusChart() {
  const stats = await orderService.getStats();

  const data = [
    { label: 'ລໍຖ້າ', value: stats.pending, color: '#faad14' },
    { label: 'ກຳລັງດຳເນີນການ', value: stats.processing, color: '#1890ff' },
    { label: 'ສຳເລັດ', value: stats.completed, color: '#52c41a' },
    { label: 'ຍົກເລີກ', value: stats.cancelled, color: '#ff4d4f' },
  ].filter((d) => d.value > 0);

  return (
    <SimpleDonutChart
      data={data}
      title="ສະຖານະຄຳສັ່ງຊື້"
      centerValue={stats.total}
      centerLabel="ຄຳສັ່ງຊື້ທັງໝົດ"
    />
  );
}

// Monthly Sales Chart
async function MonthlySalesChart() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  const salesData = await orderService.getRevenueByPeriod(
    startDate,
    endDate,
    'month'
  );

  const months = salesData.map((d) => {
    const [year, month] = d.period.split('-');
    const monthNames = [
      'ມ.ກ.',
      'ກ.ພ.',
      'ມີ.ນ.',
      'ເມ.ສ.',
      'ພ.ພ.',
      'ມິ.ຖ.',
      'ກ.ລ.',
      'ສ.ຫ.',
      'ກ.ຍ.',
      'ຕ.ລ.',
      'ພ.ຈ.',
      'ທ.ວ.',
    ];
    return {
      label: monthNames[parseInt(month) - 1] || month,
      value: Number(d.revenue),
    };
  });

  return (
    <SimpleBarChart
      data={months}
      title="ຍອດຂາຍລາຍເດືອນ"
      height={200}
      suffix=" ₭"
    />
  );
}

// Quick Stats Cards
async function QuickStats() {
  const [productStats, orderStats, userStats] = await Promise.all([
    productService.getStats(),
    orderService.getStats(),
    userService.getStatistics(),
  ]);

  const stats = userStats.data;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={12} lg={6}>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <p className="text-blue-100">ສິນຄ້າໃກ້ໝົດ</p>
            <p className="text-3xl font-bold">{productStats.lowStock}</p>
          </div>
        </Card>
      </Col>
      <Col xs={12} lg={6}>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="text-center">
            <p className="text-red-100">ສິນຄ້າໝົດ</p>
            <p className="text-3xl font-bold">{productStats.outOfStock}</p>
          </div>
        </Card>
      </Col>
      <Col xs={12} lg={6}>
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="text-center">
            <p className="text-yellow-100">ຄຳສັ່ງລໍຖ້າ</p>
            <p className="text-3xl font-bold">{orderStats.pending}</p>
          </div>
        </Card>
      </Col>
      <Col xs={12} lg={6}>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-center">
            <p className="text-green-100">ຜູ້ໃຊ້ທັງໝົດ</p>
            <p className="text-3xl font-bold">{stats?.total || 0}</p>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

// Loading components
function StatsLoading() {
  return (
    <Row gutter={[16, 16]}>
      {[1, 2, 3, 4].map((i) => (
        <Col xs={24} sm={12} lg={6} key={i}>
          <Card className="flex h-[120px] items-center justify-center">
            <Spin />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

function CardLoading() {
  return (
    <Card className="flex h-[300px] items-center justify-center">
      <Spin />
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="ແຜງຄວບຄຸມ"
        description="ພາບລວມຂອງລະບົບຈັດການສິນຄ້າ ແລະ ຄຳສັ່ງຊື້"
      />

      {/* Main Statistics */}
      <Suspense fallback={<StatsLoading />}>
        <DashboardStats />
      </Suspense>

      {/* Quick Stats */}
      <Suspense fallback={<StatsLoading />}>
        <QuickStats />
      </Suspense>

      {/* Main Content Grid */}
      <Row gutter={[16, 16]}>
        {/* Recent Orders */}
        <Col xs={24} lg={14}>
          <Suspense fallback={<CardLoading />}>
            <RecentOrders />
          </Suspense>
        </Col>

        {/* Stock Alerts */}
        <Col xs={24} lg={10}>
          <Suspense fallback={<CardLoading />}>
            <StockAlerts />
          </Suspense>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Suspense fallback={<CardLoading />}>
            <RevenueChart />
          </Suspense>
        </Col>
        <Col xs={24} lg={8}>
          <Suspense fallback={<CardLoading />}>
            <OrderStatusChart />
          </Suspense>
        </Col>
      </Row>

      {/* Best Selling & Monthly Sales */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Suspense fallback={<CardLoading />}>
            <BestSellingProducts />
          </Suspense>
        </Col>
        <Col xs={24} lg={12}>
          <Suspense fallback={<CardLoading />}>
            <MonthlySalesChart />
          </Suspense>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="ການດຳເນີນການດ່ວນ">
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Link href={ROUTES.ADMIN_PRODUCT_NEW}>
              <Card hoverable className="h-full text-center">
                <InboxOutlined className="mb-2 text-3xl text-blue-500" />
                <p>ເພີ່ມສິນຄ້າ</p>
              </Card>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <Link href={ROUTES.ADMIN_CATEGORIES}>
              <Card hoverable className="h-full text-center">
                <AppstoreOutlined className="mb-2 text-3xl text-green-500" />
                <p>ຈັດການໝວດໝູ່</p>
              </Card>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <Link href={ROUTES.ADMIN_ORDERS}>
              <Card hoverable className="h-full text-center">
                <FileTextOutlined className="mb-2 text-3xl text-orange-500" />
                <p>ເບິ່ງຄຳສັ່ງຊື້</p>
              </Card>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <Link href={ROUTES.ADMIN_REPORTS}>
              <Card hoverable className="h-full text-center">
                <RiseOutlined className="mb-2 text-3xl text-purple-500" />
                <p>ລາຍງານ</p>
              </Card>
            </Link>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
