import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { stripe } from '../../lib/stripe'

export default async function Success({ searchParams }) {
    const params = await searchParams
    const session_id = params?.session_id

    if (!session_id) {
        return redirect('/dashboard')
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    })

    const status = session?.status
    const customerEmail = session?.customer_details?.email || 'your email'

    if (status === 'open') {
        return redirect('/')
    }

    if (status === 'complete') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full rounded-2xl border border-emerald-500/30 bg-card p-8 text-center space-y-5 shadow-2xl backdrop-blur-xl">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                            Payment Successful!
                        </h1>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            We appreciate your business! A confirmation receipt has been sent to{' '}
                            <strong className="text-foreground">{customerEmail}</strong>.
                        </p>
                    </div>

                    <div className="pt-2">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                        >
                            <span>Return to Dashboard</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return redirect('/dashboard')
}