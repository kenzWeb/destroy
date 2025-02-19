import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

interface MissionForm {
	name: string
	launchDate: string
	landingDate: string
	launchSite: string
	launchLatitude: string
	launchLongitude: string
	landingSite: string
	landingLatitude: string
	landingLongitude: string
	lunarModule: string
	commandModule: string
	crewMembers: string[]
}

const CreateMission: React.FC = () => {
	const [formData, setFormData] = useState<MissionForm>({
		name: '',
		launchDate: '',
		landingDate: '',
		launchSite: '',
		launchLatitude: '',
		launchLongitude: '',
		landingSite: '',
		landingLatitude: '',
		landingLongitude: '',
		lunarModule: '',
		commandModule: '',
		crewMembers: [''],
	})
	const [errors, setErrors] = useState<{[key: string]: string}>({})
	const [isLoading, setIsLoading] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const navigate = useNavigate()

	const validateForm = () => {
		const newErrors: {[key: string]: string} = {}
		if (!formData.name) newErrors.name = 'Название миссии обязательно'
		if (!formData.launchDate) newErrors.launchDate = 'Дата запуска обязательна'
		if (!formData.landingDate)
			newErrors.landingDate = 'Дата посадки обязательна'
		if (!formData.launchSite) newErrors.launchSite = 'Место запуска обязательно'
		if (!formData.landingSite)
			newErrors.landingSite = 'Место посадки обязательно'

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return

		setIsLoading(true)
		try {
			const response = await fetch(
				'http://jjxhzny-m2.wsr.ru/api-kosmos/missions',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					body: JSON.stringify({
						...formData,
						launchLatitude: parseFloat(formData.launchLatitude),
						launchLongitude: parseFloat(formData.launchLongitude),
						landingLatitude: parseFloat(formData.landingLatitude),
						landingLongitude: parseFloat(formData.landingLongitude),
					}),
				},
			)

			if (!response.ok) throw new Error('Failed to create mission')

			setShowSuccess(true)
			setTimeout(() => {
				navigate('/missions')
			}, 2000)
		} catch {
			setErrors({submit: 'Ошибка при создании миссии'})
		} finally {
			setIsLoading(false)
		}
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const {name, value} = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleCrewMemberChange = (index: number, value: string) => {
		const newCrewMembers = [...formData.crewMembers]
		newCrewMembers[index] = value
		setFormData((prev) => ({
			...prev,
			crewMembers: newCrewMembers,
		}))
	}

	const addCrewMember = () => {
		setFormData((prev) => ({
			...prev,
			crewMembers: [...prev.crewMembers, ''],
		}))
	}

	const removeCrewMember = (index: number) => {
		setFormData((prev) => ({
			...prev,
			crewMembers: prev.crewMembers.filter((_, i) => i !== index),
		}))
	}

	return (
		<div className='max-w-4xl mx-auto mt-8'>
			<div className='bg-white shadow-lg rounded-lg overflow-hidden'>
				<div className='p-6'>
					<h1 className='text-3xl font-bold mb-6 text-gray-800'>
						Создание миссии
					</h1>

					{showSuccess && (
						<div className='mb-6 p-4 bg-green-100 text-green-700 rounded-md'>
							Миссия успешно создана! Перенаправление...
						</div>
					)}

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Название миссии
								</label>
								<input
									type='text'
									name='name'
									value={formData.name}
									onChange={handleChange}
									className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
										errors.name ? 'border-red-500' : ''
									}`}
								/>
								{errors.name && (
									<p className='mt-1 text-sm text-red-500'>{errors.name}</p>
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
									<p className='mt-1 text-sm text-red-500'>
										{errors.launchDate}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Дата посадки
								</label>
								<input
									type='date'
									name='landingDate'
									value={formData.landingDate}
									onChange={handleChange}
									className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
										errors.landingDate ? 'border-red-500' : ''
									}`}
								/>
								{errors.landingDate && (
									<p className='mt-1 text-sm text-red-500'>
										{errors.landingDate}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Место запуска
								</label>
								<input
									type='text'
									name='launchSite'
									value={formData.launchSite}
									onChange={handleChange}
									className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
										errors.launchSite ? 'border-red-500' : ''
									}`}
								/>
								{errors.launchSite && (
									<p className='mt-1 text-sm text-red-500'>
										{errors.launchSite}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Широта запуска
								</label>
								<input
									type='number'
									step='0.000001'
									name='launchLatitude'
									value={formData.launchLatitude}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Долгота запуска
								</label>
								<input
									type='number'
									step='0.000001'
									name='launchLongitude'
									value={formData.launchLongitude}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Место посадки
								</label>
								<input
									type='text'
									name='landingSite'
									value={formData.landingSite}
									onChange={handleChange}
									className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
										errors.landingSite ? 'border-red-500' : ''
									}`}
								/>
								{errors.landingSite && (
									<p className='mt-1 text-sm text-red-500'>
										{errors.landingSite}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Широта посадки
								</label>
								<input
									type='number'
									step='0.000001'
									name='landingLatitude'
									value={formData.landingLatitude}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Долгота посадки
								</label>
								<input
									type='number'
									step='0.000001'
									name='landingLongitude'
									value={formData.landingLongitude}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Лунный модуль
								</label>
								<input
									type='text'
									name='lunarModule'
									value={formData.lunarModule}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Управляющий модуль
								</label>
								<input
									type='text'
									name='commandModule'
									value={formData.commandModule}
									onChange={handleChange}
									className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Участники миссии
							</label>
							{formData.crewMembers.map((member, index) => (
								<div key={index} className='flex gap-2 mb-2'>
									<input
										type='text'
										value={member}
										onChange={(e) =>
											handleCrewMemberChange(index, e.target.value)
										}
										className='flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
										placeholder='Имя участника'
									/>
									{formData.crewMembers.length > 1 && (
										<button
											type='button'
											onClick={() => removeCrewMember(index)}
											className='px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
										>
											Удалить
										</button>
									)}
								</div>
							))}
							<button
								type='button'
								onClick={addCrewMember}
								className='mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'
							>
								Добавить участника
							</button>
						</div>

						{errors.submit && (
							<div className='p-3 bg-red-100 text-red-700 rounded-md'>
								{errors.submit}
							</div>
						)}

						<div className='flex justify-between'>
							<button
								type='button'
								onClick={() => navigate('/missions')}
								className='bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200'
							>
								К списку миссий
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

export default CreateMission
