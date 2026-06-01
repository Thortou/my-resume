'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import type { Banner } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface BannerSlideshowProps {
  banners: Banner[];
}

export function BannerSlideshow({ banners }: BannerSlideshowProps) {
  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white !opacity-50',
          bulletActiveClass: '!opacity-100',
        }}
        navigation
        loop={banners.length > 1}
        className="w-full"
        style={{
          // @ts-expect-error - CSS variables for Swiper
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <BannerSlide banner={banner} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function BannerSlide({ banner }: { banner: Banner }) {
  const content = (
    <div className="relative h-[400px] w-full sm:h-[500px] lg:h-[600px]">
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        priority
        className="object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {banner.title}
            </h2>
            {banner.description && (
              <p className="mt-4 text-lg text-gray-200 sm:text-xl">
                {banner.description}
              </p>
            )}
            {banner.link && (
              <div className="mt-6">
                <span className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-100">
                  Learn More
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (banner.link) {
    return (
      <Link href={banner.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
