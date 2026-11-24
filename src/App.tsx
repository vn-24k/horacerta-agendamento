import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Share2, 
  Download, 
  Settings, 
  X, 
  Scissors, 
  Stethoscope, 
  Briefcase, 
  ShieldCheck, 
  User, 
  Check, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  duration: number; // minutos
  price: number;
  description: string;
}

interface Professional {
  id: string;
  name: string;
  role: string;
  category: string;
  icon: 'health' | 'barber' | 'consulting';
  bio: string;
  location: string;
  whatsapp: string;
  avatar: string;
  services: Service[];
}

const PROFISSIONAIS: Professional[] = [
  {
    id: 'dr-marcelo',
    name: 'Dr. Marcelo Fonseca',
    role: 'Fisioterapeuta & Quiropraxista (CREFITO 41289)',
    category: 'Saúde & Reabilitação',
    icon: 'health',
    bio: 'Especialista em alívio de dores na coluna, hérnia de disco e reabilitação postural para quem trabalha sentado.',
    location: 'Av. Paulista, 1800 - Sala 82, Bela Vista - São Paulo/SP',
    whatsapp: '5511999998888',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
    services: [
      {
        id: 's1',
        name: 'Sessão de Quiropraxia & Alinhamento',
        duration: 45,
        price: 180,
        description: 'Diagnóstico postural completo e ajustes articulares com alívio imediato da tensão cervical e lombar.'
      },
      {
        id: 's2',
        name: 'Tratamento de Dor Crônica & Dry Needling',
        duration: 60,
        price: 240,
        description: 'Terapia manual combinada com agulhamento a seco para pontos de gatilho miofasciais.'
      },
      {
        id: 's3',
        name: 'Avaliação Postural Computadorizada',
        duration: 30,
        price: 120,
        description: 'Mapeamento biomecânico e plano preventivo individualizado para postura no home office.'
      }
    ]
  },
  {
    id: 'navalha-urbana',
    name: 'Estúdio Navalha & Barba',
    role: 'Barbearia Clássica & Visagismo Masculino',
    category: 'Estilo & Bem-Estar',
    icon: 'barber',
    bio: 'Cortes sob medida, toalha quente e acabamento artesanal com navalha em ambiente reservado.',
    location: 'Rua Augusta, 1420 - Consolação - São Paulo/SP',
    whatsapp: '5511988887777',
    avatar: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=300&auto=format&fit=crop',
    services: [
      {
        id: 's4',
        name: 'Corte de Cabelo com Visagismo',
        duration: 40,
        price: 75,
        description: 'Lente visagista para valorizar o formato do rosto, lavagem e finalização com pomada matte.'
      },
      {
        id: 's5',
        name: 'Barboterapia com Toalha Quente',
        duration: 35,
        price: 65,
        description: 'Esfoliação, hidratação profunda com óleos essenciais, massagem facial e navalha afiada.'
      },
      {
        id: 's6',
        name: 'Combo Completo (Cabelo + Barba + Sobrancelha)',
        duration: 70,
        price: 125,
        description: 'Experiência completa para renovar o visual com bebida cortesia.'
      }
    ]
  },
  {
    id: 'consultoria-caetano',
    name: 'Vinicius Caetano Consultoria',
    role: 'Estrategista de Negócios & Arquitetura de Software',
    category: 'Negócios & Tecnologia',
    icon: 'consulting',
    bio: 'Diagnóstico estratégico para produtos digitais, redução de custos em nuvem e soberania de dados.',
    location: 'Atendimento Online (Google Meet / Zoom)',
    whatsapp: '5511976909265',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    services: [
      {
        id: 's7',
        name: 'Mentoria Estratégica 1:1 (60 min)',
        duration: 60,
        price: 350,
        description: 'Sessão cirúrgica de alinhamento de roadmap, validação de produto e decisões críticas de engenharia.'
      },
      {
        id: 's8',
        name: 'Auditoria de Arquitetura & Infraestrutura',
        duration: 90,
        price: 600,
        description: 'Análise aprofundada de gargalos, segurança, bancos de dados e escalabilidade do seu sistema.'
      }
    ]
  }
];

interface Appointment {
  id: string;
  professionalName: string;
  professionalWhatsapp: string;
  service: Service;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:MM
  clientName: string;
  clientPhone: string;
  clientNotes?: string;
  createdAt: string;
}

