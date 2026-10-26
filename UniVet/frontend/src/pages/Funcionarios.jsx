
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

const MODULOS = [
  { id: 'dashboard', nome: 'Dashboard' },
  { id: 'tutores', nome: 'Tutores' },
  { id: 'animais', nome: 'Animais' },
  { id: 'agenda', nome: 'Agenda' },
  { id: 'consultas', nome: 'Consultas' },
  { id: 'vacinacao', nome: 'Vacinação' },
  { id: 'funcionarios', nome: 'Funcionários' },
]

const PERMISSOES_VAZIAS = MODULOS.map((modulo) => ({
  modulo: modulo.id,
  pode_visualizar: false,
  pode_cadastrar: false,
  pode_editar: false,
  pode_excluir: false,
}))

const CAMPO =
  'w-full rounded-xl border border-[#EAE8E3] bg-white px-4 py-3 text-sm outline-none focus:border-[#0C4A45]'

function Botao({
  children,
  onClick,
  tipo = 'button',
  disabled = false,
  secundario = false,
}) {
  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        secundario
          ? 'border border-[#EAE8E3] bg-white text-[#0C4A45] hover:bg-[#F7F5F0]'
          : 'bg-[#0C4A45] text-white hover:bg-[#083B37]'
      }`}
    >
      {children}
    </button>
  )
}

function Campo({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#343A36]">
        {label}
      </span>
      <input
        className={CAMPO}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </label>
  )
}

async function requisicaoAPI(url, opcoes = {}) {
  const { data, error } = await supabase.auth.getSession()

  if (error) throw error

  const token = data.session?.access_token

  if (!token) {
    throw new Error('Sua sessão expirou. Entre novamente.')
  }

  const resposta = await fetch(`${API_URL}${url}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(opcoes.headers || {}),
    },
  })

  const texto = await resposta.text()
  let dados = {}

  if (texto) {
    try {
      dados = JSON.parse(texto)
    } catch {
      throw new Error('O servidor retornou uma resposta inválida.')
    }
  }

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || 'Erro ao realizar operação.'
    )
  }

  return dados
}

function ModalFuncionario({
  funcionario,
  fechar,
  salvar,
  salvando,
}) {
  const [form, setForm] = useState({
    nome_completo: funcionario?.nome_completo || '',
    email: funcionario?.email || '',
    telefone: funcionario?.telefone || '',
    tipo: funcionario?.tipo || 'FUNCIONARIO',
    senha: '',
    permissoes: funcionario?.permissoes_funcionarios?.length
      ? MODULOS.map((modulo) => {
          const atual = funcionario.permissoes_funcionarios.find(
            (permissao) => permissao.modulo === modulo.id
          )

          return {
            modulo: modulo.id,
            pode_visualizar: atual?.pode_visualizar || false,
            pode_cadastrar: atual?.pode_cadastrar || false,
            pode_editar: atual?.pode_editar || false,
            pode_excluir: atual?.pode_excluir || false,
          }
        })
      : PERMISSOES_VAZIAS,
  })

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  function atualizarPermissao(modulo, acao, valor) {
    setForm((atual) => ({
      ...atual,
      permissoes: atual.permissoes.map((permissao) => {
        if (permissao.modulo !== modulo) return permissao

        const nova = { ...permissao, [acao]: valor }

        if (acao === 'pode_visualizar' && !valor) {
          nova.pode_cadastrar = false
          nova.pode_editar = false
          nova.pode_excluir = false
        } else if (valor && acao !== 'pode_visualizar') {
          nova.pode_visualizar = true
        }

        return nova
      }),
    }))
  }

  async function enviar(event) {
    event.preventDefault()

    if (!funcionario && form.senha.length < 8) {
      alert('A senha inicial deve ter pelo menos 8 caracteres.')
      return
    }

    await salvar({
      ...form,
      email: form.email.trim().toLowerCase(),
      telefone: form.telefone.trim(),
      senha: form.senha || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#F7F5F0] p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0C4A45]">
              {funcionario ? 'Editar funcionário' : 'Novo funcionário'}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Defina os dados de acesso e as permissões.
            </p>
          </div>
          <button
            type="button"
            onClick={fechar}
            className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-white"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <form onSubmit={enviar} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              label="Nome completo"
              value={form.nome_completo}
              onChange={(valor) => atualizarCampo('nome_completo', valor)}
              required
            />
            <Campo
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(valor) => atualizarCampo('email', valor)}
              required
            />
            <Campo
              label="Telefone"
              value={form.telefone}
              onChange={(valor) => atualizarCampo('telefone', valor)}
              placeholder="(00) 00000-0000"
            />

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#343A36]">
                Função
              </span>
              <select
                className={CAMPO}
                value={form.tipo}
                onChange={(event) =>
                  atualizarCampo('tipo', event.target.value)
                }
              >
                <option value="FUNCIONARIO">Funcionário</option>
                <option value="VETERINARIO">Veterinário</option>
              </select>
            </label>

            <div className="sm:col-span-2">
              <Campo
                label={funcionario ? 'Nova senha (opcional)' : 'Senha inicial'}
                type="password"
                value={form.senha}
                onChange={(valor) => atualizarCampo('senha', valor)}
                required={!funcionario}
                placeholder="Mínimo de 8 caracteres"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-[#0C4A45]">
              Permissões por módulo
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Selecione as ações permitidas para este funcionário.
            </p>

            <div className="overflow-x-auto rounded-xl border border-[#EAE8E3] bg-white">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-[#F7F5F0] text-[#0C4A45]">
                  <tr>
                    <th className="p-3">Módulo</th>
                    <th className="p-3">Visualizar</th>
                    <th className="p-3">Cadastrar</th>
                    <th className="p-3">Editar</th>
                    <th className="p-3">Excluir</th>
                  </tr>
                </thead>
                <tbody>
                  {MODULOS.map((modulo) => {
                    const permissao = form.permissoes.find(
                      (item) => item.modulo === modulo.id
                    )

                    return (
                      <tr
                        key={modulo.id}
                        className="border-t border-[#EAE8E3]"
                      >
                        <td className="p-3 font-medium">
                          {modulo.nome}
                        </td>
                        {[
                          'pode_visualizar',
                          'pode_cadastrar',
                          'pode_editar',
                          'pode_excluir',
                        ].map((acao) => (
                          <td key={acao} className="p-3">
                            <input
                              type="checkbox"
                              checked={permissao?.[acao] || false}
                              onChange={(event) =>
                                atualizarPermissao(
                                  modulo.id,
                                  acao,
                                  event.target.checked
                                )
                              }
                              aria-label={`${modulo.nome}: ${acao}`}
                              className="h-4 w-4 accent-[#0C4A45]"
                            />
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Botao secundario onClick={fechar}>
              Cancelar
            </Botao>
            <Botao tipo="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar funcionário'}
            </Botao>
          </div>
        </form>
      </div>
    </div>
  )
}


function ModalRastreabilidade({ fechar }) {
  const [registros, setRegistros] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [total, setTotal] = useState(0)

  const LIMITE = 10

  useEffect(() => {
    let ativo = true

    async function carregarHistorico() {
      setCarregando(true)
      setErro('')

      try {
        const dados = await requisicaoAPI(
          `/api/rastreabilidade?pagina=${pagina}&limite=${LIMITE}`
        )

        if (!ativo) return

        setRegistros(
          Array.isArray(dados) ? dados : dados.registros || []
        )
        setTotal(dados.total ?? 0)
        setTotalPaginas(Math.max(dados.totalPaginas || 1, 1))
      } catch (error) {
        if (!ativo) return

        setErro(error.message || 'Não foi possível carregar o histórico.')
        setRegistros([])
        setTotal(0)
        setTotalPaginas(1)
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregarHistorico()

    return () => {
      ativo = false
    }
  }, [pagina])

  function formatarData(data) {
    if (!data) return '—'

    const dataValida = new Date(data)

    return Number.isNaN(dataValida.getTime())
      ? '—'
      : dataValida.toLocaleString('pt-BR')
  }

  function traduzirAcao(acao) {
    const valor = String(acao || '').toUpperCase()

    const traducoes = {
      INSERT: 'Criar',
      CREATE: 'Criar',
      UPDATE: 'Editar',
      EDIT: 'Editar',
      DELETE: 'Excluir',
      REMOVE: 'Excluir',
      SELECT: 'Consultar',
      LOGIN: 'Entrar',
      LOGOUT: 'Sair',
    }

    return traducoes[valor] || acao || '—'
  }

  function nomeTabela(tabela) {
    const nomes = {
      animais: 'Animais',
      tutores: 'Tutores',
      agendamentos: 'Agenda',
      consultas: 'Consultas',
      vacinacoes: 'Vacinação',
      funcionarios: 'Funcionários',
      perfis: 'Perfis',
      permissoes_funcionarios: 'Permissões',
      estabelecimentos: 'Estabelecimentos',
    }

    return nomes[String(tabela || '').toLowerCase()] || tabela || '—'
  }

  function nomeCampo(campo) {
    const nomes = {
      nome_completo: 'Nome completo',
      nome: 'Nome',
      email: 'E-mail',
      telefone: 'Telefone',
      tipo: 'Função',
      ativo: 'Situação',
      peso: 'Peso',
      especie: 'Espécie',
      raca: 'Raça',
      data_nascimento: 'Data de nascimento',
      estabelecimento_id: 'Estabelecimento',
      criado_em: 'Data de criação',
      atualizado_em: 'Última atualização',
      pode_visualizar: 'Visualizar',
      pode_cadastrar: 'Cadastrar',
      pode_editar: 'Editar',
      pode_excluir: 'Excluir',
    }

    return nomes[campo] ||
      String(campo)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letra) => letra.toUpperCase())
  }

  function formatarValor(valor) {
    if (valor === null || valor === undefined || valor === '') {
      return 'Vazio'
    }

    if (typeof valor === 'boolean') {
      return valor ? 'Sim' : 'Não'
    }

    if (typeof valor === 'object') {
      return JSON.stringify(valor, null, 2)
    }

    return String(valor)
  }

  function obterAlteracoes(registro) {
    const antes =
      registro.dados_anteriores ??
      registro.old_data ??
      registro.dados_antes ??
      null

    const depois =
      registro.dados_novos ??
      registro.new_data ??
      registro.dados_depois ??
      null

    if (!antes && !depois) {
      return []
    }

    const dadosAntes =
      antes && typeof antes === 'object' ? antes : {}
    const dadosDepois =
      depois && typeof depois === 'object' ? depois : {}

    const campos = [
      ...new Set([
        ...Object.keys(dadosAntes),
        ...Object.keys(dadosDepois),
      ]),
    ]

    return campos
      .filter((campo) => {
        return JSON.stringify(dadosAntes[campo] ?? null) !==
          JSON.stringify(dadosDepois[campo] ?? null)
      })
      .map((campo) => ({
        campo,
        antes: dadosAntes[campo],
        depois: dadosDepois[campo],
        tinhaAntes: Object.prototype.hasOwnProperty.call(
          dadosAntes,
          campo
        ),
        temDepois: Object.prototype.hasOwnProperty.call(
          dadosDepois,
          campo
        ),
      }))
  }

  function corAcao(acao) {
    const valor = String(acao || '').toUpperCase()

    if (['INSERT', 'CREATE'].includes(valor)) {
      return 'bg-green-100 text-green-800'
    }

    if (['UPDATE', 'EDIT'].includes(valor)) {
      return 'bg-blue-100 text-blue-800'
    }

    if (['DELETE', 'REMOVE'].includes(valor)) {
      return 'bg-red-100 text-red-800'
    }

    return 'bg-gray-100 text-gray-700'
  }

  const filtrados = registros.filter((registro) => {
    const termo = busca.trim().toLowerCase()

    if (!termo) return true

    const alteracoes = obterAlteracoes(registro)

    const textoAlteracoes = alteracoes
      .map((item) =>
        `${nomeCampo(item.campo)} ${formatarValor(item.antes)} ${formatarValor(item.depois)}`
      )
      .join(' ')

    return [
      registro.usuario,
      registro.nome_usuario,
      registro.acao,
      registro.tabela,
      registro.modulo,
      registro.descricao,
      textoAlteracoes,
    ].some((valor) =>
      String(valor || '').toLowerCase().includes(termo)
    )
  })

  function mudarPagina(novaPagina) {
    if (novaPagina < 1 || novaPagina > totalPaginas) return
    setPagina(novaPagina)
  }

  function paginasVisiveis() {
    const paginas = new Set([
      1,
      totalPaginas,
      pagina - 1,
      pagina,
      pagina + 1,
    ])

    return [...paginas]
      .filter((numero) => numero >= 1 && numero <= totalPaginas)
      .sort((a, b) => a - b)
  }

  const paginas = paginasVisiveis()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="max-h-[92vh] w-full max-w-7xl overflow-y-auto rounded-2xl bg-[#F7F5F0] p-4 shadow-xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0C4A45]">
              Rastreabilidade
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Histórico de ações e alterações realizadas no UniVet.
            </p>
          </div>

          <button
            type="button"
            onClick={fechar}
            className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-white"
            aria-label="Fechar rastreabilidade"
          >
            ×
          </button>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className={`${CAMPO} sm:max-w-md`}
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar nesta página..."
            aria-label="Buscar no histórico desta página"
          />

          <p className="text-sm text-gray-600">
            {total} registro(s) no histórico
          </p>
        </div>

        {erro && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {erro}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-[#EAE8E3] bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#0C4A45] text-white">
              <tr>
                <th className="p-3">Data e hora</th>
                <th className="p-3">Usuário</th>
                <th className="p-3">Ação</th>
                <th className="p-3">Módulo / tabela</th>
                <th className="p-3">Descrição das alterações</th>
              </tr>
            </thead>

            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Carregando histórico...
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    {erro
                      ? 'Não foi possível carregar os registros.'
                      : 'Nenhum registro encontrado nesta página.'}
                  </td>
                </tr>
              ) : (
                filtrados.map((registro, indice) => {
                  const alteracoes = obterAlteracoes(registro)
                  const acaoOriginal = registro.acao

                  return (
                    <tr
                      key={registro.id || indice}
                      className="border-t border-[#EAE8E3] align-top hover:bg-[#FAF9F6]"
                    >
                      <td className="whitespace-nowrap p-3 text-gray-600">
                        {formatarData(
                          registro.criado_em ||
                          registro.created_at ||
                          registro.data
                        )}
                      </td>

                      <td className="p-3 font-medium text-[#26332E]">
                        {registro.usuario ||
                          registro.nome_usuario ||
                          '—'}
                      </td>

                      <td className="p-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${corAcao(acaoOriginal)}`}
                        >
                          {traduzirAcao(acaoOriginal)}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="font-medium text-[#0C4A45]">
                          {nomeTabela(registro.modulo || registro.tabela)}
                        </span>
                        {registro.registro_id && (
                          <p className="mt-1 max-w-[170px] break-all text-xs text-gray-400">
                            ID: {registro.registro_id}
                          </p>
                        )}
                      </td>

                      <td className="p-3">
                        {alteracoes.length > 0 ? (
                          <div className="space-y-3">
                            {alteracoes.map((item) => (
                              <div
                                key={item.campo}
                                className="rounded-lg border border-[#EAE8E3] p-3"
                              >
                                <p className="mb-2 font-semibold text-[#26332E]">
                                  {nomeCampo(item.campo)}
                                </p>

                                <div className="grid gap-2 sm:grid-cols-2">
                                  <div className="min-w-0 rounded-md bg-red-50 p-2">
                                    <p className="mb-1 text-xs font-semibold text-red-700">
                                      Antes
                                    </p>
                                    <p className="break-words whitespace-pre-wrap text-sm text-gray-700">
                                      {item.tinhaAntes
                                        ? formatarValor(item.antes)
                                        : 'Não existia'}
                                    </p>
                                  </div>

                                  <div className="min-w-0 rounded-md bg-green-50 p-2">
                                    <p className="mb-1 text-xs font-semibold text-green-700">
                                      Depois
                                    </p>
                                    <p className="break-words whitespace-pre-wrap text-sm text-gray-700">
                                      {item.temDepois
                                        ? formatarValor(item.depois)
                                        : 'Removido'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">
                            {registro.descricao ||
                              registro.detalhe ||
                              'Não há detalhes de antes e depois para este registro.'}
                          </p>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Página {pagina} de {totalPaginas}
            {' · '}
            {LIMITE} registros por página
          </p>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              disabled={pagina === 1 || carregando}
              onClick={() => mudarPagina(pagina - 1)}
              className="rounded-lg border border-[#EAE8E3] bg-white px-3 py-2 text-sm font-medium text-[#0C4A45] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            {paginas.map((numero, indice) => (
              <span key={numero} className="flex items-center gap-1">
                {indice > 0 && numero - paginas[indice - 1] > 1 && (
                  <span className="px-1 text-gray-400">…</span>
                )}

                <button
                  type="button"
                  onClick={() => mudarPagina(numero)}
                  disabled={carregando}
                  aria-current={pagina === numero ? 'page' : undefined}
                  className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50 ${
                    pagina === numero
                      ? 'border-[#0C4A45] bg-[#0C4A45] text-white'
                      : 'border-[#EAE8E3] bg-white text-[#0C4A45] hover:bg-gray-50'
                  }`}
                >
                  {numero}
                </button>
              </span>
            ))}

            <button
              type="button"
              disabled={pagina === totalPaginas || carregando}
              onClick={() => mudarPagina(pagina + 1)}
              className="rounded-lg border border-[#EAE8E3] bg-white px-3 py-2 text-sm font-medium text-[#0C4A45] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Botao secundario onClick={fechar}>
            Fechar
          </Botao>
        </div>
      </div>
    </div>
  )
}


export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [rastreabilidadeAberta, setRastreabilidadeAberta] = useState(false)
  const [selecionado, setSelecionado] = useState(null)
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function carregarFuncionarios() {
    setCarregando(true)
    setErro('')

    try {
      const dados = await requisicaoAPI('/api/funcionarios')
      setFuncionarios(Array.isArray(dados) ? dados : [])
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar os funcionários.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarFuncionarios()
  }, [])

  async function salvarFuncionario(form) {
    setSalvando(true)
    setErro('')
    setSucesso('')

    try {
      const editando = Boolean(selecionado)
      const dados = { ...form }

      if (!dados.senha) delete dados.senha

      await requisicaoAPI(
        editando
          ? `/api/funcionarios/${selecionado.id}`
          : '/api/funcionarios',
        {
          method: editando ? 'PUT' : 'POST',
          body: JSON.stringify(dados),
        }
      )

      setModalAberto(false)
      setSelecionado(null)
      setSucesso(
        editando
          ? 'Funcionário atualizado com sucesso.'
          : 'Funcionário cadastrado com sucesso.'
      )

      await carregarFuncionarios()
    } catch (error) {
      setErro(error.message || 'Não foi possível salvar o funcionário.')
    } finally {
      setSalvando(false)
    }
  }

  async function alterarStatus(funcionario) {
    const novoStatus = !funcionario.ativo
    const acao = novoStatus ? 'ativar' : 'desativar'

    if (!window.confirm(`Deseja ${acao} ${funcionario.nome_completo}?`)) {
      return
    }

    setErro('')
    setSucesso('')

    try {
      await requisicaoAPI(`/api/funcionarios/${funcionario.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ ativo: novoStatus }),
      })

      setSucesso(
        novoStatus
          ? 'Funcionário ativado com sucesso.'
          : 'Funcionário desativado com sucesso.'
      )

      await carregarFuncionarios()
    } catch (error) {
      setErro(error.message || 'Não foi possível alterar o status.')
    }
  }

  const filtrados = funcionarios.filter((funcionario) => {
    const termo = busca.toLowerCase()

    return (
      funcionario.nome_completo?.toLowerCase().includes(termo) ||
      funcionario.email?.toLowerCase().includes(termo) ||
      funcionario.tipo?.toLowerCase().includes(termo)
    )
  })

  return (
    <div className="min-h-full space-y-6 bg-[#F7F5F0] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0C1A1A]">
            Funcionários
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie os acessos e as permissões da sua equipe.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Botao
            secundario
            onClick={() => setRastreabilidadeAberta(true)}
          >
            <span className="inline-flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              Rastreabilidade
            </span>
          </Botao>

          <Botao
            onClick={() => {
              setSelecionado(null)
              setModalAberto(true)
              setErro('')
            }}
          >
            + Novo funcionário
          </Botao>
        </div>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {sucesso}
        </div>
      )}

      <div className="rounded-xl border border-[#EAE8E3] bg-white p-3">
        <input
          className={CAMPO}
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar por nome, e-mail ou função..."
          aria-label="Buscar funcionários"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#EAE8E3] bg-white">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-[#F7F5F0] text-[#0C4A45]">
            <tr>
              <th className="p-4">Funcionário</th>
              <th className="p-4">Função</th>
              <th className="p-4">Situação</th>
              <th className="p-4">Permissões</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Carregando funcionários...
                </td>
              </tr>
            ) : filtrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Nenhum funcionário encontrado.
                </td>
              </tr>
            ) : (
              filtrados.map((funcionario) => (
                <tr
                  key={funcionario.id}
                  className="border-t border-[#EAE8E3]"
                >
                  <td className="p-4">
                    <p className="font-semibold text-[#26332E]">
                      {funcionario.nome_completo}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {funcionario.email}
                    </p>
                  </td>
                  <td className="p-4">
                    {funcionario.tipo === 'VETERINARIO'
                      ? 'Veterinário'
                      : funcionario.tipo === 'ADMINISTRADOR'
                        ? 'Administrador'
                        : 'Funcionário'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        funcionario.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {funcionario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4">
                    {funcionario.tipo === 'ADMINISTRADOR'
                      ? 'Acesso administrativo'
                      : `${
                          funcionario.permissoes_funcionarios?.filter(
                            (item) => item.pode_visualizar
                          ).length || 0
                        } módulos`}
                  </td>
                  <td className="p-4">
                    {funcionario.tipo === 'ADMINISTRADOR' ? (
                      <span className="block text-right text-xs text-gray-400">
                        —
                      </span>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelecionado(funcionario)
                            setModalAberto(true)
                            setErro('')
                          }}
                          className="rounded-lg border border-[#EAE8E3] px-3 py-2 font-medium text-[#0C4A45] hover:bg-[#F7F5F0]"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => alterarStatus(funcionario)}
                          className="rounded-lg border border-[#EAE8E3] px-3 py-2 font-medium text-gray-600 hover:bg-[#F7F5F0]"
                        >
                          {funcionario.ativo ? 'Desativar' : 'Ativar'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <ModalFuncionario
          funcionario={selecionado}
          fechar={() => {
            if (!salvando) {
              setModalAberto(false)
              setSelecionado(null)
            }
          }}
          salvar={salvarFuncionario}
          salvando={salvando}
        />
      )}

      {rastreabilidadeAberta && (
        <ModalRastreabilidade
          fechar={() => setRastreabilidadeAberta(false)}
        />
      )}
    </div>
  )
}
