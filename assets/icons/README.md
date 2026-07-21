# Atmus Icons — Rounded

A coleção contém 5.973 ícones rounded nos estilos Solid, Stroke, Duotone,
Twotone e Bulk.

Inclua o CSS com todas as famílias:

```html
<link rel="stylesheet" href="/assets/icons/all.min.css">
```

Solid é o estilo padrão:

```html
<i class="atm atm-bank" aria-hidden="true"></i>
```

Para trocar o estilo, mantenha a classe do ícone e acrescente uma destas
classes:

```html
<i class="atm atm-solid atm-bank" aria-hidden="true"></i>
<i class="atm atm-stroke atm-bank" aria-hidden="true"></i>
<i class="atm atm-duotone atm-bank" aria-hidden="true"></i>
<i class="atm atm-twotone atm-bank" aria-hidden="true"></i>
<i class="atm atm-bulk atm-bank" aria-hidden="true"></i>
```

As cinco fontes compartilham o mesmo mapa Unicode. Assim, alterar apenas a
classe de estilo nunca troca o ícone selecionado.

## Regeneração

```powershell
python -m pip install -r tools/requirements-icon-fonts.txt
python tools/generate-rounded-icon-fonts.py
```

O gerador lê exclusivamente `icons/rounded/{style}` e atualiza os arquivos
TTF, WOFF e WOFF2 em `assets/icons/fonts`.
