# 🐾 UniVet

**Plataforma web para gestão de estabelecimentos veterinários**

O **UniVet** é uma plataforma de gestão veterinária desenvolvida como Trabalho de Conclusão de Curso (TCC) do curso de Engenharia de Software do Centro Universitário de Ourinhos (UNIFIO).

O projeto tem como objetivo centralizar informações e apoiar a organização da rotina de clínicas, consultórios e outros estabelecimentos veterinários. Sua proposta é manter o **animal no centro da gestão**, reunindo em um só ambiente os dados do paciente, de seu tutor e de seu acompanhamento clínico.

🔗 **Aplicação:** https://univet-clinica.vercel.app  
💻 **Repositório:** https://github.com/CaioArgenta/Veterinary-Management-Platform

---

## 📌 Funcionalidades do MVP

O MVP do UniVet contempla os seguintes módulos:

| Módulo | Descrição |
|---|---|
| **Landing page** | Apresentação da plataforma e de sua proposta. |
| **Login** | Acesso dos usuários ao ambiente do estabelecimento. |
| **Cadastro** | Cadastro inicial do estabelecimento e criação do primeiro acesso administrativo. |
| **Dashboard** | Visão geral com indicadores e informações da rotina. |
| **Tutores** | Cadastro e consulta das pessoas responsáveis pelos animais. |
| **Animais** | Cadastro e gerenciamento dos pacientes e de seus dados. |
| **Agenda** | Organização dos atendimentos e compromissos. |
| **Prontuário** | Registro e consulta do histórico clínico dos animais. |
| **Vacinação** | Registro e acompanhamento das informações de vacinação. |
| **Funcionários** | Gerenciamento dos funcionários e de seus acessos ao sistema. |

---

## 🔐 Cadastro e gerenciamento de usuários

O cadastro público do UniVet é destinado ao **estabelecimento veterinário**, e não à criação individual de contas para todos os funcionários.

O fluxo de acesso funciona da seguinte forma:

1. O responsável realiza o cadastro do estabelecimento na plataforma.
2. O cadastro cria o primeiro acesso, com perfil administrativo.
3. Após entrar no sistema, o administrador pode complementar as informações do estabelecimento.
4. Na área **Funcionários**, o administrador cadastra os integrantes da equipe e cria ou define as credenciais individuais de acesso.
5. Cada funcionário passa a utilizar seu próprio login e senha.

Dessa maneira, o administrador gerencia os usuários vinculados ao estabelecimento.

---

## 🧩 Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| **React** | Desenvolvimento da interface web. |
| **Node.js** | Ambiente de execução do backend. |
| **Express** | Estruturação dos serviços e rotas da API. |
| **Supabase** | Serviços de autenticação e integração com os dados. |
| **PostgreSQL** | Banco de dados relacional. |
| **Vercel** | Publicação da aplicação web. |
| **GitHub** | Versionamento e armazenamento do código-fonte. |

---

## 🏗️ Organização geral da aplicação

O UniVet é organizado em três partes principais:

- **Frontend:** interface utilizada pelos usuários para acessar os módulos e realizar operações.
- **Backend:** serviços responsáveis por receber e processar as requisições da aplicação.
- **Banco de dados e autenticação:** armazenamento das informações e identificação dos usuários por meio dos serviços do Supabase e do PostgreSQL.

Nas operações protegidas, o acesso é associado à sessão autenticada. O backend valida o token recebido e considera o perfil do usuário e seu vínculo com o estabelecimento para autorizar as operações.

A organização dos dados por estabelecimento busca manter separados os registros de cada organização.

---

## 🗺️ Roadmap

### Próxima etapa

- [ ] Gestão financeira.
- [ ] Controle de estoque.
- [ ] Notificações.
- [ ] Internação e gerenciamento de leitos.

O gerenciamento de leitos está previsto para uma evolução futura voltada especialmente a estabelecimentos que realizam internações. Essa funcionalidade poderá incluir identificação dos leitos, controle de disponibilidade e ocupação e associação dos animais às respectivas internações.

### Funcionalidades futuras

- [ ] Integração com inteligência artificial.
- [ ] Aplicativo para dispositivos móveis.
- [ ] Integração com WhatsApp.
- [ ] Portal de acesso para tutores.
- [ ] Suporte a múltiplas unidades.
- [ ] Recursos adicionais para hospitais veterinários.

---

## 🧪 Situação do projeto

Os módulos listados na seção **Funcionalidades do MVP** foram implementados, conforme o estado atual informado pela equipe.

A execução e o registro dos testes sistemáticos de cenários e dos testes automatizados ainda estão pendentes. Portanto, a implementação dos módulos não representa, por si só, a conclusão da etapa de validação.

---

## 👥 Equipe

Projeto desenvolvido por:

- **Caio Argenta de Oliveira**
- **Elias Marques**
- **João Padovese**

Curso de Engenharia de Software — Centro Universitário de Ourinhos (UNIFIO).

---

## 🌐 Acesso

A aplicação publicada pode ser acessada em:

https://univet-clinica.vercel.app

Para consultar o código-fonte e acompanhar o desenvolvimento:

https://github.com/CaioArgenta/Veterinary-Management-Platform
