import { useState } from 'react'

const ESPECIE_ICON = {
  Cão: '🐕',
  Gato: '🐈',
  Ave: '🦜',
  Réptil: '🦎',
  Outro: '🐾',
}

const ESPECIES = ['Cão', 'Gato', 'Ave', 'Réptil', 'Outro']
const SEXOS = ['Macho', 'Fêmea']

const ANIMAIS_INICIAIS = [
  {
    id: 1,
    nome: 'Thor',
    especie: 'Cão',
    raca: 'Golden Retriever',
    sexo: 'Macho',
    nascimento: '2020-03-15',
    peso: 28,
    tutorNome: 'João Silva',
    cor: 'Dourado',
    castrado: true,
    microchip: '985141000123456',
    alergias: 'Dipirona',
    restricoes: '',
    cuidadosEspeciais: 'Cuidado com articulações',
    observacoes: 'Animal dócil e tranquilo.',
    alerta: 'Sensível durante aplicação de vacinas.',
  },
  {
    id: 2,
    nome: 'Luna',
    especie: 'Gato',
    raca: 'Siamês',
    sexo: 'Fêmea',
    nascimento: '2022-07-10',
    peso: 4.2,
    tutorNome: 'Maria Santos',
    cor: 'Creme e marrom',
    castrado: true,
    microchip: '',
    alergias: '',
    restricoes: 'Não pode receber leite',
    cuidadosEspeciais: 'Evitar ambientes muito quentes',
    observacoes: '',
    alerta: '',
  },
  {
    id: 3,
    nome: 'Mel',
    especie: 'Cão',
    raca: 'Shih-tzu',
    sexo: 'Fêmea',
    nascimento: '2021-11-22',
    peso: 5.8,
    tutorNome: 'Carlos Oliveira',
    cor: 'Branco e caramelo',
    castrado: false,
    microchip: '',
    alergias: 'Amoxicilina',
    restricoes: '',
    cuidadosEspeciais: 'Braquicefálico — cuidado com anestesia',
    observacoes: '',
    alerta: 'Comportamento agitado em consultas.',
  },
]

const TUTORES = [
  { id: 1, nome: 'João Silva' },
  { id: 2, nome: 'Maria Santos' },
  { id: 3, nome: 'Carlos Oliveira' },
]

function calcIdade(nascimento) {
  if (!nascimento) return '-'

  const nasc = new Date(nascimento)
  const hoje = new Date()

  const meses =
    (hoje.getFullYear() - nasc.getFullYear()) * 12 +
    (hoje.getMonth() - nasc.getMonth())

  if (meses < 12) {
    return `${meses} meses`
  }

  const anos = Math.floor(meses / 12)
  const m = meses % 12

  return m > 0 ? `${anos}a ${m}m` : `${anos} anos`
}

