import { HeroBlock } from '@/components/blocks/HeroBlock'
import { TourSearchBlock } from '@/components/blocks/TourSearchBlock'
import {
  BenefitsBlockView,
  CTABlockView,
  DestinationsBlockView,
  FeaturedToursBlockView,
  GalleryBlockView,
  StoryBlockView,
  TestimonialsBlockView,
} from '@/components/blocks/ContentBlocks'
import {
  getDestinations,
  getTestimonials,
  getTours,
} from '@/lib/payload'

type Block = {
  blockType: string
  id?: string | null
  [key: string]: unknown
}

export async function RenderHomepageBlocks({
  blocks,
}: {
  blocks: Block[] | null | undefined
}) {
  if (!blocks?.length) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-4xl">Главная страница пока пуста</h1>
        <p className="mt-4 text-[var(--color-muted)]">
          Добавьте блоки в Payload Admin → Globals → Homepage
        </p>
      </div>
    )
  }

  const destinationOptions = await getDestinations({ limit: 50 })
  const destOpts = destinationOptions.docs.map((d) => ({
    label: d.title,
    value: d.slug,
  }))

  const rendered = []

  for (const block of blocks) {
    switch (block.blockType) {
      case 'hero':
        rendered.push(
          <HeroBlock
            key={block.id}
            eyebrow={block.eyebrow as string}
            title={block.title as string}
            description={block.description as string}
            backgroundImage={block.backgroundImage}
            primaryButton={block.primaryButton as never}
            secondaryButton={block.secondaryButton as never}
            statistics={block.statistics as never}
          />,
        )
        break
      case 'tourSearch':
        rendered.push(
          <TourSearchBlock
            key={block.id}
            title={block.title as string}
            destinations={destOpts}
          />,
        )
        break
      case 'destinations': {
        const destinations = await getDestinations({
          featured: Boolean(block.showFeaturedOnly),
          limit: (block.limit as number) || 6,
        })
        rendered.push(
          <DestinationsBlockView
            key={block.id}
            eyebrow={block.eyebrow as string}
            title={block.title as string}
            description={block.description as string}
            destinations={destinations.docs as never}
          />,
        )
        break
      }
      case 'featuredTours': {
        const tours = await getTours({
          featured: true,
          limit: (block.limit as number) || 3,
        })
        rendered.push(
          <FeaturedToursBlockView
            key={block.id}
            eyebrow={block.eyebrow as string}
            title={block.title as string}
            description={block.description as string}
            tours={tours.docs as never}
          />,
        )
        break
      }
      case 'story':
        rendered.push(
          <StoryBlockView
            key={block.id}
            eyebrow={block.eyebrow as string}
            title={block.title as string}
            description={block.description as string}
            image={block.image}
            cta={block.cta as never}
          />,
        )
        break
      case 'benefits':
        rendered.push(
          <BenefitsBlockView
            key={block.id}
            title={block.title as string}
            items={block.items as never}
          />,
        )
        break
      case 'testimonials': {
        const testimonials = await getTestimonials({
          featured: true,
          limit: (block.limit as number) || 3,
        })
        rendered.push(
          <TestimonialsBlockView
            key={block.id}
            eyebrow={block.eyebrow as string}
            title={block.title as string}
            testimonials={testimonials.docs as never}
          />,
        )
        break
      }
      case 'gallery':
        rendered.push(
          <GalleryBlockView
            key={block.id}
            title={block.title as string}
            images={block.images as never}
          />,
        )
        break
      case 'cta':
        rendered.push(
          <CTABlockView
            key={block.id}
            title={block.title as string}
            description={block.description as string}
            primaryButton={block.primaryButton as never}
            backgroundImage={block.backgroundImage}
          />,
        )
        break
      default:
        break
    }
  }

  return <>{rendered}</>
}
