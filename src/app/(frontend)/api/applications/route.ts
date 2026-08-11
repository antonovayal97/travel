import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { applicationSchema } from '@/lib/validations/application'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = applicationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Некорректные данные' },
        { status: 400 },
      )
    }

    const data = parsed.data
    const payload = await getPayloadClient()

    await payload.create({
      collection: 'applications',
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        travelersCount: data.travelersCount,
        budget: data.budget || undefined,
        comment: data.comment || undefined,
        travelDate: data.travelDate || undefined,
        tour: data.tour || undefined,
        destination: data.destination || undefined,
        status: 'new',
      },
    })

    revalidatePath('/admin')

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
