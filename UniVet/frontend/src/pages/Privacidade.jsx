import { Link } from 'react-router-dom'

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-2xl font-bold text-emerald-600">
            UniVet
          </Link>

          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-emerald-600"
          >
            Voltar para o início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-3 text-3xl font-bold">
            Privacidade e proteção de dados
          </h1>

          <p className="mb-8 text-sm text-slate-500">
            Última atualização: setembro de 2026
          </p>

          <section className="space-y-6 text-slate-700">
            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                1. Sobre o UniVet
              </h2>

              <p>
                O UniVet é uma plataforma de gestão veterinária desenvolvida
                para auxiliar na organização de informações relacionadas a
                tutores, animais, consultas, prontuários e vacinação.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                2. Dados tratados
              </h2>

              <p>
                Durante a utilização do sistema podem ser armazenadas
                informações necessárias para o funcionamento da plataforma,
                como dados de usuários, tutores, animais e registros
                relacionados ao atendimento veterinário.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                3. Proteção dos dados
              </h2>

              <p>
                O UniVet considera princípios de segurança, privacidade e
                proteção de dados previstos na Lei Geral de Proteção de Dados
                (LGPD). O acesso às informações é controlado de acordo com a
                organização e o perfil de cada usuário.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                4. Controle de acesso
              </h2>

              <p>
                Cada organização possui acesso aos seus próprios dados. O
                sistema utiliza autenticação e regras de acesso para evitar que
                usuários tenham acesso indevido a informações de outras
                organizações.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                5. Auditoria
              </h2>

              <p>
                Ações importantes realizadas no sistema podem ser registradas
                para permitir rastreabilidade e auxiliar na segurança das
                informações.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                6. Atualizações
              </h2>

              <p>
                Esta página poderá ser atualizada conforme o desenvolvimento e
                a evolução do UniVet.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}