'use client';

import type { ReactNode } from 'react';
import { Form } from 'antd';
import type { FormItemProps } from 'antd';

interface FormFieldProps extends FormItemProps {
  children: ReactNode;
  error?: string;
}

export function FormField({ children, error, ...props }: FormFieldProps) {
  return (
    <Form.Item
      {...props}
      validateStatus={error ? 'error' : undefined}
      help={error}
    >
      {children}
    </Form.Item>
  );
}
