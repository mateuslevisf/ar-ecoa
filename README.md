# 🎯 Experiência de Realidade Aumentada - ECOA PUC-Rio

Uma aplicação web educacional de Realidade Aumentada desenvolvida para o Instituto ECOA da PUC-Rio, utilizando A-Frame e AR.js para demonstrar conceitos de visão computacional e tracking de padrões.

## 🌟 Funcionalidades

- **Interface responsiva** otimizada para dispositivos móveis
- **Três marcadores diferentes** com objetos 3D únicos
- **Navegação intuitiva** entre página inicial e experiência AR
- **Design educacional** focado em estudantes
- **Experiência autoexplicativa** com instruções claras

## 📱 Marcadores Disponíveis

| Marcador | Objeto 3D | Descrição |
|----------|-----------|-----------|
| **Hiro** | Esfera vermelha + Cilindro amarelo | Marcador padrão do AR.js |
| **AR.js** | Cubo azul | Marcador personalizado AR.js |
| **Custom** | Modelo 3D de abacate | Padrão geométrico customizado |

## 🚀 Como Usar

### Pré-requisitos

- Navegador moderno com suporte à câmera
- Conexão HTTPS (obrigatória para acesso à câmera)
- Boa iluminação para detecção dos padrões
- Padrões impressos ou em tela secundária

### Instalação Local

1. **Clone o repositório:**
```bash
git clone [url-do-repositorio]
cd ar-ecoa
```

2. **Estrutura de arquivos necessária:**
```
ar-ecoa/
├── files/
│   ├── arjs.patt      # Padrão AR.js
│   ├── custom.patt    # Padrão customizado
│   └── Avocado.glb    # Modelo 3D do abacate
├── images/
│   ├── hiro.png       # Imagem do padrão Hiro
│   ├── arjs.png       # Imagem do padrão AR.js
│   └── custom.png     # Imagem do padrão customizado
├── index.html         # Página inicial
├── ar.html           # Experiência AR
├── cert.pem          # Certificado SSL (local)
├── key.pem           # Chave SSL (local)
├── .gitignore        # Arquivos ignorados pelo git
└── README.md
```

3. **Gerar certificado SSL (primeira vez):**
```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
```

**⚠️ Importante:** Os certificados SSL são apenas para desenvolvimento local e **não devem** ser commitados no repositório. Eles já estão incluídos no `.gitignore`.

4. **Instalar servidor HTTPS:**
```bash
npm install -g http-server
```

5. **Executar localmente:**
```bash
http-server . -p 8443 -S -C cert.pem -K key.pem
```

6. **Acessar no navegador:**
```
https://localhost:8443
```
*Aceite o aviso de segurança quando solicitado*

### Imagens dos Marcadores

Para uma melhor experiência do usuário, adicione imagens dos marcadores na pasta `images/`:

- `images/hiro.png` - Captura do padrão Hiro
- `images/arjs.png` - Captura do padrão AR.js
- `images/custom.png` - Captura do padrão customizado

Se as imagens não estiverem presentes, a página exibirá placeholders coloridos automáticamente.

## 🔧 Desenvolvimento

### Tecnologias Utilizadas

- **A-Frame 1.7.0** - Framework WebXR para experiências VR/AR
- **AR.js** - Biblioteca para tracking de marcadores em navegadores
- **HTML5/CSS3** - Interface responsiva moderna
- **JavaScript** - Funcionalidades interativas

### Estrutura do Código

#### `index.html` - Página Inicial
- Landing page com apresentação dos marcadores
- Instruções de uso detalhadas
- Design responsivo e educacional
- Botão para iniciar experiência AR

#### `ar.html` - Experiência AR
- Cena A-Frame com tracking de marcadores
- Overlay de navegação e instruções
- Tela de carregamento com permissões de câmera
- Objetos 3D posicionados sobre os marcadores

### Personalizações

#### Adicionar Novos Marcadores
1. Gere um novo arquivo `.patt` usando ferramentas como [AR.js Marker Training](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html)
2. Adicione o arquivo na pasta `files/`
3. Inclua o marcador no `ar.html`:
```html
<a-marker type="pattern" url="files/novo-marcador.patt">
  <a-box position="0 0.5 0" color="#FF0000"></a-box>
</a-marker>
```

#### Modificar Objetos 3D
- **Primitivos A-Frame:** `<a-box>`, `<a-sphere>`, `<a-cylinder>`
- **Modelos customizados:** Formatos `.glb`, `.gltf`
- **Propriedades:** `position`, `rotation`, `scale`, `color`

## 🎓 Uso Educacional

### Para Professores
- Demonstração prática de conceitos de visão computacional
- Introdução à realidade aumentada acessível via navegador
- Exemplo de desenvolvimento web moderno
- Base para projetos estudantis expandidos

### Para Estudantes
- Experiência hands-on com AR
- Código fonte aberto para aprendizado
- Possibilidade de criar marcadores próprios
- Introdução às tecnologias WebXR

## 📋 Solução de Problemas

### Câmera não funciona
- ✅ Verifique se está usando HTTPS
- ✅ Conceda permissão de câmera ao navegador
- ✅ Teste em dispositivo móvel se desktop não funcionar

### Marcadores não são detectados
- ✅ Melhore a iluminação
- ✅ Mantenha distância de 20-50cm do marcador
- ✅ Certifique-se que o marcador está completamente visível
- ✅ Evite reflexos na superfície do marcador

### Objetos 3D não aparecem
- ✅ Verifique console do navegador para erros
- ✅ Confirme que arquivos `.patt` e `.glb` estão no local correto
- ✅ Teste diferentes marcadores individualmente