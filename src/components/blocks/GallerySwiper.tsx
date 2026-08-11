'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { MediaImage } from '@/components/ui/MediaImage'
import { FadeUp } from '@/components/motion/FadeUp'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'

type GalleryImage = { image?: unknown; id?: string | null }

export function GallerySwiper({
  title,
  images,
}: {
  title?: string | null
  images?: GalleryImage[] | null
}) {
  const swiperRef = useRef<SwiperType | null>(null)
  const items = images?.filter((item) => item.image) || []

  if (!items.length) return null

  return (
    <section className="section-pad overflow-hidden bg-[linear-gradient(180deg,#1a1d26_0%,#2a303c_100%)] text-white">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(1.9rem,4vw,3.1rem)]">{title}</h2>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Предыдущий слайд"
                className="flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 transition hover:bg-[var(--color-accent)]"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Следующий слайд"
                className="flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 transition hover:bg-[var(--color-accent)]"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </FadeUp>

        <Swiper
          modules={[Autoplay, FreeMode, Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          freeMode={{ enabled: true, sticky: true }}
          grabCursor
          loop={items.length > 4}
          spaceBetween={16}
          slidesPerView={1.15}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2.1, spaceBetween: 16 },
            1024: { slidesPerView: 3.2, spaceBetween: 20 },
            1280: { slidesPerView: 4.1, spaceBetween: 20 },
          }}
          className="gallery-swiper !overflow-visible !pb-12"
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.id || index}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-[1.5rem]">
                <MediaImage
                  media={item.image as never}
                  fill
                  sizeHint="card"
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
