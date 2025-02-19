import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

interface FlightForm {
	flightNumber: string
	destination: string
	launchDate: string
	seats: string
}

const CreateFlight: React.FC = () => {
	const [formData, setFormData] = useState<FlightForm>({
		flightNumber: '',
		destination: '',
		launchDate: '',
		seats: '',
	})
	const [errors, setErrors] = useState<{[key: string]: string}>({})
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()

	const validateForm = () => {
		const newErrors: {[key: string]: string} = {}
		if (!formData.flightNumber)
			newErrors.flightNumber = 'Номер рейса обязателен'
		if (!formData.destination)
			newErrors.destination = 'Место назначения обязательно'
		if (!formData.launchDate) newErrors.launchDate = 'Дата запуска обязательна'
		if (!formData.seats) newErrors.seats = 'Количество мест обязательно'

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return

		setIsLoading(true)
		try {
			const response = await fetch(
				'http://jjxhzny-m2.wsr.ru/api-kosmos/flights',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					body: JSON.stringify({
						...formData,
						seats: parseInt(formData.seats),
					}),
				},
			)

			if (!response.ok) throw new Error('Failed to create flight')

			navigate('/flights')
		} catch {
			setErrors({submit: 'Ошибка при создании рейса'})
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
		<div className='max-w-2xl mx-auto mt-8'>
			<div className='bg-white shadow-lg rounded-lg overflow-hidden'>
				<div className='p-6'>
					<h1 className='text-3xl font-bold mb-6 text-gray-800'>
						Создание космического рейса
					</h1>

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Номер рейса
							</label>
							<input
								type='text'
								name='flightNumber'
								value={formData.flightNumber}
								onChange={handleChange}
								className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
									errors.flightNumber ? 'border-red-500' : ''
								}`}
							/>
							{errors.flightNumber && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.flightNumber}
								</p>
							)}
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Место назначения
							</label>
							<input
								type='text'
								name='destination'
								value={formData.destination}
								onChange={handleChange}
								className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
									errors.destination ? 'border-red-500' : ''
								}`}
							/>
							{errors.destination && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.destination}
								</p>
							)}
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Дата запуска
							</label>
							<input
								type='date'
								name='launchDate'
								value={formData.launchDate}
								onChange={handleChange}
								className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
									errors.launchDate ? 'border-red-500' : ''
								}`}
							/>
							{errors.launchDate && (
								<p className='mt-1 text-sm text-red-500'>{errors.launchDate}</p>
							)}
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Количество мест
							</label>
							<input
								type='number'
								name='seats'
								value={formData.seats}
								onChange={handleChange}
								min='1'
								className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
									errors.seats ? 'border-red-500' : ''
								}`}
							/>
							{errors.seats && (
								<p className='mt-1 text-sm text-red-500'>{errors.seats}</p>
							)}
						</div>

						{errors.submit && (
							<div className='p-3 bg-red-100 text-red-700 rounded-md'>
								{errors.submit}
							</div>
						)}

						<div className='flex justify-between'>
							<button
								type='button'
								onClick={() => navigate('/flights')}
								className='bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200'
							>
								К списку рейсов
							</button>
							<button
								type='submit'
								disabled={isLoading}
								className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50'
							>
								{isLoading ? 'Сохранение...' : 'Сохранить'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default CreateFlight
