import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/gps.png'

const NAV_LINKS = [
  { label: 'Funcionalidades', href: '#features' },
  { label: 'Como funciona', href: '#how-it-works' },
  { label: 'Evolução', href: '#growth' },
  { label: 'Segurança', href: '#security' },
]

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Tutores e Pacientes',
    desc: 'Cadastre tutores e animais e mantenha as principais informações organizadas em um único lugar.',
    color: 'bg-teal-50',
    accent: 'text-teal-700',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: 'Agenda e Consultas',
    desc: 'Organize consultas e compromissos, acompanhe os horários e registre o status de cada atendimento.',
    color: 'bg-amber-50',
    accent: 'text-amber-700',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'Prontuário Eletrônico',
    desc: 'Centralize o histórico clínico do animal e mantenha seus registros organizados e acessíveis.',
    color: 'bg-blue-50',
    accent: 'text-blue-700',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: 'Vacinação',
    desc: 'Registre as vacinas aplicadas e acompanhe as próximas doses e pendências de cada paciente.',
    color: 'bg-green-50',
    accent: 'text-green-700',
  },
]

const ROADMAP_STAGES = [
  {
    label: 'MVP atual',
    desc: 'Animais, tutores, agenda, consultas, prontuários e vacinação formam a base atual do UniVet.',
    icon: '🐾',
  },
  {
    label: 'Próximos recursos',
    desc: 'Financeiro, estoque, leitos / internação e notificações estão planejados para futuras versões do sistema.',
    icon: '📈',
  },
  {
    label: 'Visão futura',
    desc: 'Integração com WhatsApp, aplicativo mobile, portal do tutor e recursos para múltiplas unidades.',
    icon: '🚀',
  },
]

const SECURITY_ITEMS = [
  {
    title: 'Proteção de dados',
    desc: 'Dados tratados com minimização, controle de acesso por organização e auditoria de ações críticas.',
  },
  {
    title: 'Acesso por função',
    desc: 'Diferentes perfis de usuário possuem permissões de acordo com suas responsabilidades no sistema.',
  },
  {
    title: 'Prontuário protegido',
    desc: 'Registros clínicos e alterações importantes possuem controle e rastreabilidade das ações.',
  },
  {
    title: 'Autenticação segura',
    desc: 'O acesso ao sistema utiliza autenticação e gerenciamento seguro das credenciais dos usuários.',
  },
]

const ANIMAL_CENTER = [
  {
    label: 'Tutor',
    color: 'bg-amber-100 text-amber-800',
    pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
  },
  {
    label: 'Consultas',
    color: 'bg-blue-100 text-blue-800',
    pos: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
  },
  {
    label: 'Prontuário',
    color: 'bg-purple-100 text-purple-800',
    pos: 'bottom-0 right-1/4 translate-y-1/2',
  },
  {
    label: 'Vacinação',
    color: 'bg-green-100 text-green-800',
    pos: 'bottom-0 left-1/4 translate-y-1/2',
  },
  {
    label: 'Exames',
    color: 'bg-rose-100 text-rose-800',
    pos: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
  },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F7F5F0]/90 backdrop-blur-sm border-b border-[#D8D5CE]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img src={logo} alt="UniVet" className="w-full h-full object-contain" />
          </div>

          <span
            className="font-semibold text-[#0C1A1A] text-lg tracking-tight"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            UniVet
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#4A5568] hover:text-[#0C4A45] transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-[#0C4A45] hover:opacity-80 transition-opacity px-4 py-2"
          >
            Entrar
          </Link>

          <Link
            to="/cadastro"
            className="text-sm font-semibold bg-[#E05C2A] text-white px-5 py-2 rounded-[10px] hover:bg-[#C4501F] transition-colors"
          >
            Criar conta
          </Link>
        </div>

        <button
          className="md:hidden text-[#0C1A1A]"
          onClick={() => setOpen(!open)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-6 h-6"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#F7F5F0] border-t border-[#D8D5CE] px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#4A5568]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}

          <hr className="border-[#D8D5CE]" />

          <Link to="/login" className="text-sm font-medium text-[#0C4A45]">
            Entrar
          </Link>

          <Link
            to="/cadastro"
            className="text-sm font-semibold bg-[#E05C2A] text-white px-5 py-2.5 rounded-[10px] text-center"
          >
            Criar conta
          </Link>
        </div>
      )}
    </nav>
  )
}

