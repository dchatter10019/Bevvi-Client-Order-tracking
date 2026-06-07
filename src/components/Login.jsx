import React, { useState } from 'react'
import { Eye, EyeOff, Radio } from 'lucide-react'
import Logo from './Logo'
import { AUTH } from '../utils/constants'

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (
      credentials.username === AUTH.username &&
      credentials.password === AUTH.password
    ) {
      setTimeout(() => {
        onLogin(`bevvi_order_monitor_${Date.now()}`)
        setIsLoading(false)
      }, 400)
      return
    }

    setError('Invalid credentials.')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between bg-black px-12 py-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-bevvi-700/25 via-transparent to-transparent" />
        <div className="relative rounded-xl bg-black p-6 -ml-2">
          <Logo size="large" />
          <h1 className="mt-6 text-5xl font-bold text-white leading-tight">
            Order<br />Monitor
          </h1>
          <p className="mt-4 text-xl text-bevvi-200 font-medium">Alcohol Made Easy.</p>
        </div>

        <div className="relative space-y-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bevvi-600/20 text-bevvi-400">
              <Radio className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-white">Live order visibility</p>
              <p className="text-sm text-slate-400 mt-1">
                Track partner orders across your channels — curated, seamless, and actionable.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Made with ❤ in NYC</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 rounded-xl bg-black p-4 inline-block">
            <Logo size="default" />
            <h2 className="mt-3 text-2xl font-bold text-white">Order Monitor</h2>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500 mb-8">Access your monitoring console</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                User ID
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-bevvi-500 focus:outline-none focus:ring-2 focus:ring-bevvi-500/20"
                value={credentials.username}
                onChange={(e) => {
                  setCredentials({ ...credentials, username: e.target.value })
                  if (error) setError('')
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm focus:border-bevvi-500 focus:outline-none focus:ring-2 focus:ring-bevvi-500/20"
                  value={credentials.password}
                  onChange={(e) => {
                    setCredentials({ ...credentials, password: e.target.value })
                    if (error) setError('')
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full monitor-btn py-3"
            >
              {isLoading ? 'Authenticating…' : 'Enter Console'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
