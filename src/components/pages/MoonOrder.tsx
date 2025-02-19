import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MoonOrder: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [signedImage, setSignedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Пожалуйста, загрузите изображение');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Пожалуйста, загрузите изображение');
    }
  };

  const handleSubmit = async () => {
    if (!image || !message) {
      setError('Пожалуйста, загрузите изображение и введите сообщение');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('message', message);

    try {
      const response = await fetch('http://jjxhzny-m2.wsr.ru/api-kosmos/moon-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create moon order');

      const data = await response.json();
      setSignedImage(data.signedImage);
    } catch (err) {
      setError('Ошибка при создании заказа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Заказ на Луне</h1>

          <div className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Перетащите изображение сюда или
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Выберите файл
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текстовое сообщение
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                placeholder="Введите ваше сообщение..."
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {signedImage && (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Ваш заказ с водяным знаком</h2>
                <img
                  src={signedImage}
                  alt="Signed"
                  className="max-h-64 mx-auto rounded-lg"
                />
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => navigate('/gagarin')}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                На главную
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !image || !message}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Обработка...' : 'Сделать подпись'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoonOrder;