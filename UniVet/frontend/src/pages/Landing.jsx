
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/gps.png";

const NAV_LINKS = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Como funciona", href: "#how-it-works" },
  { label: "Planejamento", href: "#growth" },
  { label: "Segurança", href: "#security" },
];

const FEATURES = [
  {
    number: "01",
    title: "Tutores e pacientes",
    description:
      "Cadastre tutores e mantenha os dados de seus animais organizados e relacionados.",
    icon: "users",
  },
  {
    number: "02",
    title: "Agenda veterinária",
    description:
      "Visualize os agendamentos e acompanhe os compromissos da rotina clínica.",
    icon: "calendar",
  },
  {
    number: "03",
    title: "Prontuário eletrônico",
    description:
      "Reúna informações clínicas para facilitar o acompanhamento de cada paciente.",
    icon: "clipboard",
  },
  {
    number: "04",
    title: "Controle de vacinação",
    description:
      "Registre vacinações e consulte o histórico para acompanhar os cuidados necessários.",
    icon: "shield",
  },
];

const ROADMAP = [
  {
    title: "MVP",
    subtitle: "Estrutura principal",
    description:
      "Os recursos essenciais para organizar as informações e a rotina veterinária.",
    items: [
      "Dashboard",
      "Tutores",
      "Animais",
      "Agenda",
      "Prontuários",
      "Vacinação",
    ],
    color: "border-[#28685D]",
    badge: "bg-[#28685D]/10 text-[#28685D]",
  },
  {
    title: "Próxima etapa",
    subtitle: "Mais recursos para a gestão",
    description:
      "Funcionalidades complementares para ampliar o controle das atividades.",
    items: ["Financeiro", "Estoque", "Notificações", "Leitos"],
    color: "border-[#A5B9A8]",
    badge: "bg-[#E9EFE8] text-[#41664E]",
  },
  {
    title: "Visão futura",
    subtitle: "Expansão da plataforma",
    description:
      "Possibilidades para acompanhar o crescimento dos estabelecimentos veterinários.",
    items: [
      "Aplicativo mobile",
      "Integração com WhatsApp",
      "Portal do tutor",
      "Inteligência artificial",
      "Multiunidade",
    ],
    color: "border-[#D9C8A8]",
    badge: "bg-[#F3EDE1] text-[#816B43]",
  },
];

