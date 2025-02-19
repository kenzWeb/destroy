import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

interface LoginProps {
	setIsAuthenticated: (value: boolean) => void
}

const Login: React.FC<LoginProps> = ({setIsAuthenticated}) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState<{email?: string; password?: string}>({})
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()

	const validateForm = () => {
		const newErrors: {email?: string; password?: string} = {}
		if (!email) newErrors.email = 'Email обязателен'
		if (!password) newErrors.password = 'Пароль обязателен'
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return

		setIsLoading(true)
		try {
			const response = await fetch(
				'http://jjxhzny-m2.wsr.ru/api-kosmos/login',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({email, password}),
				},
			)

			const data = await response.json()

			if (response.ok) {
				localStorage.setItem('token', data.token)
				setIsAuthenticated(true)
				navigate('/gagarin')
			} else {
				setErrors({email: data.message || 'Ошибка входа'})
			}
		} catch {
			setErrors({email: 'Ошибка сервера'})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md'>
			<h2 className='text-2xl font-bold mb-6 text-center'>Вход в систему</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Email
					</label>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
							errors.email ? 'border-red-500' : ''
						}`}
					/>
					{errors.email && (
						<p className='mt-1 text-sm text-red-500'>{errors.email}</p>
					)}
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Пароль
					</label>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
							errors.password ? 'border-red-500' : ''
						}`}
					/>
					{errors.password && (
						<p className='mt-1 text-sm text-red-500'>{errors.password}</p>
					)}
				</div>

				<button
					type='submit'
					disabled={isLoading}
					className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50'
				>
					{isLoading ? 'Вход...' : 'Войти'}
				</button>
			</form>
		</div>
	)
}

export default Login
