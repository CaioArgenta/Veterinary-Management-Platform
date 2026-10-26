
const supabase = require('./supabase');

async function listarLogs(estabelecimentoId, filtros = {}) {
  const pagina = Math.max(Number(filtros.pagina) || 1, 1);
  const limite = Math.min(Math.max(Number(filtros.limite) || 20, 1), 100);
  const inicio = (pagina - 1) * limite;

  let consulta = supabase
    .from('audit_logs')
    .select(`
      id,
      estabelecimento_id,
      usuario_id,
      acao,
      tabela,
      registro_id,
      dados_anteriores,
      dados_novos,
      criado_em
    `, { count: 'exact' })
    .eq('estabelecimento_id', estabelecimentoId)
    .order('criado_em', { ascending: false })
    .range(inicio, inicio + limite - 1);

  if (filtros.acao) {
    consulta = consulta.eq('acao', filtros.acao);
  }

  if (filtros.tabela) {
    consulta = consulta.eq('tabela', filtros.tabela);
  }

  if (filtros.dataInicio) {
    consulta = consulta.gte('criado_em', filtros.dataInicio);
  }

  if (filtros.dataFim) {
    consulta = consulta.lte(
      'criado_em',
      `${filtros.dataFim}T23:59:59.999Z`
    );
  }

  const { data, error, count } = await consulta;

  if (error) {
    throw error;
  }

  const registros = data || [];
  const usuariosIds = [
    ...new Set(
      registros
        .map((registro) => registro.usuario_id)
        .filter(Boolean)
    ),
  ];

  let nomesUsuarios = new Map();

  if (usuariosIds.length > 0) {
    const { data: perfis, error: erroPerfis } = await supabase
      .from('perfis')
      .select('id, nome_completo')
      .eq('estabelecimento_id', estabelecimentoId)
      .in('id', usuariosIds);

    if (erroPerfis) {
      throw erroPerfis;
    }

    nomesUsuarios = new Map(
      (perfis || []).map((perfil) => [
        perfil.id,
        perfil.nome_completo,
      ])
    );
  }

  const registrosComUsuario = registros.map((registro) => ({
    ...registro,
    usuario: nomesUsuarios.get(registro.usuario_id) || null,
  }));

  return {
    registros: registrosComUsuario,
    pagina,
    limite,
    total: count || 0,
    totalPaginas: Math.ceil((count || 0) / limite),
  };
}

module.exports = {
  listarLogs,
};
