import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

interface RegisterForm {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>()
  const [showPwd, setShowPwd] = useState(false)
  const navigate = useNavigate()
  const pwd = watch('password')
  const { login } = useAuth()

  function onSubmit(data: RegisterForm) {
    return new Promise<void>(resolve => setTimeout(() => {
      login({ name: data.name, email: data.email, phone: data.phone })
      toast.success(`Account created! Welcome, ${data.name.split(' ')[0]}!`)
      navigate('/', { replace: true })
      resolve()
    }, 800))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl">A</span>
            </div>
            <span className="font-black text-2xl text-primary">Apse Shopping</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm mb-7">Join Apse Shopping and start exploring.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input {...register('name', { required: 'Name is required' })}
                placeholder="John Smith"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                type="email" placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input {...register('phone', { required: 'Phone is required' })}
                type="tel" placeholder="+91 80000 00000"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                  type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-11 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input {...register('confirmPassword', { required: 'Required', validate: v => v === pwd || 'Passwords do not match' })}
                type="password" placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input {...register('agreeTerms', { required: 'You must agree to the terms' })}
                type="checkbox" className="mt-0.5 accent-primary" />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {errors.agreeTerms && <p className="text-red-500 text-xs">{errors.agreeTerms.message}</p>}

            <button type="submit" disabled={isSubmitting}
              className="w-full btn-primary py-3 text-sm disabled:opacity-60">
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
