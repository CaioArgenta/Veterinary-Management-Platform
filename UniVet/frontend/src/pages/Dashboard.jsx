function Dashboard() {
  return (
    <div className="p-6 md:p-8">

      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0C1A1A]">
          Bom dia, Dra. Ana 👋
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Aqui está um resumo da sua clínica hoje.
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="bg-white rounded-2xl p-5 border border-[#EAE8E3]">
          <p className="text-sm text-gray-500">
            Consultas hoje
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#0C4A45]">
            8
          </p>

          <p className="mt-2 text-xs text-gray-400">
            2 próximas
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EAE8E3]">
          <p className="text-sm text-gray-500">
            Animais cadastrados
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#0C4A45]">
            124
          </p>

          <p className="mt-2 text-xs text-gray-400">
            +6 este mês
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EAE8E3]">
          <p className="text-sm text-gray-500">
            Tutores
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#0C4A45]">
            97
          </p>

          <p className="mt-2 text-xs text-gray-400">
            +4 este mês
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EAE8E3]">
          <p className="text-sm text-gray-500">
            Vacinas pendentes
          </p>

          <p className="mt-2 text-3xl font-semibold text-rose-500">
            3
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Requer atenção
          </p>
        </div>

      </div>

      {/* Conteúdo inferior */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

        {/* Próximas consultas */}
        <div className="bg-white rounded-2xl border border-[#EAE8E3] p-6">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-[#0C1A1A]">
                Próximas consultas
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Agenda de hoje
              </p>
            </div>

            <button className="text-sm font-medium text-[#0C4A45] hover:underline">
              Ver agenda
            </button>
          </div>

          <div className="space-y-3">

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F5F0]">
              <div>
                <p className="text-sm font-medium text-[#0C1A1A]">
                  Thor
                </p>

                <p className="text-xs text-gray-400">
                  João Silva • Consulta
                </p>
              </div>

              <span className="text-sm font-semibold text-[#0C4A45]">
                09:00
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F5F0]">
              <div>
                <p className="text-sm font-medium text-[#0C1A1A]">
                  Mel
                </p>

                <p className="text-xs text-gray-400">
                  Maria Santos • Retorno
                </p>
              </div>

              <span className="text-sm font-semibold text-[#0C4A45]">
                10:30
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F5F0]">
              <div>
                <p className="text-sm font-medium text-[#0C1A1A]">
                  Nina
                </p>

                <p className="text-xs text-gray-400">
                  Carlos Oliveira • Vacinação
                </p>
              </div>

              <span className="text-sm font-semibold text-[#0C4A45]">
                14:00
              </span>
            </div>

          </div>
        </div>

        {/* Vacinação */}
        <div className="bg-white rounded-2xl border border-[#EAE8E3] p-6">

          <div className="mb-5">
            <h2 className="font-semibold text-[#0C1A1A]">
              Vacinações pendentes
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Animais que precisam de atenção
            </p>
          </div>

          <div className="space-y-3">

            <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50">
              <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center">
                💉
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-[#0C1A1A]">
                  Max
                </p>

                <p className="text-xs text-gray-400">
                  Vacina antirrábica
                </p>
              </div>

              <span className="text-xs font-medium text-rose-500">
                Atrasada
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F5F0]">
              <div className="w-9 h-9 rounded-full bg-[#DDF3EF] flex items-center justify-center">
                💉
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-[#0C1A1A]">
                  Luna
                </p>

                <p className="text-xs text-gray-400">
                  Vacina múltipla
                </p>
              </div>

              <span className="text-xs font-medium text-amber-500">
                Próxima
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}

export default Dashboard