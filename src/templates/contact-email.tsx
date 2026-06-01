import * as React from 'react';

interface ContactEmailProps {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  submittedAt: Date;
}

export function ContactEmailTemplate({
  name,
  email,
  phone,
  subject,
  message,
  submittedAt,
}: ContactEmailProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(submittedAt);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#f4f4f5',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <table
          role="presentation"
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#f4f4f5',
            padding: '40px 20px',
          }}
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  borderCollapse: 'collapse',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <tr>
                  <td
                    style={{
                      backgroundColor: '#3b82f6',
                      padding: '32px 40px',
                      textAlign: 'center',
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        color: '#ffffff',
                        fontSize: '24px',
                        fontWeight: 700,
                        letterSpacing: '-0.5px',
                      }}
                    >
                      New Contact Form Submission
                    </h1>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: '40px' }}>
                    {/* Intro */}
                    <p
                      style={{
                        margin: '0 0 24px',
                        color: '#374151',
                        fontSize: '16px',
                        lineHeight: '24px',
                      }}
                    >
                      You have received a new message through your website contact form.
                    </p>

                    {/* Contact Details Card */}
                    <table
                      role="presentation"
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        marginBottom: '24px',
                      }}
                    >
                      <tr>
                        <td style={{ padding: '24px' }}>
                          <h2
                            style={{
                              margin: '0 0 16px',
                              color: '#111827',
                              fontSize: '14px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            Sender Information
                          </h2>

                          {/* Name */}
                          <table
                            role="presentation"
                            style={{
                              width: '100%',
                              borderCollapse: 'collapse',
                              marginBottom: '12px',
                            }}
                          >
                            <tr>
                              <td
                                style={{
                                  width: '100px',
                                  color: '#6b7280',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  verticalAlign: 'top',
                                  paddingBottom: '4px',
                                }}
                              >
                                Name:
                              </td>
                              <td
                                style={{
                                  color: '#111827',
                                  fontSize: '14px',
                                  fontWeight: 600,
                                }}
                              >
                                {name}
                              </td>
                            </tr>
                          </table>

                          {/* Email */}
                          <table
                            role="presentation"
                            style={{
                              width: '100%',
                              borderCollapse: 'collapse',
                              marginBottom: '12px',
                            }}
                          >
                            <tr>
                              <td
                                style={{
                                  width: '100px',
                                  color: '#6b7280',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  verticalAlign: 'top',
                                  paddingBottom: '4px',
                                }}
                              >
                                Email:
                              </td>
                              <td>
                                <a
                                  href={`mailto:${email}`}
                                  style={{
                                    color: '#3b82f6',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                  }}
                                >
                                  {email}
                                </a>
                              </td>
                            </tr>
                          </table>

                          {/* Phone */}
                          {phone && (
                            <table
                              role="presentation"
                              style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                marginBottom: '12px',
                              }}
                            >
                              <tr>
                                <td
                                  style={{
                                    width: '100px',
                                    color: '#6b7280',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    verticalAlign: 'top',
                                    paddingBottom: '4px',
                                  }}
                                >
                                  Phone:
                                </td>
                                <td
                                  style={{
                                    color: '#111827',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                  }}
                                >
                                  {phone}
                                </td>
                              </tr>
                            </table>
                          )}

                          {/* Subject */}
                          <table
                            role="presentation"
                            style={{
                              width: '100%',
                              borderCollapse: 'collapse',
                            }}
                          >
                            <tr>
                              <td
                                style={{
                                  width: '100px',
                                  color: '#6b7280',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  verticalAlign: 'top',
                                  paddingBottom: '4px',
                                }}
                              >
                                Subject:
                              </td>
                              <td
                                style={{
                                  color: '#111827',
                                  fontSize: '14px',
                                  fontWeight: 600,
                                }}
                              >
                                {subject}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    {/* Message Card */}
                    <table
                      role="presentation"
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        marginBottom: '24px',
                      }}
                    >
                      <tr>
                        <td style={{ padding: '24px' }}>
                          <h2
                            style={{
                              margin: '0 0 16px',
                              color: '#111827',
                              fontSize: '14px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            Message
                          </h2>
                          <p
                            style={{
                              margin: 0,
                              color: '#374151',
                              fontSize: '15px',
                              lineHeight: '24px',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {message}
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* Timestamp */}
                    <p
                      style={{
                        margin: 0,
                        color: '#9ca3af',
                        fontSize: '13px',
                        textAlign: 'center',
                      }}
                    >
                      Submitted on {formattedDate}
                    </p>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      backgroundColor: '#f9fafb',
                      padding: '24px 40px',
                      borderTop: '1px solid #e5e7eb',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: '#6b7280',
                        fontSize: '13px',
                        textAlign: 'center',
                        lineHeight: '20px',
                      }}
                    >
                      This email was sent automatically from your website contact form.
                      <br />
                      Please reply directly to the sender at{' '}
                      <a
                        href={`mailto:${email}`}
                        style={{ color: '#3b82f6', textDecoration: 'none' }}
                      >
                        {email}
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
