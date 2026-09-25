import { useState } from 'react'

const tutoresIniciais = [
  {
    id: 1,
    nome: 'João Silva',
    cpf: '123.456.789-00',
    telefone: '(14) 99999-1111',
    email: 'joao@email.com',
    cidade: 'Ourinhos',
    estado: 'SP',
    animais: ['Thor', 'Mel']
  },
  {
    id: 2,
    nome: 'Maria Santos',
    cpf: '987.654.321-00',
    telefone: '(14) 98888-2222',
    email: 'maria@email.com',
    cidade: 'Ourinhos',
    estado: 'SP',
    animais: ['Luna']
  },
  {
    id: 3,
    nome: 'Carlos Oliveira',
    cpf: '456.789.123-00',
    telefone: '(14) 97777-3333',
    email: 'carlos@email.com',
    cidade: 'Chavantes',
    estado: 'SP',
    animais: []
  }
]

function Campo({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0C1A1A] mb-1.5">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#D8D5CE] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0C4A45]"
      />
    </div>
  )
}

function ModalTutor({ tutor, fechar, salvar }) {
  const [form, setForm] = useState({
    nome: tutor?.nome || '',
    cpf: tutor?.cpf || '',
    telefone: tutor?.telefone || '',
    email: tutor?.email || '',
    cidade: tutor?.cidade || '',
    estado: tutor?.estado || '',
  })

  function alterar(campo, valor) {
    setForm(atual => ({
      ...atual,
      [campo]: valor
    }))
  }

  function confirmar() {
    if (!form.nome.trim()) {
      alert('Digite o nome do tutor.')
      return
    }

    if (!form.telefone.trim()) {
      alert('Digite o telefone do tutor.')
      return
    }

    salvar(form)
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
      onClick={fechar}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#EAE8E3]">
          <div>
            <h2 className="text-lg font-semibold text-[#0C1A1A]">
              {tutor ? 'Editar tutor' : 'Novo tutor'}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {tutor
                ? 'Atualize os dados do tutor'
                : 'Cadastre um novo tutor'}
            </p>
          </div>

          <button
            onClick={fechar}
            className="text-gray-400 text-2xl hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Campo
            label="Nome completo *"
            value={form.nome}
            onChange={valor => alterar('nome', valor)}
            placeholder="Nome completo"
          />

          <Campo
            label="CPF"
            value={form.cpf}
            onChange={valor => alterar('cpf', valor)}
            placeholder="000.000.000-00"
          />

          <Campo
            label="Telefone *"
            value={form.telefone}
            onChange={valor => alterar('telefone', valor)}
            placeholder="(14) 99999-9999"
          />

          <Campo
            label="E-mail"
            value={form.email}
            onChange={valor => alterar('email', valor)}
            placeholder="email@exemplo.com"
            type="email"
          />

          <div className="grid grid-cols-2 gap-4">
            <Campo
              label="Cidade"
              value={form.cidade}
              onChange={valor => alterar('cidade', valor)}
              placeholder="Ourinhos"
            />

            <div>
              <label className="block text-sm font-medium text-[#0C1A1A] mb-1.5">
                Estado
              </label>

              <select
                value={form.estado}
                onChange={e => alterar('estado', e.target.value)}
                className="w-full border border-[#D8D5CE] rounded-lg px-4 py-2.5 text-sm bg-white outline-none"
              >
                <option value="">Selecione</option>
                <option value="SP">SP</option>
                <option value="PR">PR</option>
                <option value="MG">MG</option>
                <option value="RJ">RJ</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-[#EAE8E3]">
          <button
            onClick={fechar}
            className="flex-1 border border-[#D8D5CE] rounded-lg py-2.5 text-sm"
          >
            Cancelar
          </button>

          <button
            onClick={confirmar}
            className="flex-1 bg-[#0C4A45] text-white rounded-lg py-2.5 text-sm font-medium"
          >
            {tutor ? 'Salvar alterações' : 'Cadastrar tutor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Tutores() {
  const [tutores, setTutores] = useState(tutoresIniciais)
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(null)

  const tutoresFiltrados = tutores.filter(tutor => {
    const termo = busca.toLowerCase()

    return (
      tutor.nome.toLowerCase().includes(termo) ||
      tutor.email.toLowerCase().includes(termo) ||
      tutor.telefone.includes(termo)
    )
  })

  function salvarTutor(dados) {
    if (modal === 'novo') {
      const novoTutor = {
        id: Date.now(),
        ...dados,
        animais: []
      }

      setTutores(atual => [...atual, novoTutor])
    } else {
      setTutores(atual =>
        atual.map(tutor =>
          tutor.id === modal.id
            ? {
                ...tutor,
                ...dados
              }
            : tutor
        )
      )
    }

    setModal(null)
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">

      {modal !== null && (
        <ModalTutor
          tutor={modal === 'novo' ? null : modal}
          fechar={() => setModal(null)}
          salvar={salvarTutor}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0C1A1A]">
            Tutores
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {tutores.length} tutores cadastrados
          </p>
        </div>

        <button
          onClick={() => setModal('novo')}
          className="bg-[#0C4A45] text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          + Novo tutor
        </button>
      </div>

      <div className="mb-5">
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome, e-mail ou telefone..."
          className="w-full bg-white border border-[#D8D5CE] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0C4A45]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#EAE8E3] overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAF8]">
              <tr className="border-b border-[#EAE8E3]">
                <th className="text-left px-5 py-4 font-medium">
                  Tutor
                </th>

                <th className="text-left px-5 py-4 font-medium">
                  Contato
                </th>

                <th className="text-left px-5 py-4 font-medium">
                  Cidade
                </th>

                <th className="text-left px-5 py-4 font-medium">
                  Animais
                </th>

                <th className="text-right px-5 py-4 font-medium">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {tutoresFiltrados.map(tutor => (
                <tr
                  key={tutor.id}
                  className="border-b border-[#EAE8E3] hover:bg-[#FAFAF8]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E8F4F0] flex items-center justify-center text-[#0C4A45] font-semibold">
                        {tutor.nome.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-[#0C1A1A]">
                          {tutor.nome}
                        </p>

                        <p className="text-xs text-gray-400">
                          {tutor.cpf || 'CPF não informado'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p>{tutor.telefone}</p>

                    <p className="text-xs text-gray-400 mt-1">
                      {tutor.email || 'E-mail não informado'}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-gray-500">
                    {tutor.cidade || '—'}
                    {tutor.estado && ` · ${tutor.estado}`}
                  </td>

                  <td className="px-5 py-4">
                    <span className="bg-[#E8F4F0] text-[#0C4A45] px-3 py-1.5 rounded-full text-xs font-medium">
                      🐾 {tutor.animais.length}{' '}
                      {tutor.animais.length === 1
                        ? 'animal'
                        : 'animais'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setModal(tutor)}
                      className="text-[#0C4A45] text-sm font-medium hover:underline"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tutoresFiltrados.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <div className="text-4xl mb-3">
              🔍
            </div>

            <p className="font-medium">
              Nenhum tutor encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  )
}