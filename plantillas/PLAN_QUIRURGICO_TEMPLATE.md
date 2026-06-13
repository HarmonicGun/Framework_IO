# PLAN: `<feature>` — `<DD_MM_YY>`

> `<N>` revisiones adversariales ejecutadas.
> Este documento es el registro canonico de cada linea que se tocara.

---

## CONTEXTO

- **Por que**: `<razon del cambio>`
- **Decision del usuario**: `<que decidio el usuario>`
- **Problema que resuelve**: `<problema concreto>`

---

## ARCHIVOS A MODIFICAR (`<N>` archivos, `<M>` nuevos)

1. `path/to/file1.py` — `<descripcion breve>`
2. `path/to/file2.py` — `<descripcion breve>`
...

---

## CAMBIO 1: `archivo.py` — `<que se cambia>`

### ARCHIVO: `<ruta completa>`

### 1A — `<descripcion del sub-cambio>`

**LINEA ACTUAL (`<N>`):**
```python
<codigo exacto copiado del archivo real>
```

**LINEA NUEVA (`<N>`):**
```python
<codigo exacto nuevo>
```

**POR QUE**: `<razon del cambio>`

**QUE ROMPE**: `<analisis de impacto — que podria fallar y como se mitiga>`

---

[... repetir por cada sub-cambio y cada archivo ...]

---

## RESUMEN: TODAS LAS LINEAS TOCADAS

| # | Archivo | Lineas | Tipo | Proposito |
|---|---------|--------|------|-----------|
| 1 | `file.py` | 10, 15-18 | MODIFY | `<proposito>` |
| 2 | `file2.py` | 45-52 | INSERT | `<proposito>` |
| ... | | | | |

---

## QUE NO SE TOCA (y por que)

| Archivo/Funcion | Razon |
|---|---|
| `path/to/similar.py` | `<por que parece relacionado pero no se modifica>` |
| `funcion_relacionada()` | `<por que se deja intacta>` |

---

## BUGS ENCONTRADOS EN REVISION ADVERSARIAL

| # | Bug | Encontrado por | Severidad | Mitigacion |
|---|-----|---------------|-----------|------------|
| 1 | `<descripcion>` | `<super-context/zero-context/especialista>` | `<CRITICAL/HIGH/MEDIUM/LOW>` | `<como se evita>` |
| ... | | | | |

---

## VERIFICACION

```bash
# Syntax check
python3 -m py_compile file1.py file2.py

# Tests
pytest tests/test_feature.py -v

# Probe mode (si aplica)
curl -X POST http://localhost:8000/endpoint -d '{"probe": true}'
```

---

## ROLLBACK

```bash
# Revertir cambios si algo falla en prod
git revert <commit_hash>
# O manualmente:
# 1. <paso 1>
# 2. <paso 2>
```