function AnimalDetail({ animal, onClose }) {
  const [tab, setTab] = useState('dados')

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg h-full max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[#EAE8E3] px-6 pt-6 pb-0">

          <div className="flex items-start justify-between mb-4">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-[#F7F5F0] flex items-center justify-center text-2xl">
                {ESPECIE_ICON[animal.especie]}
              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-xl font-semibold text-[#0C1A1A]">
                    {animal.nome}
                  </h2>

                  {animal.alerta && (
                    <span
                      className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center"
                      title={animal.alerta}
                    >
                      <svg
                        viewBox="0 0 12 12"
                        fill="white"
                        className="w-3 h-3"
                      >
                        <path d="M6 2L1 10h10L6 2zm0 4v2m0 1.5v.5" />
                      </svg>
                    </span>
                  )}

                </div>

                <p className="text-sm text-[#6B7280]">
                  {animal.raca} · {animal.especie} · {animal.sexo}
                </p>

              </div>

            </div>

            <button
              onClick={onClose}
              className="text-[#9CA3AF] hover:text-[#0C1A1A] mt-1"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

          </div>

          {animal.alerta && (
            <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-800">

              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 shrink-0 mt-0.5 text-amber-500"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z"
                />
              </svg>

              <span>
                <strong>Atenção:</strong> {animal.alerta}
              </span>

            </div>
          )}

          <div className="flex gap-1">

            {['dados', 'saude'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  tab === t
                    ? 'bg-[#F7F5F0] text-[#0C4A45]'
                    : 'text-[#9CA3AF] hover:text-[#0C1A1A]'
                }`}
              >
                {t === 'dados' ? 'Dados gerais' : 'Saúde'}
              </button>
            ))}

          </div>

        </div>

        <div className="p-6 space-y-4">

          {tab === 'dados' && (
            <>
              <div className="grid grid-cols-3 gap-3">

                <div className="bg-[#F7F5F0] rounded-xl p-3 text-center">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-1">
                    Nascimento
                  </p>
                  <p className="text-sm font-semibold text-[#0C1A1A]">
                    {animal.nascimento}
                  </p>
                </div>

                <div className="bg-[#F7F5F0] rounded-xl p-3 text-center">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-1">
                    Idade
                  </p>
                  <p className="text-sm font-semibold text-[#0C1A1A]">
                    {calcIdade(animal.nascimento)}
                  </p>
                </div>

                <div className="bg-[#F7F5F0] rounded-xl p-3 text-center">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-1">
                    Peso atual
                  </p>
                  <p className="text-sm font-semibold text-[#0C1A1A]">
                    {animal.peso ? `${animal.peso} kg` : '-'}
                  </p>
                </div>

              </div>

              <InfoRow
                label="Tutor responsável"
                value={animal.tutorNome}
              />

              <InfoRow
                label="Cor / Pelagem"
                value={animal.cor || '—'}
              />

              <InfoRow
                label="Castrado"
                value={animal.castrado ? 'Sim' : 'Não'}
              />

              {animal.microchip && (
                <InfoRow
                  label="Microchip"
                  value={animal.microchip}
                  mono
                />
              )}

              {animal.observacoes && (
                <InfoRow
                  label="Observações"
                  value={animal.observacoes}
                />
              )}
            </>
          )}

          {tab === 'saude' && (
            <>
              <SaudeField
                label="Alergias"
                value={animal.alergias}
                color="rose"
              />

              <SaudeField
                label="Restrições"
                value={animal.restricoes}
                color="amber"
              />

              <SaudeField
                label="Cuidados especiais"
                value={animal.cuidadosEspeciais}
                color="blue"
              />
            </>
          )}

        </div>

        <div className="flex gap-3 p-6 border-t border-[#EAE8E3] sticky bottom-0 bg-white">

          <button
            onClick={onClose}
            className="flex-1 border border-[#D8D5CE] text-[#6B7280] font-medium py-2.5 rounded-[10px] hover:bg-[#F7F5F0] text-sm"
          >
            Fechar
          </button>

          <button
            className="flex-1 bg-[#0C4A45] text-white font-semibold py-2.5 rounded-[10px] hover:bg-[#0a3d38] text-sm"
          >
            Editar ficha
          </button>

        </div>

      </div>
    </div>
  )
}

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-[#F3F1EC] last:border-0">

      <span className="text-xs text-[#9CA3AF] shrink-0 mt-0.5">
        {label}
      </span>

      <span
        className={`text-sm text-[#0C1A1A] text-right ${
          mono ? 'font-mono text-xs' : ''
        }`}
      >
        {value}
      </span>

    </div>
  )
}

function SaudeField({ label, value, color }) {

  const colors = {
    rose: 'bg-rose-50 border-rose-200 text-rose-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <div>

      <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
        {label}
      </label>

      {value ? (
        <div
          className={`text-sm px-4 py-3 rounded-xl border ${colors[color]}`}
        >
          {value}
        </div>
      ) : (
        <div className="text-sm px-4 py-3 rounded-xl border border-[#EAE8E3] text-[#9CA3AF]">
          Não informado
        </div>
      )}

    </div>
  )
}

function NovoAnimalModal({ onClose, onSalvar }) {

  const [form, setForm] = useState({
    nome: '',
    especie: '',
    raca: '',
    sexo: '',
    nascimento: '',
    cor: '',
    peso: '',
    castrado: '',
    tutorId: '',
    alergias: '',
    restricoes: '',
    cuidados: '',
    observacoes: '',
    alerta: '',
  })

  const set = (campo, valor) => {
    setForm(prev => ({
      ...prev,
      [campo]: valor,
    }))
  }

  const inputCls =
    'w-full bg-white border border-[#D8D5CE] rounded-[10px] px-4 py-2.5 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30 focus:border-[#0C4A45] transition-all'

  function cadastrar() {

    if (!form.nome || !form.especie || !form.sexo || !form.tutorId) {
      alert('Preencha os campos obrigatórios.')
      return
    }

    const tutor = TUTORES.find(
      t => String(t.id) === String(form.tutorId)
    )

    const novoAnimal = {
      id: Date.now(),
      nome: form.nome,
      especie: form.especie,
      raca: form.raca,
      sexo: form.sexo,
      nascimento: form.nascimento,
      peso: form.peso ? Number(form.peso) : null,
      tutorNome: tutor ? tutor.nome : 'Sem tutor',
      cor: form.cor,
      castrado: form.castrado === 'sim',
      microchip: '',
      alergias: form.alergias,
      restricoes: form.restricoes,
      cuidadosEspeciais: form.cuidados,
      observacoes: form.observacoes,
      alerta: form.alerta,
    }

    onSalvar(novoAnimal)
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end p-4"
      onClick={onClose}
    >

      <div
        className="bg-white rounded-2xl w-full max-w-lg h-full max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >

        <div className="flex items-center justify-between p-6 border-b border-[#EAE8E3] sticky top-0 bg-white z-10">

          <h2 className="font-semibold text-[#0C1A1A]">
            Novo animal
          </h2>

          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#0C1A1A]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

        </div>

        <div className="p-6 space-y-4">

          {/* Nome e espécie */}

          <div className="grid grid-cols-2 gap-3">

            <div>

              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Nome *
              </label>

              <input
                className={inputCls}
                placeholder="Nome do animal"
                value={form.nome}
                onChange={e => set('nome', e.target.value)}
              />

            </div>

            <div>

              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Espécie *
              </label>

              <select
                className={inputCls}
                value={form.especie}
                onChange={e => set('especie', e.target.value)}
              >

                <option value="">
                  Selecionar
                </option>

                {ESPECIES.map(especie => (
                  <option key={especie} value={especie}>
                    {especie}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* Raça e sexo */}

          <div className="grid grid-cols-2 gap-3">

            <div>

              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Raça
              </label>

              <input
                className={inputCls}
                placeholder="Raça"
                value={form.raca}
                onChange={e => set('raca', e.target.value)}
              />

            </div>

            <div>

              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Sexo *
              </label>

              <select
                className={inputCls}
                value={form.sexo}
                onChange={e => set('sexo', e.target.value)}
              >

                <option value="">
                  Selecionar
                </option>

                {SEXOS.map(sexo => (
                  <option key={sexo} value={sexo}>
                    {sexo}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* Nascimento, peso e castrado */}

          <div className="grid grid-cols-3 gap-3">

            <div>

              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Nascimento
              </label>

              <input
                type="date"
                className={inputCls}
                value={form.nascimento}
                onChange={e => set('nascimento', e.target.value)}
              />

            </div>

            <div>

              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Peso (kg)
              </label>

              <input
                type="number"
                step="0.1"
                className={inputCls}
                placeholder="0.0"
                value={form.peso}
                onChange={e => set('peso', e.target.value)}
              />

            </div>

            <div>

              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Castrado
              </label>

              <select
                className={inputCls}
                value={form.castrado}
                onChange={e => set('castrado', e.target.value)}
              >

                <option value="">
                  —
                </option>

                <option value="sim">
                  Sim
                </option>

                <option value="nao">
                  Não
                </option>

              </select>

            </div>

          </div>

          {/* Tutor */}

          <div>

            <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
              Tutor responsável *
            </label>

            <select
              className={inputCls}
              value={form.tutorId}
              onChange={e => set('tutorId', e.target.value)}
            >

              <option value="">
                Selecionar tutor
              </option>

              {TUTORES.map(tutor => (
                <option
                  key={tutor.id}
                  value={tutor.id}
                >
                  {tutor.nome}
                </option>
              ))}

            </select>

          </div>

          {/* Cor */}

          <div>

            <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
              Cor / Pelagem
            </label>

            <input
              className={inputCls}
              placeholder="Ex: Dourado, Preto e branco…"
              value={form.cor}
              onChange={e => set('cor', e.target.value)}
            />

          </div>

          {/* Informações de saúde */}

          <div className="bg-rose-50 rounded-xl p-4 space-y-3 border border-rose-100">

            <p className="text-xs font-semibold text-rose-800">
              Informações de saúde
            </p>

            <div>

              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Alergias
              </label>

              <input
                className={inputCls}
                placeholder="Ex: Dipirona, Amoxicilina…"
                value={form.alergias}
                onChange={e => set('alergias', e.target.value)}
              />

            </div>

            <div>

              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Restrições
              </label>

              <input
                className={inputCls}
                placeholder="Ex: Não pode receber vacina V4…"
                value={form.restricoes}
                onChange={e => set('restricoes', e.target.value)}
              />

            </div>

            <div>

              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Cuidados especiais
              </label>

              <input
                className={inputCls}
                placeholder="Ex: Braquicefálico — cuidado com anestesia…"
                value={form.cuidados}
                onChange={e => set('cuidados', e.target.value)}
              />

            </div>

            <div>

              <label className="block text-xs font-medium text-amber-700 mb-1.5">
                ⚠ Alerta de atenção especial
              </label>

              <input
                className={inputCls}
                placeholder="Ex: Comportamento agressivo em consultas…"
                value={form.alerta}
                onChange={e => set('alerta', e.target.value)}
              />

            </div>

          </div>

          {/* Observações */}

          <div>

            <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
              Observações
            </label>

            <textarea
              className={`${inputCls} min-h-[80px] resize-none`}
              placeholder="Ex: Animal dócil, gosta de brincar…"
              value={form.observacoes}
              onChange={e => set('observacoes', e.target.value)}
            />

          </div>

        </div>

        {/* Botões */}

        <div className="flex gap-3 p-6 border-t border-[#EAE8E3] sticky bottom-0 bg-white">

          <button
            onClick={onClose}
            className="flex-1 border border-[#D8D5CE] text-[#6B7280] font-medium py-2.5 rounded-[10px] text-sm hover:bg-[#F7F5F0]"
          >
            Cancelar
          </button>

          <button
            onClick={cadastrar}
            className="flex-1 bg-[#0C4A45] text-white font-semibold py-2.5 rounded-[10px] text-sm hover:bg-[#0a3d38]"
          >
            Cadastrar animal
          </button>

        </div>

      </div>

    </div>
  )
}

export default function Animais() {

  const [animais, setAnimais] = useState(ANIMAIS_INICIAIS)
  const [busca, setBusca] = useState('')
  const [filtroEspecie, setFiltroEspecie] = useState('')
  const [detalhe, setDetalhe] = useState(null)
  const [novoOpen, setNovoOpen] = useState(false)

  const filtrados = animais.filter(animal => {

    const texto = busca.toLowerCase()

    const match =
      animal.nome.toLowerCase().includes(texto) ||
      animal.tutorNome.toLowerCase().includes(texto) ||
      animal.raca.toLowerCase().includes(texto)

    const esp =
      filtroEspecie
        ? animal.especie === filtroEspecie
        : true

    return match && esp
  })

  function adicionarAnimal(novoAnimal) {
    setAnimais(prev => [...prev, novoAnimal])
    setNovoOpen(false)
  }

  return (
    <div className="p-6 max-w-[900px] mx-auto">

      {detalhe && (
        <AnimalDetail
          animal={detalhe}
          onClose={() => setDetalhe(null)}
        />
      )}

      {novoOpen && (
        <NovoAnimalModal
          onClose={() => setNovoOpen(false)}
          onSalvar={adicionarAnimal}
        />
      )}

      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">

        <div>

          <h1 className="text-2xl font-semibold text-[#0C1A1A]">
            Animais
          </h1>

          <p className="text-sm text-[#6B7280] mt-0.5">
            {animais.length} pacientes cadastrados
          </p>

        </div>

        <button
          onClick={() => setNovoOpen(true)}
          className="flex items-center gap-2 bg-[#0C4A45] text-white font-semibold px-4 py-2.5 rounded-[10px] hover:bg-[#0a3d38] text-sm transition-colors"
        >

          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
          </svg>

          Novo animal

        </button>

      </div>

      <div className="flex gap-3 mb-5 flex-wrap">

        <div className="relative flex-1 min-w-48">

          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M15 15l3 3" strokeLinecap="round" />
          </svg>

          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome, tutor ou raça…"
            className="w-full bg-white border border-[#D8D5CE] rounded-[10px] pl-10 pr-4 py-2.5 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30 focus:border-[#0C4A45] transition-all"
          />

        </div>

        <div className="flex gap-2">

          <button
            onClick={() => setFiltroEspecie('')}
            className={`px-3 py-2 rounded-[10px] text-sm font-medium border transition-all ${
              !filtroEspecie
                ? 'bg-[#0C4A45] text-white border-[#0C4A45]'
                : 'bg-white border-[#D8D5CE] text-[#6B7280]'
            }`}
          >
            Todos
          </button>

          {ESPECIES.slice(0, 3).map(especie => (

            <button
              key={especie}
              onClick={() =>
                setFiltroEspecie(
                  filtroEspecie === especie
                    ? ''
                    : especie
                )
              }
              className={`px-3 py-2 rounded-[10px] text-sm font-medium border transition-all ${
                filtroEspecie === especie
                  ? 'bg-[#0C4A45] text-white border-[#0C4A45]'
                  : 'bg-white border-[#D8D5CE] text-[#6B7280]'
              }`}
            >
              {ESPECIE_ICON[especie]} {especie}
            </button>

          ))}

        </div>

      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {filtrados.map(animal => (

          <button
            key={animal.id}
            onClick={() => setDetalhe(animal)}
            className="bg-white rounded-2xl border border-[#EAE8E3] p-4 text-left hover:border-[#0C4A45]/40 hover:shadow-md transition-all group"
          >

            <div className="flex items-start justify-between mb-3">

              <div className="w-10 h-10 rounded-xl bg-[#F7F5F0] flex items-center justify-center text-xl">
                {ESPECIE_ICON[animal.especie]}
              </div>

              <div className="flex gap-1">

                {animal.alerta && (
                  <span
                    className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center"
                    title="Atenção especial"
                  >
                    ⚠
                  </span>
                )}

                {animal.alergias && (
                  <span
                    className="w-5 h-5 bg-rose-400 rounded-full flex items-center justify-center"
                    title={`Alergia: ${animal.alergias}`}
                  >
                    <span className="text-white text-[9px] font-bold">
                      A
                    </span>
                  </span>
                )}

              </div>

            </div>

            <p className="font-semibold text-[#0C1A1A] mb-0.5">
              {animal.nome}
            </p>

            <p className="text-xs text-[#6B7280] mb-3">
              {animal.raca || animal.especie} · {animal.sexo} ·{' '}
              {calcIdade(animal.nascimento)}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">

              <div className="w-5 h-5 rounded-full bg-[#E8F4F0] flex items-center justify-center text-[#0C4A45] font-bold text-[10px]">
                {animal.tutorNome?.[0]}
              </div>

              <span className="truncate">
                {animal.tutorNome}
              </span>

            </div>

          </button>

        ))}

      </div>

      {filtrados.length === 0 && (
        <div className="py-16 text-center text-[#9CA3AF] bg-white rounded-2xl border border-[#EAE8E3]">
          <p className="text-4xl mb-3">
            🐾
          </p>

          <p className="font-medium">
            Nenhum animal encontrado
          </p>
        </div>
      )}

    </div>
  )
}