function HeroDashboard() {
  return (
    <div className="relative bg-white rounded-2xl shadow-2xl shadow-teal-900/10 border border-[#D8D5CE] overflow-hidden w-full max-w-[560px]">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0C4A45] text-white">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
        </div>

        <span className="text-xs font-medium ml-2 opacity-80">
          Dashboard — Dados demonstrativos
        </span>
      </div>

      <div className="flex">
        <div className="w-14 bg-[#0a3d38] flex flex-col items-center py-4 gap-5">
          {[
            <path key="h" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
            <>
              <path key="u" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle key="c" cx="9" cy="7" r="4" />
            </>,
            <>
              <rect key="r" x="3" y="4" width="18" height="18" rx="2" />
              <line key="l" x1="3" y1="10" x2="21" y2="10" />
            </>,
            <path key="f" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />,
          ].map((path, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                index === 0 ? 'bg-white/20' : 'hover:bg-white/10'
              } cursor-pointer`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                className="w-4 h-4"
              >
                {path}
              </svg>
            </div>
          ))}
        </div>

        <div className="flex-1 p-4 bg-[#F7F5F0]">
          <p className="text-xs font-semibold text-[#0C4A45] mb-3 uppercase tracking-wider">
            Visão geral
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              {
                n: '8',
                l: 'Consultas hoje',
                c: 'bg-[#0C4A45] text-white',
              },
              {
                n: '2',
                l: 'Aguardando',
                c: 'bg-amber-100 text-amber-800',
              },
              {
                n: '3',
                l: 'Vacinas próximas',
                c: 'bg-rose-100 text-rose-700',
              },
            ].map((stat) => (
              <div key={stat.l} className={`${stat.c} rounded-xl p-2.5`}>
                <p className="text-xl font-bold leading-none">{stat.n}</p>
                <p className="text-[10px] mt-1 opacity-80 leading-tight">
                  {stat.l}
                </p>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
            Próximas consultas
          </p>

          <div className="space-y-1.5">
            {[
              {
                hora: '09:00',
                animal: 'Thor',
                especie: 'Cão · Golden Ret.',
                status: 'Confirmada',
                cor: 'bg-green-100 text-green-700',
              },
              {
                hora: '10:30',
                animal: 'Luna',
                especie: 'Gato · Siamês',
                status: 'Agendada',
                cor: 'bg-blue-100 text-blue-700',
              },
              {
                hora: '11:00',
                animal: 'Max',
                especie: 'Cão · Bulldog Fr.',
                status: 'Em atendimento',
                cor: 'bg-amber-100 text-amber-700',
              },
            ].map((consulta) => (
              <div
                key={consulta.animal}
                className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm"
              >
                <span className="text-[10px] font-mono text-[#6B7280] w-10 shrink-0">
                  {consulta.hora}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#0C1A1A] truncate">
                    {consulta.animal}
                  </p>
                  <p className="text-[10px] text-[#6B7280] truncate">
                    {consulta.especie}
                  </p>
                </div>

                <span
                  className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${consulta.cor} shrink-0`}
                >
                  {consulta.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="min-h-screen pt-16 flex items-center bg-[#F7F5F0] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#E8F4F0] text-[#0C4A45] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0C4A45]" />
              Gestão veterinária centrada no animal
            </div>

            <h1
              className="text-5xl lg:text-6xl leading-[1.1] font-normal text-[#0C1A1A] mb-6"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              Sua clínica.
              <br />
              <em>Seus pacientes.</em>
              <br />
              Tudo organizado.
            </h1>

            <p className="text-lg text-[#4A5568] leading-relaxed mb-8 max-w-md">
              O UniVet centraliza tutores, animais, consultas, prontuários e
              vacinação em um único ambiente.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/cadastro"
                className="inline-flex items-center gap-2 bg-[#E05C2A] text-white font-semibold px-6 py-3 rounded-[10px] hover:bg-[#C4501F] transition-colors text-sm"
              >
                Criar minha conta

                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  />
                </svg>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[#0C4A45] font-semibold px-6 py-3 rounded-[10px] border border-[#0C4A45]/30 hover:bg-[#0C4A45]/5 transition-colors text-sm"
              >
                Entrar
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroDashboard />
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-[#D8D5CE]">
          <p className="text-xs text-[#9CA3AF] text-center mb-6 uppercase tracking-widest font-medium">
            Pensado para diferentes rotinas veterinárias
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-[#6B7280]">
            {[
              'Autônomos',
              'Consultórios',
              'Clínicas',
            ].map((text) => (
              <span key={text} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0C4A45]/40" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2
            className="text-4xl font-normal text-[#0C1A1A] mb-4"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            Funcionalidades para a rotina,
            <br />
            <em>sem complicação</em>
          </h2>

          <p className="text-[#6B7280] max-w-xl mx-auto">
            O MVP do UniVet reúne os principais recursos para organizar a
            rotina veterinária e centralizar as informações dos pacientes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-[#EAE8E3] hover:border-[#0C4A45]/30 hover:shadow-lg hover:shadow-teal-900/5 transition-all bg-white"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.color} ${feature.accent} flex items-center justify-center mb-4`}
              >
                {feature.icon}
              </div>

              <h3 className="font-semibold text-[#0C1A1A] mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-[#6B7280] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AnimalCenterSection() {
  return (
    <section id="how-it-works" className="py-24 bg-[#F7F5F0]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#E8F4F0] text-[#0C4A45] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              Conceito do UniVet
            </div>

            <h2
              className="text-4xl font-normal text-[#0C1A1A] mb-6"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              O animal no
              <br />
              <em>centro de tudo</em>
            </h2>

            <p className="text-[#4A5568] leading-relaxed mb-6">
              No UniVet, as principais informações da rotina veterinária são
              organizadas a partir do paciente. Tutores, consultas, prontuários
              e vacinação ficam conectados ao histórico do animal.
            </p>

            <div className="space-y-3">
              {[
                'Tutor → Animal → Consultas → Prontuário',
                'Histórico clínico organizado',
                'Informações importantes centralizadas por animal',
                'Acompanhamento das vacinas e pendências',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#0C4A45] flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      className="w-3 h-3"
                    >
                      <polyline
                        points="2 6 5 9 10 3"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <p className="text-sm text-[#4A5568]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D8D5CE]" />
              <div className="absolute inset-8 rounded-full border border-[#D8D5CE]" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#0C4A45] flex flex-col items-center justify-center shadow-lg shadow-teal-900/20">
                  <img
                    src={logo}
                    alt="Animal"
                    className="w-7 h-7 object-contain mb-1 brightness-0 invert"
                  />
                  <span className="text-white text-[10px] font-semibold">
                    Animal
                  </span>
                </div>
              </div>

              {ANIMAL_CENTER.map((node) => (
                <div
                  key={node.label}
                  className={`absolute ${node.pos}`}
                >
                  <span
                    className={`inline-block text-[11px] font-semibold px-3 py-1.5 rounded-full ${node.color} whitespace-nowrap shadow-sm`}
                  >
                    {node.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function GrowthSection() {
  const [active, setActive] = useState(0)

  return (
    <section id="growth" className="py-24 bg-[#0C4A45]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2
            className="text-4xl font-normal text-white mb-4"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            Evolução do
            <br />
            <em className="text-[#7DD3C8]">UniVet</em>
          </h2>

          <p className="text-[#7DD3C8] max-w-xl mx-auto">
            O projeto foi planejado para evoluir gradualmente, começando pelas
            funcionalidades essenciais e ampliando seus recursos no futuro.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible w-full lg:w-64 shrink-0 pb-2 lg:pb-0">
            {ROADMAP_STAGES.map((stage, index) => (
              <button
                key={stage.label}
                onClick={() => setActive(index)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left shrink-0 ${
                  active === index
                    ? 'bg-white text-[#0C4A45]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span className="text-xl">{stage.icon}</span>

                <span className="font-semibold text-sm">
                  {stage.label}
                </span>

                {index < ROADMAP_STAGES.length - 1 && (
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`w-3.5 h-3.5 ml-auto shrink-0 ${
                      active === index
                        ? 'text-[#0C4A45]'
                        : 'text-white/40'
                    }`}
                  >
                    <path
                      d="M6 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white/10 rounded-2xl p-8 border border-white/20">
            <div className="text-5xl mb-4">
              {ROADMAP_STAGES[active].icon}
            </div>

            <h3
              className="text-2xl font-normal text-white mb-3"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              {ROADMAP_STAGES[active].label}
            </h3>

            <p className="text-[#7DD3C8] text-lg leading-relaxed">
              {ROADMAP_STAGES[active].desc}
            </p>

            <div className="mt-8 flex items-center gap-3">
              {ROADMAP_STAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === active
                      ? 'w-8 bg-white'
                      : 'w-3 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SecuritySection() {
  return (
    <section id="security" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#E8F4F0] text-[#0C4A45] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              Segurança e privacidade
            </div>

            <h2
              className="text-4xl font-normal text-[#0C1A1A] mb-6"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              Privacidade e
              <br />
              <em>proteção de dados</em>
            </h2>

            <p className="text-[#4A5568] leading-relaxed">
              O UniVet foi desenvolvido considerando princípios de segurança,
              privacidade e proteção de dados previstos na LGPD. Cada
              organização possui acesso exclusivo aos seus próprios dados, com
              controle de acesso e rastreabilidade das ações críticas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {SECURITY_ITEMS.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-2xl bg-[#F7F5F0] border border-[#EAE8E3]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0C4A45] flex items-center justify-center mb-3">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    />
                  </svg>
                </div>

                <h4 className="font-semibold text-[#0C1A1A] text-sm mb-1">
                  {item.title}
                </h4>

                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="py-24 bg-[#F7F5F0]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="bg-[#0C4A45] rounded-3xl p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

          <div className="relative">
            <h2
              className="text-4xl lg:text-5xl font-normal text-white mb-4 leading-tight"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              Organize sua
              <br />
              <em className="text-[#7DD3C8]">
                rotina veterinária
              </em>
            </h2>

            <p className="text-[#7DD3C8] mb-8 text-lg">
              Crie sua conta e comece a centralizar tutores, animais e
              consultas no UniVet.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/cadastro"
                className="inline-flex items-center justify-center gap-2 bg-[#E05C2A] text-white font-semibold px-7 py-3.5 rounded-[10px] hover:bg-[#C4501F] transition-colors"
              >
                Criar minha conta

                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  />
                </svg>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-7 py-3.5 rounded-[10px] border border-white/20 hover:bg-white/20 transition-colors"
              >
                Já tenho conta — Entrar
              </Link>
            </div>

            <p className="text-white/50 text-xs mt-5">
              Privacidade · Segurança · LGPD
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#0C1A1A] text-white/60 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded overflow-hidden flex items-center justify-center">
              <img
                src={logo}
                alt="UniVet"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <span className="text-white font-semibold text-sm block">
                UniVet
              </span>

              <span className="text-white/40 text-[10px]">
                Gestão veterinária centrada no animal
              </span>
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <Link to="/privacidade">Privacidade</Link>
            <Link to="/termos">Termos</Link>
            <Link to="/contato">Contato</Link>
          </div>

          <p className="text-xs">
            © 2026 UniVet. Projeto acadêmico.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function Landing() {
  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AnimalCenterSection />
      <GrowthSection />
      <SecuritySection />
      <CtaSection />
      <Footer />
    </div>
  )
}