export default function App() {
  const [selectedProfIndex, setSelectedProfIndex] = useState(0);
  const currentProf = PROFISSIONAIS[selectedProfIndex];

  const [selectedService, setSelectedService] = useState<Service>(currentProf.services[0]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Amanhã como padrão
    return d;
  });
  const [selectedTime, setSelectedTime] = useState<string>('14:30');
  
  // Dados do formulário
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  
  // Estados de navegação
  const [step, setStep] = useState<'select' | 'form' | 'success'>('select');
  const [lastAppointment, setLastAppointment] = useState<Appointment | null>(null);
  
  // Painel de Gestão (Dono do Negócio)
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('horacerta_appointments');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Canvas confetti ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sincroniza serviço padrão ao trocar profissional
  useEffect(() => {
    setSelectedService(currentProf.services[0]);
  }, [selectedProfIndex]);

  // Salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('horacerta_appointments', JSON.stringify(appointmentsList));
    } catch (e) {
      console.error(e);
    }
  }, [appointmentsList]);

  // Disparar confetti procedural ao confirmar
  useEffect(() => {
    if (step === 'success' && canvasRef.current) {
      triggerConfetti(canvasRef.current);
    }
  }, [step]);

  function triggerConfetti(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      vRot: number;
    }> = [];

    const colors = ['#2563EB', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#06B6D4'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -10 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10
      });
    }

    let animationId: number;
    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravidade
        p.rotation += p.vRot;

        if (p.y < canvas.height) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(render);
      }
    }
    render();

    return () => cancelAnimationFrame(animationId);
  }

  // Gera dias do mês
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= totalDaysInMonth; d++) {
    daysArray.push(new Date(year, month, d));
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const timeSlots = [
    '08:30', '09:15', '10:00', '10:45', '11:30',
    '14:00', '14:45', '15:30', '16:15', '17:00', '17:45', '18:30'
  ];

  function isSameDay(d1: Date, d2: Date) {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  function isPastDay(d: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  }

  function handlePrevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function handleNextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function handleFinalizeBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert('Por favor, preencha seu nome e WhatsApp para contato.');
      return;
    }

    const dateFormatted = selectedDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const appointment: Appointment = {
      id: Math.random().toString(36).substring(2, 9),
      professionalName: currentProf.name,
      professionalWhatsapp: currentProf.whatsapp,
      service: selectedService,
      dateStr: dateFormatted,
      timeStr: selectedTime,
      clientName,
      clientPhone,
      clientNotes,
      createdAt: new Date().toISOString()
    };

    setLastAppointment(appointment);
    setAppointmentsList(prev => [appointment, ...prev]);
    setStep('success');
  }

  // Gera link do WhatsApp
  function getWhatsAppUrl(app: Appointment) {
    const msg = `Olá, ${app.professionalName}! 👋\n\n` +
      `Gostaria de confirmar meu agendamento feito pelo HoraCerta:\n\n` +
      `📌 *Serviço:* ${app.service.name}\n` +
      `📅 *Data:* ${app.dateStr}\n` +
      `⏰ *Horário:* ${app.timeStr}\n` +
      `👤 *Cliente:* ${app.clientName}\n` +
      `📱 *WhatsApp:* ${app.clientPhone}\n` +
      (app.clientNotes ? `💬 *Observação:* ${app.clientNotes}\n` : '') +
      `\nAguardo sua confirmação. Muito obrigado!`;

    return `https://wa.me/${app.professionalWhatsapp}?text=${encodeURIComponent(msg)}`;
  }

  // Gera arquivo .ICS de calendário
  function downloadICS(app: Appointment) {
    const now = new Date();
    const [hours, minutes] = app.timeStr.split(':').map(Number);
    const start = new Date(selectedDate);
    start.setHours(hours, minutes, 0);
    const end = new Date(start.getTime() + app.service.duration * 60000);

    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const formatDate = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HoraCerta//Agendamento Inteligente//PT',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:horacerta-${app.id}@local`,
      `DTSTAMP:${formatDate(now)}Z`,
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      `SUMMARY:${app.service.name} - ${app.professionalName}`,
      `DESCRIPTION:Agendamento confirmado com ${app.professionalName}. Local: ${currentProf.location}. Observações: ${app.clientNotes || 'Nenhuma'}`,
      `LOCATION:${currentProf.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `agendamento-${app.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function deleteAppointment(id: string) {
    setAppointmentsList(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Bar de Demonstração / Alternar Profissional */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">Hora<span className="text-blue-600">Certa</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Agendamento Rápido
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Seletor rápido de nicho do mundo real */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
              {PROFISSIONAIS.map((prof, idx) => (
                <button
                  key={prof.id}
                  onClick={() => {
                    setSelectedProfIndex(idx);
                    setStep('select');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedProfIndex === idx 
                      ? 'bg-white text-slate-900 font-semibold shadow-sm' 
                      : 'hover:text-slate-900'
                  }`}
                >
                  {prof.icon === 'health' && '🩺 Fisioterapia'}
                  {prof.icon === 'barber' && '✂️ Barbearia'}
                  {prof.icon === 'consulting' && '💼 Consultoria'}
                </button>
              ))}
            </div>

            {/* Botão Painel do Dono */}
            <button
              onClick={() => setShowAdminModal(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5 text-xs font-medium border border-slate-200 bg-white"
              title="Painel do Profissional"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Painel</span>
              {appointmentsList.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {appointmentsList.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
        {step === 'select' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Coluna da Esquerda: Perfil do Profissional & Serviços */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              {/* Header do Perfil */}
              <div className="flex items-start gap-4">
                <img 
                  src={currentProf.avatar} 
                  alt={currentProf.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
                />
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md mb-1">
                    <ShieldCheck className="w-3 h-3 text-blue-600" /> Profissional Verificado
                  </div>
                  <h1 className="text-xl font-heading font-extrabold text-slate-900 leading-snug">{currentProf.name}</h1>
                  <p className="text-xs text-slate-500 font-medium">{currentProf.role}</p>
                </div>
              </div>

              {/* Bio & Localização */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                <p>{currentProf.bio}</p>
                <div className="flex items-start gap-2 text-xs text-slate-500 pt-1">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{currentProf.location}</span>
                </div>
              </div>

              {/* Seletor de Serviços */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Escolha o Serviço</h2>
                  <span className="text-xs text-slate-400">{currentProf.services.length} opções</span>
                </div>

                <div className="space-y-2.5">
                  {currentProf.services.map(srv => {
                    const isSelected = selectedService.id === srv.id;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-semibold text-sm ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                            {srv.name}
                          </span>
                          <span className="font-bold text-sm text-slate-900 shrink-0">
                            R$ {srv.price}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{srv.description}</p>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 mt-2">
                          <Clock className="w-3 h-3" />
                          <span>Duração: {srv.duration} minutos</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Prova Social Discreta */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 font-bold">★ 4.9</span>
                  <span>(128 avaliações reais)</span>
                </div>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 text-[11px]">
                  Confirmado via WhatsApp
                </span>
              </div>
            </div>

            {/* Coluna da Direita: Calendário & Horários */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">2. Escolha a Data & Horário</h2>
                <p className="text-sm font-semibold text-slate-900">
                  {selectedService.name} • <span className="text-blue-600 font-bold">R$ {selectedService.price}</span> ({selectedService.duration} min)
                </p>
              </div>

              {/* Calendário Interativo */}
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80">
                {/* Header do Mês */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading font-extrabold text-base text-slate-900 capitalize">
                    {monthNames[month]} {year}
                  </span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition"
                      aria-label="Mês Anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition"
                      aria-label="Próximo Mês"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dias da Semana */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
                  <span>Dom</span>
                  <span>Seg</span>
                  <span>Ter</span>
                  <span>Qua</span>
                  <span>Qui</span>
                  <span>Sex</span>
                  <span>Sáb</span>
                </div>

                {/* Grade dos Dias */}
                <div className="grid grid-cols-7 gap-1.5">
                  {daysArray.map((day, idx) => {
                    if (!day) {
                      return <div key={`empty-${idx}`} className="h-10" />;
                    }

                    const isPast = isPastDay(day);
                    const isSelected = isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());
                    const isSunday = day.getDay() === 0;

                    return (
                      <button
                        key={day.toISOString()}
                        disabled={isPast || isSunday}
                        onClick={() => setSelectedDate(day)}
                        className={`h-10 rounded-xl text-xs font-medium flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 scale-105'
                            : isPast || isSunday
                            ? 'text-slate-300 cursor-not-allowed bg-transparent'
                            : 'text-slate-700 hover:bg-blue-100/60 hover:text-blue-900 bg-white border border-slate-200/60'
                        } ${isToday && !isSelected ? 'border-blue-500 font-bold text-blue-600' : ''}`}
                      >
                        <span>{day.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seletor de Horários Disponíveis */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Horários para {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}:
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Vagas em tempo real
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map(time => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botão de Prosseguir */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  <span>Data selecionada: </span>
                  <strong className="text-slate-800">
                    {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} às {selectedTime}
                  </strong>
                </div>

                <button
                  onClick={() => setStep('form')}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/15 flex items-center gap-2 transition hover:gap-3"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 2: Formulário Rápido de Contato */}
        {step === 'form' && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <button
              onClick={() => setStep('select')}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition"
            >
              <ChevronLeft className="w-4 h-4" /> Voltar para o calendário
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Etapa Final
              </span>
              <h1 className="text-2xl font-heading font-extrabold text-slate-900 mt-2">Quem vai comparecer?</h1>
              <p className="text-xs text-slate-500 mt-1">
                Seus dados serão usados exclusivamente para confirmar seu horário pelo WhatsApp.
              </p>
            </div>

            {/* Resumo do Horário Escolhido */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span>Profissional:</span>
                <strong className="text-slate-800">{currentProf.name}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Serviço:</span>
                <strong className="text-slate-800">{selectedService.name} (R$ {selectedService.price})</strong>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Data & Horário:</span>
                <strong className="text-blue-600 font-bold">
                  {selectedDate.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'long' })} às {selectedTime}
                </strong>
              </div>
            </div>

            <form onSubmit={handleFinalizeBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Seu Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo Silva"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Seu WhatsApp com DDD *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98765-4321"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alguma observação ou queixa principal? (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Dor na lombar ao ficar muito tempo sentado / Prefiro cabelo mais curto nas laterais..."
                  value={clientNotes}
                  onChange={e => setClientNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-5 h-5" />
                Confirmar Agendamento
              </button>
            </form>
          </div>
        )}

        {/* ETAPA 3: Tela de Sucesso & Envio no WhatsApp */}
        {step === 'success' && lastAppointment && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center relative overflow-hidden space-y-6">
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 w-full h-full" />

            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner relative z-20">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="relative z-20">
              <h1 className="text-2xl font-heading font-extrabold text-slate-900">Horário Pré-Agendado!</h1>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
                Parabéns, {lastAppointment.clientName}! Seu horário foi reservado. Para finalizar, clique no botão abaixo para avisar o profissional no WhatsApp.
              </p>
            </div>

            {/* Cartão de Confirmação */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 relative z-20 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-medium">Profissional:</span>
                <span className="font-bold text-slate-900">{lastAppointment.professionalName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-medium">Serviço:</span>
                <span className="font-bold text-slate-900">{lastAppointment.service.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-medium">Quando:</span>
                <span className="font-bold text-blue-600">{lastAppointment.dateStr} às {lastAppointment.timeStr}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Investimento:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  R$ {lastAppointment.service.price} ({lastAppointment.service.duration} min)
                </span>
              </div>
            </div>

            {/* Ações: Enviar WhatsApp + Baixar Calendário */}
            <div className="space-y-3 relative z-20">
              <a
                href={getWhatsAppUrl(lastAppointment)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4 fill-white" />
                Confirmar no WhatsApp do Profissional
                <ExternalLink className="w-4 h-4 opacity-75" />
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadICS(lastAppointment)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  Salvar na Agenda (.ICS)
                </button>

                <button
                  onClick={() => {
                    setStep('select');
                    setClientName('');
                    setClientNotes('');
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs transition"
                >
                  Novo Agendamento
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Painel do Profissional (Gerenciar Agendamentos) */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900">Painel do Dono do Negócio</h3>
                <p className="text-xs text-slate-500">Agendamentos recebidos e salvos no navegador (Local-First)</p>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {appointmentsList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <CalendarIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  Nenhum agendamento registrado ainda. Faça um teste na página!
                </div>
              ) : (
                appointmentsList.map(app => (
                  <div key={app.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-slate-900">{app.clientName}</strong>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                          {app.service.name}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        📅 <strong>{app.dateStr}</strong> às <strong>{app.timeStr}</strong>
                      </p>
                      <p className="text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {app.clientPhone}
                        {app.clientNotes && <span className="italic ml-2">Obs: "{app.clientNotes}"</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={getWhatsAppUrl(app)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold flex items-center gap-1 hover:bg-emerald-700"
                      >
                        <Phone className="w-3 h-3 fill-white" /> WhatsApp
                      </a>
                      <button
                        onClick={() => deleteAppointment(app.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
              <span>Total de agendamentos: <strong>{appointmentsList.length}</strong></span>
              <button
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Profissional */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} HoraCerta — Desenvolvido por <strong className="text-slate-800">Vinicius Caetano</strong>.</p>
          <p className="flex items-center gap-1">
            <span>Tecnologia ágil para profissionais autônomos</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">100% Livre de Spam</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
