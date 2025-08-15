import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, Users, Flag, Heart, Star, ArrowRight, ChevronDown, Award, MessageCircle } from 'lucide-react';
import RegistrationForm from './components/RegistrationForm';
import ParticipantTable from './components/ParticipantTable';
import { getParticipantsWithCompetitions, getParticipantCount, getCompetitionStats, RegistrationFormData } from './services/competitionService';
import { ParticipantWithCompetitions } from './lib/supabase';

const heroes = [
  {
    name: 'Ir. Soekarno',
    role: 'Presiden Pertama RI',
    birth: '1901-1970',
    achievement: 'Proklamator Kemerdekaan Indonesia',
    image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    name: 'Drs. Mohammad Hatta',
    role: 'Wakil Presiden Pertama',
    birth: '1902-1980',
    achievement: 'Bapak Koperasi Indonesia',
    image: 'https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    name: 'R.A. Kartini',
    role: 'Pahlawan Emansipasi Wanita',
    birth: '1879-1904',
    achievement: 'Pelopor Kebangkitan Perempuan Indonesia',
    image: 'https://images.pexels.com/photos/8112173/pexels-photo-8112173.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    name: 'Cut Nyak Dhien',
    role: 'Pahlawan Perang Aceh',
    birth: '1848-1908',
    achievement: 'Pejuang Kemerdekaan dari Aceh',
    image: 'https://images.pexels.com/photos/8566471/pexels-photo-8566471.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const timeline = [
  // 16 Agustus 2025 (Sabtu)
  { time: '07.45 – 08.00', event: 'Pembukaan Acara', description: '16 Agustus 2025 (Sabtu)', isDate: true },
  { time: '08.00 – 08.30', event: 'Lomba Bendera Tingkat TK/PAUD', description: 'Kompetisi untuk anak-anak usia dini' },
  { time: '08.30 – 09.00', event: 'Lomba Kelereng', description: 'Permainan tradisional Indonesia' },
  { time: '09.00 – 09.30', event: 'Lomba Makan Kerupuk', description: 'Lomba makan kerupuk tanpa menggunakan tangan' },
  { time: '09.30 – 10.00', event: 'Lomba Balap Karung', description: 'Lomba lari menggunakan karung goni' },
  { time: '10.00 – 10.30', event: 'Lomba Memecahkan Balon', description: 'Kompetisi memecahkan balon dengan cara unik' },
  { time: '10.30 – 11.00', event: 'Lomba Memindahkan Air', description: 'Lomba memindahkan Air Ember Ke Ember' },
  { time: '12.00 – 16.00', event: 'I S T I R A H A T', description: 'Waktu istirahat dan makan siang' },
  { time: '16.00 – 16.30', event: 'Lomba Sepeda Hias / Karnaval', description: 'Karnaval keliling Cluster Kalita' },
  { time: '16.30 – 17.00', event: 'Penutupan Hari Pertama', description: 'Penutupan acara hari pertama' },
  // 17 Agustus 2025 (Minggu)
  { time: '20.00 – Selesai', event: 'Tasyakuran & Pembagian Hadiah', description: '17 Agustus 2025 (Minggu)', isDate: true }
];

const quizQuestions = [
  {
    question: 'Kapan Indonesia memproklamasikan kemerdekaan?',
    options: ['17 Agustus 1945', '17 Agustus 1944', '17 Agustus 1946', '17 Agustus 1947'],
    correct: 0
  },
  {
    question: 'Siapa yang membacakan teks proklamasi?',
    options: ['Mohammad Hatta', 'Ir. Soekarno', 'Sutan Sjahrir', 'Tan Malaka'],
    correct: 1
  },
  {
    question: 'Di mana proklamasi kemerdekaan dibacakan?',
    options: ['Istana Merdeka', 'Gedung Sate', 'Jalan Pegangsaan Timur No. 56', 'Monas'],
    correct: 2
  },
  {
    question: 'Apa bunyi awal teks proklamasi?',
    options: ['Kami bangsa Indonesia', 'Dengan ini kami', 'Hari ini tanggal', 'Proklamasi'],
    correct: 0
  }
];

const competitions = [
  { name: 'Lomba Makan Kerupuk', winner: '', time: '-' },
  { name: 'Lomba Balap Karung', winner: '', time: '-' },
  { name: 'Lomba Memecahkan Balon', winner: '-', time: '-' },
  { name: 'Lomba Bendera', winner: '-', time: '-' },
  { name: 'Lomba Kelereng', winner: '-', time: '-' },
  { name: 'Lomba Memindahkan Air', winner: '-', time: '-' },
  { name: 'Lomba Tarik Tambang', winner: '-', time: '-' }
];

const donors = [
  { name: 'Bapak Ahmad Rizki', amount: 'Rp 500.000', date: '10 Agustus 2025' },
  { name: 'Ibu Siti Nurhaliza', amount: 'Rp 300.000', date: '11 Agustus 2025' },
  { name: 'Keluarga Budi Santoso', amount: 'Rp 750.000', date: '12 Agustus 2025' },
  { name: 'RT 05 Blok A', amount: 'Rp 1.000.000', date: '13 Agustus 2025' },
  { name: 'Ibu Dewi Kartika', amount: 'Rp 200.000', date: '14 Agustus 2025' },
  { name: 'Bapak Andi Wijaya', amount: 'Rp 400.000', date: '15 Agustus 2025' }
];

function App() {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [participants, setParticipants] = useState<ParticipantWithCompetitions[]>([]);
  const [showParticipantTable, setShowParticipantTable] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [competitionStats, setCompetitionStats] = useState({
    childCompetitions: 0,
    adultIndividualCompetitions: 0,
    adultGroupCompetitions: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load participants and stats
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [participantsData, count, stats] = await Promise.all([
        getParticipantsWithCompetitions(),
        getParticipantCount(),
        getCompetitionStats()
      ]);
      
      setParticipants(participantsData);
      setParticipantCount(count);
      setCompetitionStats(stats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let targetDate = new Date(currentYear, 7, 17); // August 17
      
      if (now > targetDate) {
        targetDate = new Date(currentYear + 1, 7, 17);
      }
      
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    
    return () => clearInterval(timer);
  }, []);

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === quizQuestions[currentQuiz].correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuiz < quizQuestions.length - 1) {
        setCurrentQuiz(currentQuiz + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuiz(0);
    setScore(0);
    setQuizStarted(false);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleRegistrationSubmit = async (formData: RegistrationFormData) => {
    // Reload data after successful registration
    await loadData();
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '6281234567890'; // Ganti dengan nomor WhatsApp yang sesuai
    const message = encodeURIComponent('Halo! Saya ingin bertanya tentang acara 17 Agustus di Cluster Kalita.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDonationClick = () => {
    const phoneNumber = '6282260711961';
    const message = encodeURIComponent('Halo! Saya ingin berdonasi untuk acara 17 Agustus di Cluster Kalita. Mohon informasi cara donasi dan rekening yang bisa digunakan.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full opacity-10 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300 rounded-full opacity-15"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="mb-8">
            <Flag className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              17 AGUSTUS
            </h1>
            <p className="text-2xl md:text-3xl font-semibold mb-2">HARI KEMERDEKAAN</p>
            <p className="text-xl md:text-2xl opacity-90">REPUBLIK INDONESIA</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center justify-center">
              <Clock className="w-6 h-6 mr-2" />
              Countdown ke 17 Agustus
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-red-500 bg-opacity-50 rounded-lg p-4">
                <div className="text-3xl font-bold">{timeLeft.days}</div>
                <div className="text-sm">Hari</div>
              </div>
              <div className="bg-red-500 bg-opacity-50 rounded-lg p-4">
                <div className="text-3xl font-bold">{timeLeft.hours}</div>
                <div className="text-sm">Jam</div>
              </div>
              <div className="bg-red-500 bg-opacity-50 rounded-lg p-4">
                <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                <div className="text-sm">Menit</div>
              </div>
              <div className="bg-red-500 bg-opacity-50 rounded-lg p-4">
                <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                <div className="text-sm">Detik</div>
              </div>
            </div>
          </div>
          
          <ChevronDown className="w-8 h-8 animate-bounce mx-auto" />
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">📅 Timeline Acara – 16 & 17 Agustus 2025</h2>
            <p className="text-xl text-gray-600">Jadwal lengkap perayaan HUT RI di Cluster Kalita</p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-red-600 h-full"></div>
            
            {timeline.map((item, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                    item.isDate 
                      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
                      : item.event === 'I S T I R A H A T'
                        ? 'bg-gradient-to-br from-yellow-50 to-yellow-100'
                        : 'bg-gradient-to-br from-red-50 to-red-100'
                  }`}>
                    <div className={`text-lg font-bold mb-2 ${
                      item.isDate ? 'text-yellow-200' : 'text-red-700'
                    }`}>{item.time}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.event}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg ${
                  item.isDate ? 'bg-red-700' : 'bg-red-600'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">📝 Catatan Penting</h2>
            <p className="text-xl text-gray-600">Informasi penting untuk semua peserta</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
              <div className="flex items-start mb-4">
                <Clock className="w-8 h-8 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Waktu Kedatangan</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Peserta lomba diharapkan hadir <strong>30 menit sebelum lomba dimulai</strong> untuk persiapan dan briefing.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
              <div className="flex items-start mb-4">
                <Trophy className="w-8 h-8 text-green-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Karnaval Sepeda Hias</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Bagi peserta Karnaval Sepeda Hias, harap membawa sepeda yang sudah <strong>dihias sesuai tema kemerdekaan</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
              <div className="flex items-start mb-4">
                <Users className="w-8 h-8 text-orange-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Konsumsi</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Panitia menyediakan <strong>konsumsi untuk peserta dan penonton</strong> selama acara berlangsung.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
              <div className="flex items-start mb-4">
                <Heart className="w-8 h-8 text-red-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Kebersihan & Ketertiban</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Tetap jaga <strong>kebersihan & ketertiban</strong> selama acara berlangsung untuk kenyamanan bersama.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <Star className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Cluster Kalita</h2>
            <p className="text-xl opacity-90">Merdekaaaaaa!!!!!</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 overflow-hidden">
            <img 
              src="https://fhouvucedreehcupbyua.supabase.co/storage/v1/object/public/galeri1/Merah%20Putih%20Modern%20Background%20Panggung%20Acara%20Semarak%20HUT%20RI%20Spanduk%20Banner_page-0001.jpg"
              alt="Spanduk HUT RI - Semarak Perayaan Kemerdekaan Indonesia"
              className="w-full h-auto rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              loading="lazy"
            />
            <div className="mt-6 text-center">
              <p className="text-lg opacity-90">
                Spanduk resmi perayaan HUT RI dengan desain modern yang memadukan warna merah putih
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Users className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Info Hari Ini</h2>
            <p className="text-xl text-gray-600">Daftarkan Segera</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-red-600 mb-2">{isLoading ? '...' : participantCount}</div>
              <div className="text-gray-700 font-semibold">Total Peserta</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">{isLoading ? '...' : competitionStats.childCompetitions}</div>
              <div className="text-gray-700 font-semibold">Lomba Anak</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">{isLoading ? '...' : competitionStats.adultIndividualCompetitions}</div>
              <div className="text-gray-700 font-semibold">Lomba Dewasa</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-yellow-600 mb-2">{isLoading ? '...' : competitionStats.adultGroupCompetitions}</div>
              <div className="text-gray-700 font-semibold">Lomba Kelompok</div>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Results */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Award className="w-16 h-16 mx-auto mb-4 text-orange-600" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Hasil Lomba 17 Agustus</h2>
            <p className="text-xl text-gray-600 mb-8">Para juara lomba kemerdekaan</p>
            
            <button
              onClick={() => setShowRegistrationForm(true)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-8"
            >
              🏆 Daftar Lomba Sekarang
            </button>
            
            <button
              onClick={() => setShowParticipantTable(!showParticipantTable)}
              className="ml-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-8"
            >
              📋 {showParticipantTable ? 'Sembunyikan' : 'Lihat'} Daftar Peserta ({isLoading ? '...' : participantCount})
            </button>
          </div>
          
          {showParticipantTable && (
            <div className="mb-16">
              <ParticipantTable participants={participants} />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {competitions.map((comp, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{comp.name}</h3>
                    <p className="text-orange-600 font-semibold mb-1">🏆 Juara: {comp.winner}</p>
                    <p className="text-gray-600">⏱️ Waktu: {comp.time}</p>
                  </div>
                  <div className="text-4xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Heart className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">💝 Donasi & Dukungan</h2>
            <p className="text-xl text-gray-600 mb-8">Terima kasih kepada para donatur yang telah mendukung acara 17 Agustus</p>
            
            <button
              onClick={handleDonationClick}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-12"
            >
              💚 Donasi Sekarang
            </button>
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Flag className="w-8 h-8 mr-2 text-red-500" />
                <h3 className="text-2xl font-bold">Indonesia Merdeka</h3>
              </div>
              <p className="text-gray-300">
                Merayakan kemerdekaan Indonesia dengan penuh kebanggaan dan semangat persatuan.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4">Link Berguna</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-red-400 transition-colors">Sejarah Indonesia</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Pahlawan Nasional</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Budaya Indonesia</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Wisata Indonesia</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4">Kontak</h4>
              <div className="text-gray-300 space-y-2">
                <p>🇮🇩 Republik Indonesia</p>
                <p>📧 info@indonesia.go.id</p>
                <p>🌐 www.indonesia.go.id</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-300">
              © 2025 Website 17 Agustus. Dibuat dengan 🇮🇩 untuk Indonesia.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              "Merdeka atau Mati!" - Bung Tomo
            </p>
          </div>
        </div>
      </footer>
      
      {/* Registration Form Modal */}
      <RegistrationForm 
        isOpen={showRegistrationForm} 
        onClose={() => setShowRegistrationForm(false)} 
        onSubmit={handleRegistrationSubmit}
      />
      
      {/* WhatsApp Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse"
          title="Chat via WhatsApp"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}

export default App;