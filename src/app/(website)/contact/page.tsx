import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { ContactForm } from '@/components/forms/contact-form';

export const metadata: Metadata = {
  title: 'ຕິດຕໍ່',
  description: 'ຕິດຕໍ່ຫາພວກເຮົາ. ພວກເຮົາຍິນດີຮັບຟັງຈາກທ່ານ.',
};

const contactInfo = [
  {
    icon: Mail,
    title: 'ອີເມວ',
    content: 'hello@example.com',
    href: 'mailto:hello@example.com',
  },
  {
    icon: Phone,
    title: 'ໂທລະສັບ',
    content: '+856 20 1234 5678',
    href: 'tel:+8562012345678',
  },
  {
    icon: MapPin,
    title: 'ຫ້ອງການ',
    content: 'ຖະໜົນລ້ານຊ້າງ, ນະຄອນຫຼວງວຽງຈັນ\nສປປ ລາວ',
  },
  {
    icon: Clock,
    title: 'ໂມງເຮັດວຽກ',
    content: 'ຈັນ - ສຸກ: 8:00 - 17:00',
  },
];

export default function ContactPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ສ່ວນຫົວ */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">ຕິດຕໍ່ພວກເຮົາ</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            ມີຄຳຖາມບໍ? ພວກເຮົາຍິນດີຮັບຟັງຈາກທ່ານ. ສົ່ງຂໍ້ຄວາມຫາພວກເຮົາ
            ແລະ ພວກເຮົາຈະຕອບກັບໄວເທົ່າທີ່ເປັນໄປໄດ້.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          {/* ຂໍ້ມູນການຕິດຕໍ່ */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900">ຕິດຕໍ່ຫາພວກເຮົາ</h2>
            <p className="mt-4 text-gray-600">
              ກອກແບບຟອມ ແລະ ທີມງານຂອງພວກເຮົາຈະຕອບກັບທ່ານພາຍໃນ 24 ຊົ່ວໂມງ.
            </p>

            <div className="mt-8 space-y-6">
              {contactInfo.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-gray-600 whitespace-pre-line">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ແຜນທີ່ */}
            <div className="mt-8 rounded-xl overflow-hidden h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11176.177199807193!2d102.64909642978519!3d17.998123879363735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sla!4v1779695802565!5m2!1sen!2sla"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* ແບບຟອມຕິດຕໍ່ */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border bg-white p-8 shadow-sm">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
