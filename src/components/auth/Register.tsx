import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const Register: React.FC = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	})
	const [errors, setErrors] = useState<{[key: string]: string}>({})
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()

	const validateForm = () => {
		const newErrors: {[key: string]: string} = {}
		if (!formData.email) newErrors.email = 'Email обязателен'
		if (!formData.password) newErrors.password = 'Пароль обязателен'
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Пароли не совпадают'
		}
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return

		setIsLoading(true)
		try {
			const response = await fetch(
				'http://jjxhzny-m2.wsr.ru/api-kosmos/register',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: formData.email,
						password: formData.password,
					}),
				},
			)

			const data = await response.json()

			if (response.ok) {
				navigate('/login')
			} else {
				setErrors({submit: data.message || 'Ошибка регистрации'})
			}
		} catch {
			setErrors({submit: 'Ошибка сервера'})
		} finally {
			setIsLoading(false)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	return (
		<div className='max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md'>
			<h2 className='text-2xl font-bold mb-6 text-center'>Регистрация</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Email
					</label>
					<input
						type='email'
						name='email'
						value={formData.email}
						onChange={handleChange}
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
						name='password'
						value={formData.password}
						onChange={handleChange}
						className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
							errors.password ? 'border-red-500' : ''
						}`}
					/>
					{errors.password && (
						<p className='mt-1 text-sm text-red-500'>{errors.password}</p>
					)}
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Подтверждение пароля
					</label>
					<input
						type='password'
						name='confirmPassword'
						value={formData.confirmPassword}
						onChange={handleChange}
						className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
							errors.confirmPassword ? 'border-red-500' : ''
						}`}
					/>
					{errors.confirmPassword && (
						<p className='mt-1 text-sm text-red-500'>
							{errors.confirmPassword}
						</p>
					)}
				</div>

				{errors.submit && (
					<div className='p-3 bg-red-100 text-red-700 rounded-md'>
						{errors.submit}
					</div>
				)}

				<button
					type='submit'
					disabled={isLoading}
					className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50'
				>
					{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
				</button>
			</form>
		</div>
	)
}

export default Register