function Icon({ name, size = 22, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const paths = {
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
        <path d="m9 16 2 2 4-4" />
      </>
    ),
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 18h3" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
    check: <path d="m5 12 4 4L19 6" />,
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
    close: <path d="m18 6-12 12M6 6l12 12" />,
    paw: (
      <>
        <ellipse cx="12" cy="15.5" rx="5.5" ry="4.5" />
        <ellipse cx="5.5" cy="9" rx="2" ry="2.7" />
        <ellipse cx="10" cy="5.8" rx="2" ry="2.7" />
        <ellipse cx="15" cy="5.8" rx="2" ry="2.7" />
        <ellipse cx="18.5" cy="9" rx="2" ry="2.7" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    building: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 21V9h6v12M7 6h2M15 6h2M7 12h1M16 12h1M7 16h1M16 16h1" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 4 3 5-7" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.paw}</svg>;
}

function Brand({ light = false }) {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-3"
      aria-label="UniVet - página inicial"
    >
      <img
        src={logo}
        alt=""
        className="h-11 w-11 rounded-xl object-contain"
      />
      <span
        className={`text-2xl font-bold tracking-tight ${
          light ? "text-white" : "text-[#104C45]"
        }`}
      >
        UniVet<span className="text-[#D9653B]">.</span>
      </span>
    </Link>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#104C45]/10 bg-[#FBFAF6]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Brand />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#53645E] transition hover:text-[#104C45]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            to="/login"
            className="text-sm font-semibold text-[#104C45] transition hover:text-[#28685D]"
          >
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-2 rounded-full bg-[#104C45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28685D]"
          >
            Começar agora
            <Icon name="arrow" size={16} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#104C45]/15 text-[#104C45] md:hidden"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={23} />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#104C45]/10 bg-[#FBFAF6] px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-[#53645E] hover:bg-[#F2F0E8] hover:text-[#104C45]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-3 border-t border-[#104C45]/10 pt-4">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-full px-4 py-3 text-center text-sm font-semibold text-[#104C45]"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-[#104C45] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Começar agora
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}


function HeroDashboard() {
  const consultas = [
    {
      hora: "09:00",
      nome: "Thor",
      tutor: "Golden Retriever",
      status: "Confirmado",
      statusClass: "bg-emerald-50 text-emerald-700",
      emoji: "🐶",
    },
    {
      hora: "10:30",
      nome: "Luna",
      tutor: "Siamês",
      status: "Agendado",
      statusClass: "bg-blue-50 text-blue-700",
      emoji: "🐱",
    },
    {
      hora: "11:00",
      nome: "Max",
      tutor: "Bulldog Francês",
      status: "Em atendimento",
      statusClass: "bg-amber-50 text-amber-700",
      emoji: "🐶",
    },
  ];

  const estatisticas = [
    {
      titulo: "Consultas hoje",
      valor: "08",
      detalhe: "Na agenda",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </>
      ),
      bg: "bg-[#EAF5F2]",
      color: "text-[#0C4A45]",
    },
    {
      titulo: "Animais",
      valor: "124",
      detalhe: "Pacientes ativos",
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14c1-2 7-2 8 0" />
          <circle cx="9" cy="9" r="1" />
          <circle cx="15" cy="9" r="1" />
        </>
      ),
      bg: "bg-[#EDF3E8]",
      color: "text-[#52764B]",
    },
    {
      titulo: "Vacinas",
      valor: "03",
      detalhe: "Precisam de atenção",
      icon: (
        <>
          <path d="m14 4 6 6" />
          <path d="m17 2 5 5-3 3-5-5z" />
          <path d="m14 7-9 9a3 3 0 0 0 4 4l9-9" />
          <path d="m8 14 3 3" />
        </>
      ),
      bg: "bg-[#F7F0E5]",
      color: "text-[#A47B39]",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[570px]">
      <div className="absolute -right-8 top-10 h-48 w-48 rounded-full bg-[#DCE8D9] opacity-70 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-[#E8DCCB] opacity-60 blur-3xl" />

      <div className="relative overflow-hidden rounded-[25px] border border-[#E7E9E3] bg-[#F8F9F6] p-3 shadow-[0_30px_90px_-30px_rgba(12,74,69,0.28)] sm:rounded-[30px] sm:p-4">
        <div className="flex items-center justify-between gap-3 rounded-t-[18px] border-b border-[#EAECE6] bg-white px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0C4A45] text-white">
              <Icon name="paw" size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold tracking-tight text-[#183C35]">
                UniVet
              </p>
              <p className="text-[10px] text-[#8B938D]">
                Gestão veterinária
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#EAECE6] bg-[#FBFCF9] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#4D9A68]" />
            <span className="text-[10px] font-medium text-[#53645E]">
              Visão geral
            </span>
          </div>
        </div>

        <div className="space-y-4 p-2 sm:space-y-5 sm:p-3">
          <div className="flex items-center justify-between gap-3 px-1 pt-1">
            <div>
              <p className="text-[10px] text-[#8B938D]">
                Painel de controle
              </p>
              <h3 className="mt-1 text-base font-bold tracking-tight text-[#183C35] sm:text-lg">
                Olá, Dra. Ana 👋
              </h3>
              <p className="mt-1 text-[10px] text-[#8B938D]">
                Aqui está o resumo da sua rotina.
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#E5EDE2] text-sm font-bold text-[#28685D] shadow-sm">
              AS
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {estatisticas.map((item) => (
              <div
                key={item.titulo}
                className="min-w-0 rounded-2xl border border-[#EAECE6] bg-white p-3 sm:p-3.5"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                >
                  <Icon size={17}>{item.icon}</Icon>
                </div>

                <p className="mt-3 text-xl font-bold tracking-tight text-[#183C35] sm:text-2xl">
                  {item.valor}
                </p>

                <p className="mt-1 truncate text-[10px] font-semibold text-[#53645E]">
                  {item.titulo}
                </p>

                <p className="mt-1 hidden text-[9px] text-[#9A9F9D] sm:block">
                  {item.detalhe}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#EAECE6] bg-white">
            <div className="flex items-center justify-between gap-2 border-b border-[#F0F0EB] px-4 py-3.5 sm:px-4">
              <div>
                <h4 className="text-xs font-bold text-[#183C35]">
                  Consultas de hoje
                </h4>
                <p className="mt-1 text-[10px] text-[#929795]">
                  Sua agenda em um só lugar
                </p>
              </div>

              <span className="rounded-lg bg-[#EAF5F2] px-2.5 py-1.5 text-[10px] font-bold text-[#0C4A45]">
                08 consultas
              </span>
            </div>

            <div className="px-3 sm:px-4">
              {consultas.map((consulta, index) => (
                <div
                  key={consulta.nome}
                  className={`flex items-center gap-2.5 py-3 ${
                    index !== consultas.length - 1
                      ? "border-b border-[#F0F0EB]"
                      : ""
                  }`}
                >
                  <div className="w-10 shrink-0">
                    <p className="text-[10px] font-bold text-[#53645E]">
                      {consulta.hora}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5F3EE] text-lg">
                    {consulta.emoji}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-[#183C35]">
                      {consulta.nome}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-[#929795]">
                      {consulta.tutor}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold ${consulta.statusClass}`}
                  >
                    {consulta.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#F0F0EB] bg-[#FCFCFA] px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-[#929795]">
                  Exemplo de agenda
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#28685D]">
                  Rotina organizada
                  <Icon name="check" size={12} />
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-[#EAECE6] bg-white p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF5F2] text-[#0C4A45]">
                <Icon name="users" size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-[#183C35]">
                  86
                </p>
                <p className="truncate text-[10px] text-[#929795]">
                  Tutores cadastrados
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#EAECE6] bg-white p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EDF3E8] text-[#52764B]">
                <Icon name="clipboard" size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-[#183C35]">
                  12
                </p>
                <p className="truncate text-[10px] text-[#929795]">
                  Prontuários recentes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FBFAF6]">
      <div className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-[#DCE8D9]/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[320px] w-[320px] rounded-full bg-[#F0E6D7]/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:px-12 lg:py-28">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#28685D]/15 bg-white/80 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#28685D]" />
            <span className="text-xs font-semibold tracking-wide text-[#28685D] sm:text-sm">
              Gestão veterinária mais organizada
            </span>
          </div>

          <h1 className="text-[2.65rem] font-bold leading-[1.12] tracking-[-0.045em] text-[#183C35] sm:text-5xl lg:text-[3.65rem]">
            Quem faz parte da família merece cuidado.{" "}
            <span className="text-[#28685D]">
              Quem cuida deles merece um sistema que cuide da gestão.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-[#68766E] sm:text-lg">
            O UniVet reúne tutores, animais, consultas, prontuários e
            vacinação em um só lugar, ajudando a organizar a rotina e
            acompanhar o histórico de cada paciente.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/cadastro"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#104C45] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#104C45]/15 transition hover:-translate-y-0.5 hover:bg-[#28685D]"
            >
              Começar com o UniVet
              <Icon name="arrow" size={18} />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-[#104C45]/15 bg-white/70 px-7 py-4 text-sm font-semibold text-[#104C45] transition hover:border-[#28685D]/40 hover:bg-white"
            >
              Conhecer funcionalidades
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#68766E]">
            <span className="inline-flex items-center gap-2">
              <Icon name="check" size={17} className="text-[#28685D]" />
              Informações organizadas
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="check" size={17} className="text-[#28685D]" />
              Rotina centralizada
            </span>
          </div>
        </div>

        <div className="px-1 py-4 sm:px-4 lg:py-0">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}) {
  return (
    <div
      className={`max-w-3xl ${
        centered ? "mx-auto text-center" : ""
      }`}
    >
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#28685D] sm:text-sm">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold leading-tight tracking-[-0.035em] text-[#183C35] sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-8 text-[#68766E] sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-24 bg-[#F2F0E8] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Funcionalidades"
          title="Tudo conectado para facilitar o cuidado."
          description="As informações da rotina veterinária reunidas em uma plataforma, ajudando a reduzir a dispersão de dados e facilitando o acompanhamento dos pacientes."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <article
              key={feature.number}
              className="group flex min-h-[290px] flex-col rounded-3xl border border-[#104C45]/8 bg-[#FBFAF6] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#28685D]/25 hover:shadow-xl hover:shadow-[#104C45]/5 sm:p-7"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5EDE2] text-[#28685D] transition group-hover:bg-[#104C45] group-hover:text-white">
                  <Icon name={feature.icon} size={23} />
                </div>
                <span className="text-sm font-semibold text-[#B0B9AF]">
                  {feature.number}
                </span>
              </div>

              <h3 className="mt-7 text-xl font-bold text-[#183C35]">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#68766E]">
                {feature.description}
              </p>

              <div className="mt-auto flex justify-end pt-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#104C45]/10 text-[#28685D] transition group-hover:border-[#28685D] group-hover:bg-[#28685D] group-hover:text-white">
                  <Icon name="arrow" size={16} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


function AnimalCenterSection() {
  const steps = [
    {
      number: "01",
      title: "Configure o estabelecimento",
      description:
        "O administrador inicia a configuração do estabelecimento e prepara o ambiente para organizar a rotina veterinária.",
      icon: "building",
      tag: "Configuração inicial",
    },
    {
      number: "02",
      title: "Gerencie sua equipe",
      description:
        "Cadastre os funcionários e organize as permissões de acesso de acordo com as responsabilidades de cada pessoa.",
      icon: "users",
      tag: "Equipe e acessos",
    },
    {
      number: "03",
      title: "Organize os atendimentos",
      description:
        "Cadastre tutores e animais, vincule cada paciente ao seu responsável e organize os agendamentos.",
      icon: "calendar",
      tag: "Rotina veterinária",
    },
    {
      number: "04",
      title: "Acompanhe cada paciente",
      description:
        "Registre as informações dos atendimentos, consulte os prontuários e acompanhe o histórico de vacinação.",
      icon: "clipboard",
      tag: "Histórico do paciente",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-[#FBFAF6] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow="Como funciona"
              title="Da configuração à rotina, tudo conectado."
              description="O UniVet ajuda cada estabelecimento a organizar sua equipe, centralizar as informações e acompanhar os cuidados de cada paciente em um só lugar."
            />

            <div className="mt-8 rounded-2xl border border-[#104C45]/10 bg-[#F2F0E8] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#104C45] text-white">
                  <Icon name="building" size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-[#183C35]">
                    Cada pessoa com seu acesso
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#68766E]">
                    O administrador organiza a equipe e os acessos, enquanto
                    os profissionais utilizam os recursos necessários para
                    realizar suas atividades.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-[#68766E]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E5EDE2] text-[#28685D]">
                <Icon name="check" size={17} />
              </span>
              <span>Informações organizadas em um só lugar</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute bottom-25 left-[27px] top-12 hidden w-px bg-[#C9D8C9] sm:block" />

            <div className="space-y-4">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="group relative rounded-3xl border border-[#104C45]/10 bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#28685D]/30 hover:shadow-xl hover:shadow-[#104C45]/5 sm:p-6"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E5EDE2] text-[#28685D] transition group-hover:bg-[#104C45] group-hover:text-white">
                      <Icon name={step.icon} size={24} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold tracking-wider text-[#28685D]">
                          ETAPA {step.number}
                        </span>

                        <span className="rounded-full bg-[#F2F0E8] px-2.5 py-1 text-[10px] font-semibold text-[#68766E]">
                          {step.tag}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#183C35] sm:text-xl">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-[#68766E]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-[#104C45] p-5 text-white sm:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <Icon name="paw" size={25} />
              </div>

              <div>
                <h3 className="font-bold">
                  Mais organização para cuidar melhor.
                </h3>
                <p className="mt-1 text-sm leading-6 text-white/75">
                  Uma visão centralizada da rotina e do histórico dos pacientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function GrowthSection() {
  return (
    <section
      id="growth"
      className="scroll-mt-24 bg-[#EAF0E7] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Planejamento"
          title="Uma plataforma pensada para crescer junto com a rotina."
          description="O UniVet está sendo desenvolvido em etapas, começando pelos recursos essenciais e abrindo espaço para novas funcionalidades ao longo do projeto."
        />

        <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3">
          {ROADMAP.map((stage, index) => (
            <article
              key={stage.title}
              className={`flex flex-col rounded-3xl border-t-4 ${stage.color} bg-[#FBFAF6] p-6 shadow-sm sm:p-8`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${stage.badge}`}
                >
                  {stage.title}
                </span>
                <span className="text-sm font-semibold text-[#B0B9AF]">
                  0{index + 1}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#183C35]">
                {stage.subtitle}
              </h3>

              <p className="mt-3 min-h-[72px] text-sm leading-7 text-[#68766E]">
                {stage.description}
              </p>

              <div className="my-6 h-px bg-[#104C45]/10" />

              <ul className="space-y-3">
                {stage.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-[#53645E]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E5EDE2] text-[#28685D]">
                      <Icon name="check" size={14} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm leading-6 text-[#68766E]">
          O planejamento representa a direção do projeto. A disponibilidade de
          cada recurso depende do andamento do desenvolvimento.
        </p>
      </div>
    </section>
  );
}

function SecuritySection() {
  const principles = [
    {
      icon: "lock",
      title: "Controle de acesso",
      description:
        "Organização dos acessos de acordo com o perfil e as permissões de cada usuário.",
    },
    {
      icon: "building",
      title: "Separação por estabelecimento",
      description:
        "Estrutura planejada para manter os dados de cada estabelecimento separados.",
    },
    {
      icon: "chart",
      title: "Rastreabilidade",
      description:
        "Previsão de registros de ações relevantes para facilitar o acompanhamento das alterações.",
    },
  ];

  return (
    <section
      id="security"
      className="scroll-mt-24 bg-[#FBFAF6] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Segurança e privacidade"
              title="Cuidar das informações também faz parte do cuidado."
              description="O UniVet está sendo estruturado considerando princípios de segurança, privacidade e proteção de dados previstos na LGPD."
            />

            <p className="mt-5 text-sm leading-7 text-[#68766E]">
              A proposta inclui organização dos acessos, separação dos dados
              por estabelecimento e rastreabilidade de ações relevantes. Essas
              medidas fazem parte do planejamento de segurança da plataforma.
            </p>
          </div>

          <div className="space-y-4">
            {principles.map((principle) => (
              <article
                key={principle.title}
                className="flex gap-5 rounded-2xl border border-[#104C45]/10 bg-white p-5 sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5EDE2] text-[#28685D]">
                  <Icon name={principle.icon} size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-[#183C35]">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#68766E]">
                    {principle.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="bg-[#104C45] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#BFD7C2] sm:text-sm">
            UniVet
          </p>
          <h2 className="text-3xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-4xl lg:text-[2.75rem]">
            Mais organização para quem dedica a rotina ao cuidado.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#D3E1D8]">
            Conheça a proposta do UniVet e acompanhe o desenvolvimento de uma
            plataforma voltada à gestão veterinária.
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            to="/cadastro"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-[#FBFAF6] px-7 py-4 text-sm font-bold text-[#104C45] transition hover:bg-white"
          >
            Começar com o UniVet
            <Icon name="arrow" size={17} />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Já tenho uma conta
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#FBFAF6] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 border-b border-[#104C45]/10 pb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Brand />
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#68766E]">
            Uma plataforma em desenvolvimento para ajudar a organizar a gestão
            veterinária.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#53645E]">
          <a href="#features" className="transition hover:text-[#28685D]">
            Funcionalidades
          </a>
          <a href="#how-it-works" className="transition hover:text-[#28685D]">
            Como funciona
          </a>
          <a href="#growth" className="transition hover:text-[#28685D]">
            Planejamento
          </a>
          <Link to="/privacidade" className="transition hover:text-[#28685D]">
            Privacidade
          </Link>
          <Link to="/termos" className="transition hover:text-[#28685D]">
            Termos de uso
          </Link>
          <Link to="/contato" className="transition hover:text-[#28685D]">
            Contato
          </Link>
        </nav>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-6 text-xs text-[#87928B] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} UniVet.
        </p>
        <p>Projeto Acadêmico - Gestão veterinária.</p>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#183C35]">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AnimalCenterSection />
        <GrowthSection />
        <SecuritySection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
