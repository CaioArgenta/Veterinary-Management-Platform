import { Link } from 'react-router-dom'

export default function Termos() {
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
            Termos de uso
          </h1>

          <p className="mb-8 text-sm text-slate-500">
            Última atualização: setembro de 2026
          </p>

          <section className="space-y-6 text-slate-700">
            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                1. Uso da plataforma
              </h2>

              <p>
                O UniVet tem como objetivo auxiliar profissionais e
                estabelecimentos veterinários na organização de informações e
                rotinas relacionadas ao atendimento de animais.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                2. Responsabilidade pelas informações
              </h2>

              <p>
                As informações cadastradas na plataforma são de responsabilidade
                dos usuários que realizam seu registro e gerenciamento.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                3. Acesso à conta
              </h2>

              <p>
                Cada usuário deve manter suas credenciais de acesso em
                segurança e não compartilhar sua senha com terceiros.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                4. Uso adequado
              </h2>

              <p>
                A plataforma deve ser utilizada de forma adequada e de acordo
                com sua finalidade, evitando ações que possam comprometer o
                funcionamento do sistema ou a segurança das informações.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                5. Evolução do sistema
              </h2>

              <p>
                O UniVet está em desenvolvimento e poderá receber novas
                funcionalidades, melhorias e alterações em sua estrutura ao
                longo do projeto.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                6. Projeto acadêmico
              </h2>

              <p>
                O UniVet é desenvolvido como projeto acadêmico no curso de
                Engenharia de Software da UNIFIO.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}