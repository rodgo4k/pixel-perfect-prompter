

## Plano: Ajustar layout da tela inicial para 1912x1702px

### O que será feito

Ajustar o container principal da página inicial para ter exatamente **1912px de largura** e **1702px de altura**, com todos os elementos internos se encaixando proporcionalmente dentro desse espaço.

### Alterações técnicas

**1. `src/pages/Index.tsx`**
- Trocar `max-w-6xl` (1152px) por `max-w-[1912px]` no container principal
- Definir `min-h-[1702px]` no wrapper da página para garantir a altura total
- Centralizar o layout com `mx-auto`

**2. `src/components/ReleasesSection.tsx`**
- Remover a largura fixa inline de `423.5px` dos itens e usar classes responsivas que se adaptem ao novo container maior
- Manter a grade de 3 colunas com gap adequado para preencher o espaço disponível

**3. `src/components/HeroBanner.tsx`**
- O `maxWidth: 1912` já está definido — manter como está

**4. `src/components/Footer.tsx`**
- Trocar `max-w-6xl` por `max-w-[1912px]` para alinhar com o resto da página

**5. `src/components/RecentWorksSection.tsx`**
- Nenhuma alteração necessária — já se adapta ao container pai

### Resultado esperado
A página inteira ocupará até 1912px de largura centralizada, com todos os componentes (header, banner, lançamentos, trending, obras recentes, footer) alinhados dentro desse espaço sem cortes ou desalinhamentos.

