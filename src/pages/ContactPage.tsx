import { useForm } from 'react-hook-form'
import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface ContactForm { name: string; email: string; phone?: string; subject: string; message: string }

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>()

  function onSubmit(_data: ContactForm) {
    return new Promise<void>(resolve => setTimeout(() => {
      toast.success('Message sent! We will reply within 24 hours.')
      reset()
      resolve()
    }, 1000))
  }

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-3">Contact Us</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Have a question, need a quote, or want to partner with us? Reach out and we'll get back to you quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="space-y-5">
            {[
              { Icon: MapPin, title: 'Address', content: 'Shop No 4, Harsha Residency, Devangpeth Road, Opp Samarth Apartment, Hubli 580023, Karnataka, India' },
              { Icon: Phone, title: 'Phone', content: '+91 8073667950', href: 'tel:8073667950' },
              { Icon: MessageCircle, title: 'WhatsApp', content: '+91 8073667950', href: 'https://wa.me/918073667950' },
              { Icon: Mail, title: 'Email', content: 'contact@apseshopping.com', href: 'mailto:contact@apseshopping.com' },
              { Icon: Clock, title: 'Working Hours', content: 'Mon–Sat: 9:00 AM – 7:00 PM' },
            ].map(({ Icon, title, content, href }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{title}</p>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                      className="text-sm text-gray-500 hover:text-primary transition-colors">{content}</a>
                  ) : (
                    <p className="text-sm text-gray-500">{content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold mb-5">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                  <input {...register('name', { required: 'Required' })} placeholder="John Smith"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                    type="email" placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input {...register('phone')} type="tel" placeholder="+91 80000 00000"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                  <input {...register('subject', { required: 'Required' })} placeholder="How can we help?"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                <textarea {...register('message', { required: 'Required', minLength: { value: 20, message: 'At least 20 chars' } })}
                  rows={5} placeholder="Write your message here…"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting}
                className="btn-primary py-3 px-10 text-sm disabled:opacity-60">
                {isSubmitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Map Embed */}
        <div className="mt-10 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <iframe
            title="Apse Shopping Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.342!2d75.128!3d15.352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDIxJzA3LjIiTiA3NcKwMDcnNDAuOCJF!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}
