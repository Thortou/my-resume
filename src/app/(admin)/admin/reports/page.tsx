'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Table,
  Spin,
  Empty,
  Select,
} from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { PageHeader } from '@/components/ui';
import {
  getOrderStatsAction,
  getRevenueByPeriodAction,
} from '@/actions/order.actions';
import {
  getProductStatsAction,
  getBestSellingProductsAction,
} from '@/actions/product.actions';

const { RangePicker } = DatePicker;

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
  const [orderStats, setOrderStats] = useState<any>(null);
  const [productStats, setProductStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [bestSelling, setBestSelling] = useState<any[]>([]);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [orders, products, revenue, selling] = await Promise.all([
        getOrderStatsAction(dateRange[0].toDate(), dateRange[1].toDate()),
        getProductStatsAction(),
        getRevenueByPeriodAction(
          dateRange[0].toDate(),
          dateRange[1].toDate(),
          groupBy
        ),
        getBestSellingProductsAction(10),
      ]);

      setOrderStats(orders);
      setProductStats(products);
      setRevenueData(revenue as any[]);
      setBestSelling(selling as any[]);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, groupBy]);

  // Revenue table columns
  const revenueColumns = [
    {
      title: 'ວັນທີ',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'ຈຳນວນຄຳສັ່ງ',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'ລາຍຮັບ',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => `${Number(value).toLocaleString()} ₭`,
    },
  ];

  // Best selling table columns
  const bestSellingColumns = [
    {
      title: 'ອັນດັບ',
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'ສິນຄ້າ',
      key: 'product',
      render: (_: any, record: any) => (
        <div>
          <p className="font-medium">{record.name}</p>
          <p className="text-sm text-gray-500">{record.sku || '-'}</p>
        </div>
      ),
    },
    {
      title: 'ຂາຍ',
      key: 'sold',
      render: (_: any, record: any) => `${record._count?.orderItems || 0} ຄັ້ງ`,
    },
    {
      title: 'ລາຄາ',
      key: 'price',
      render: (_: any, record: any) => (
        <span>
          {Number(record.salePrice || record.price).toLocaleString()} ₭
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="ລາຍງານ" description="ສະຖິຕິ ແລະ ລາຍງານການຂາຍ" />

      {/* Date Range Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <RangePicker
          value={dateRange}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setDateRange([dates[0], dates[1]]);
            }
          }}
          presets={[
            { label: 'ມື້ນີ້', value: [dayjs(), dayjs()] },
            {
              label: 'ອາທິດນີ້',
              value: [dayjs().startOf('week'), dayjs().endOf('week')],
            },
            {
              label: 'ເດືອນນີ້',
              value: [dayjs().startOf('month'), dayjs().endOf('month')],
            },
            {
              label: '30 ມື້ຜ່ານມາ',
              value: [dayjs().subtract(30, 'day'), dayjs()],
            },
            {
              label: 'ປີນີ້',
              value: [dayjs().startOf('year'), dayjs().endOf('year')],
            },
          ]}
        />
        <Select
          value={groupBy}
          onChange={setGroupBy}
          options={[
            { label: 'ຕາມວັນ', value: 'day' },
            { label: 'ຕາມອາທິດ', value: 'week' },
            { label: 'ຕາມເດືອນ', value: 'month' },
          ]}
          style={{ width: 120 }}
        />
      </div>

      {/* Overview Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ລາຍຮັບລວມ"
              value={orderStats?.revenue || 0}
              suffix="₭"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ຄຳສັ່ງຊື້ທັງໝົດ"
              value={orderStats?.total || 0}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ຄຳສັ່ງສຳເລັດ"
              value={orderStats?.completed || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ຄຳສັ່ງຍົກເລີກ"
              value={orderStats?.cancelled || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Inventory Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ສິນຄ້າທັງໝົດ"
              value={productStats?.total || 0}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ໃຊ້ງານ"
              value={productStats?.active || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ສິນຄ້າໃກ້ໝົດ"
              value={productStats?.lowStock || 0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ສິນຄ້າໝົດ"
              value={productStats?.outOfStock || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue & Best Selling */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="ລາຍຮັບຕາມໄລຍະເວລາ">
            {revenueData.length === 0 ? (
              <Empty description="ບໍ່ມີຂໍ້ມູນ" />
            ) : (
              <Table
                columns={revenueColumns}
                dataSource={revenueData}
                rowKey="period"
                pagination={false}
                size="small"
                summary={(data) => {
                  const totalRevenue = data.reduce(
                    (sum, row) => sum + Number(row.revenue || 0),
                    0
                  );
                  const totalOrders = data.reduce(
                    (sum, row) => sum + Number(row.count || 0),
                    0
                  );
                  return (
                    <Table.Summary.Row className="bg-gray-50 font-bold">
                      <Table.Summary.Cell index={0}>ລວມ</Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        {totalOrders}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        {totalRevenue.toLocaleString()} ₭
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="ສິນຄ້າຂາຍດີ">
            {bestSelling.length === 0 ? (
              <Empty description="ບໍ່ມີຂໍ້ມູນ" />
            ) : (
              <Table
                columns={bestSellingColumns}
                dataSource={bestSelling}
                rowKey="id"
                pagination={false}
                size="small"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
