import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'
import { getServerSession } from '@/lib/authentication/server.session'

export async function POST() {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')
        const userSession = await getServerSession()

        const session = await stripe.checkout.sessions.create({
            customer_email: userSession?.user?.email,
            line_items: [
                {
                    price: 'price_1UPGTcAkAtHVRfAZbSpF3V7a',
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        })

        return NextResponse.redirect(session.url, 303)
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        )
    }
}