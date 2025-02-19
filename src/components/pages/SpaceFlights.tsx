import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

interface Flight {
	id: number
	flightNumber: string
	destination: string
	launchDate: string
	seats: number
	availableSeats: number
}

const SpaceFlights: React.FC = () => {
	const [flights, setFlights] = useState<Flight[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [showModal, setShowModal] = useState(false)
	const [modalMessage, setModalMessage] = useState('')
	const navigate = useNavigate()

	const fetchFlights = async () => {
		try {
			const response = await fetch(
				'http://jjxhzny-m2.wsr.ru/api-kosmos/flights',
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				},
			)

			if (!response.ok) throw new Error('Failed to fetch flights')

			const data = await response.json()
			setFlights(data)
		} catch (err) {
			setError('Ошибка при загрузке рейсов')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchFlights()
	}, [])

	const handleBookFlight = async (flightId: number) => {
		try {
			const response = await fetch(
				`http://jjxhzny-m2.wsr.ru/api-kosmos/flights/${flightId}/book`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				},
			)

			const data = await response.json()

			if (response.ok) {
				setModalMessage('Вы успешно записались на рейс!')
				await fetchFlights()
			} else {
				setModalMessage(data.message || 'Превышен лимит на запись рейса')
			}
			setShowModal(true)
		} catch {
			setModalMessage('Ошибка при записи на рейс')
			setShowModal(true)
		}
	}

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-[50vh]'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		)
	}

	if (error) {
		return (
			<div
				className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
				role='alert'
			>
				<strong className='font-bold'>Ошибка!</strong>
				<span className='block sm:inline'> {error}</span>
			</div>
		)
	}

	return (
		<div className='max-w-4xl mx-auto mt-8'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-3xl font-bold text-gray-800'>Космические рейсы</h1>
				<div className='space-x-4'>
					<button
						onClick={() => navigate('/flights/create')}
						className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200'
					>
						Добавить рейс
					</button>
					<button
						onClick={() => navigate('/gagarin')}
						className='bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200'
					>
						На главную страницу
					</button>
				</div>
			</div>

			<div className='grid gap-4'>
				{flights.map((flight) => (
					<div key={flight.id} className='bg-white shadow-lg rounded-lg p-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							<div>
								<h3 className='text-lg font-semibold text-gray-800'>
									Рейс #{flight.flightNumber}
								</h3>
								<p className='text-gray-600'>
									Место прибытия: {flight.destination}
								</p>
							</div>
							<div>
								<p className='text-gray-600'>
									Дата запуска:{' '}
									{new Date(flight.launchDate).toLocaleDateString()}
								</p>
								<p className='text-gray-600'>
									Доступно мест: {flight.availableSeats} из {flight.seats}
								</p>
							</div>
							<div className='flex items-center justify-end'>
								<button
									onClick={() => handleBookFlight(flight.id)}
									disabled={flight.availableSeats === 0}
									className={`px-4 py-2 rounded-md ${
										flight.availableSeats === 0
											? 'bg-gray-400 cursor-not-allowed'
											: 'bg-blue-600 hover:bg-blue-700'
									} text-white transition-colors duration-200`}
								>
									{flight.availableSeats === 0 ? 'Нет мест' : 'Записаться'}
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{showModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
					<div className='bg-white rounded-lg p-6 max-w-sm w-full'>
						<h3 className='text-lg font-semibold mb-4'>{modalMessage}</h3>
						<button
							onClick={() => setShowModal(false)}
							className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200'
						>
							Закрыть
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default SpaceFlights
