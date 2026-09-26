import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function Contato() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [assunto, setAssunto] = useState('')
  const [mensagem, setMensagem] = useState('')

  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    setEnviando(true)
    setErro('')

    const { error } = await supabase
      .from('mensagens_contato')
      .insert({
        nome,
        email,
        assunto,
        mensagem,
      })

    if (error) {
      console.error(error)
      setErro('Não foi possível enviar sua mensagem. Tente novamente.')
      setEnviando(false)
      return
    }

    setNome('')
    setEmail('')
    setAssunto('')
    setMensagem('')

    setEnviado(true)
    setEnviando(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <Link
            to="/"
            className="text-2xl font-bold text-emerald-600"
          >
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

      <main className="mx-auto max-w-5xl px-6 py-12">

        <div className="grid gap-8 md:grid-cols-2">

          <div>

            <span className="text-sm font-semibold text-emerald-600">
              CONTATO
            </span>

            <h1 className="mt-3 text-4xl font-bold">
              Fale com o UniVet
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
              Tem alguma dúvida, sugestão ou encontrou algum problema?
              Envie uma mensagem para a equipe do projeto.
            </p>

            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="font-semibold text-slate-900">
                Projeto UniVet
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Projeto acadêmico desenvolvido no curso de Engenharia
                de Software da UNIFIO.
              </p>

            </div>

          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">

            {enviado ? (

              <div className="py-10 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
                  ✓
                </div>

                <h2 className="text-2xl font-bold">
                  Mensagem enviada!
                </h2>

                <p className="mt-2 text-slate-600">
                  Obrigado pelo contato.
                </p>

                <button
                  onClick={() => setEnviado(false)}
                  className="mt-6 font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Enviar outra mensagem
                </button>

              </div>

            ) : (

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Nome
                  </label>

                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    placeholder="Seu nome"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    E-mail
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Assunto
                  </label>

                  <input
                    type="text"
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                    required
                    placeholder="Como podemos ajudar?"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Mensagem
                  </label>

                  <textarea
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    required
                    rows="5"
                    placeholder="Digite sua mensagem..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </div>

                {erro && (
                  <p className="text-sm text-red-600">
                    {erro}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {enviando ? 'Enviando...' : 'Enviar mensagem'}
                </button>

              </form>

            )}

          </div>

        </div>

      </main>

    </div>
  )
}