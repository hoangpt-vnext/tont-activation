import React from 'react';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Promotion, View } from '../types';

interface ProgramDetailPageProps {
  program?: Promotion;
  onBack: () => void;
  setCurrentView: (view: View) => void;
}

const ProgramDetailPage: React.FC<ProgramDetailPageProps> = ({ program, onBack, setCurrentView }) => {
  if (!program) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy chương trình</h2>
            <button onClick={onBack} className="text-green-700 hover:underline">Quay lại trang chủ</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Image */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <img 
            src={program.image} 
            alt={program.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        
        <div className="absolute top-6 left-4 sm:left-8 z-10">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại</span>
            </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
                <span className="inline-block px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-full mb-4">
                    {program.brand}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {program.title}
                </h1>
            </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-6 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>{program.brand}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Đang diễn ra</span>
                </div>
            </div>

            <div className="prose prose-lg max-w-none prose-green prose-img:rounded-xl">
                {/* Render content handling newlines */}
                {program.content ? (
                    program.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                            {paragraph}
                        </p>
                    ))
                ) : (
                    <p className="text-gray-500 italic">Chưa có nội dung chi tiết cho chương trình này.</p>
                )}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bạn muốn tham gia sự kiện này?</h3>
                <button 
                    onClick={() => setCurrentView('schedule')}
                    className="px-8 py-3 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition-colors shadow-lg hover:shadow-green-700/30"
                >
                    Tra cứu lịch trình ngay
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage;