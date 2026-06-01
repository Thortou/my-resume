import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    // Primary colors
    colorPrimary: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',

    // Typography
    fontFamily:
      'var(--font-lao), BoonBaan, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 14,

    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,

    // Layout
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
  },

  components: {
    Button: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingContentHorizontal: 20,
    },

    Input: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },

    Select: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },

    Table: {
      headerBg: '#fafafa',
      headerColor: '#262626',
      rowHoverBg: '#f5f5f5',
    },

    Card: {
      paddingLG: 24,
    },

    Layout: {
      siderBg: '#001529',
      headerBg: '#ffffff',
      bodyBg: '#f5f5f5',
    },

    Menu: {
      darkItemBg: '#001529',
      darkItemSelectedBg: '#1890ff',
    },
  },
};
