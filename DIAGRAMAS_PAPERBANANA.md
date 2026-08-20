# DIAGRAMAS_PAPERBANANA — generar diagramas conceptuales para la documentacion

> Herramienta del framework para los DIAGRAMAS conceptuales de la documentacion
> tecnica de un proyecto (arquitectura, pipeline, flujo de agentes). Es
> PaperBanana (fork de `google-research/papervizagent`): un pipeline multi-agente
> que convierte texto de metodo + caption en una figura publication-quality.
>
> Conexiones: [[CLAUDE]] | [[FRAMEWORK]]

---

## QUE ES Y QUE NO ES

PaperBanana genera **diagramas conceptuales** a partir de una descripcion escrita
(el texto de un metodo/arquitectura) y una caption. Cinco agentes en secuencia:
Retriever -> Planner -> Stylist -> Visualizer -> Critic (refina hasta 3 rondas).

| Para esto SI | Para esto NO |
|---|---|
| Diagrama de arquitectura de un sistema en `context.md`/`PLAN`/`RECONSTRUCCION` | Capturas de la UI (eso es el manual de uso, se hace con puppeteer) |
| Diagrama de pipeline (ej: los cinco cerrojos de una medicion, el flujo pre/post) | Diagramas simples inline (para eso basta mermaid en el markdown) |
| Figura de flujo de datos entre modulos para un deck o un doc de direccion | Graficas de datos con numeros exactos (usar ECharts/matplotlib) |

Regla: si el diagrama tiene que ser EXACTO en numeros, no es para PaperBanana.
Si es conceptual y quieres que se vea de paper, si.

---

## REQUISITOS (los pone el usuario, no el agente)

- **Una API key**, en `tools/PaperBanana/configs/model_config.yaml` (copiar de
  `model_config.template.yaml`) o por variable de entorno:
  - `OPENROUTER_API_KEY` (recomendada: una sola key para texto e imagen), o
  - `GOOGLE_API_KEY` (Gemini directo).
- Python 3.12 + `uv`. El repo ya esta clonado en `tools/PaperBanana/`.
- La key es un SECRETO: nunca se commitea. `configs/model_config.yaml` va al
  `.gitignore` del repo (ya lo esta en el upstream).

**El agente NUNCA teclea ni inventa la key.** Si falta, se le pide al usuario y se
para. Sin key, PaperBanana no corre — no hay fallback.

---

## USO (una figura)

```bash
cd tools/PaperBanana
uv pip install -r requirements.txt          # una sola vez
export OPENROUTER_API_KEY="sk-or-v1-..."     # o GOOGLE_API_KEY

python skill/run.py \
  --content-file /ruta/al/texto_del_metodo.md \
  --caption "Figura 1: arquitectura de <lo que sea>" \
  --task diagram \
  --output /ruta/salida.png \
  --num-candidates 4 \
  --aspect-ratio 16:9
```

- `--content` (o `--content-file`): el texto que describe lo que se dibuja.
- `--caption`: la intencion visual / el pie de figura.
- `--num-candidates N`: genera N variantes en paralelo (default 10). Cada una
  imprime su ruta absoluta en stdout. Elegir la mejor a mano.
- `--exp-mode demo_planner_critic` salta al Stylist si se quiere mas rapido.

**Costo y tiempo, medido por el upstream:** cada candidato son varias llamadas
LLM (Retriever+Planner+Stylist+Visualizer + hasta 3 de Critic) y tarda 3-10 min.
Con los 10 por defecto: 10-30 min y N veces el costo de API. **Bajar
`--num-candidates` a 3-4 salvo que se quiera barrer mucho.** Avisar del costo
antes de lanzar una tanda grande.

---

## COMO SE INTEGRA AL FLUJO DEL PROYECTO

1. El diagrama sale de un TEXTO que ya existe en la doc del proyecto (la seccion
   de arquitectura de `context.md`, el `PLAN`, etc.). No se inventa el contenido:
   se le pasa el texto real como `--content-file`.
2. La figura generada se guarda en `docs/` o `assets/` del proyecto que la pidio,
   NO en la carpeta de PaperBanana.
3. Se referencia desde el markdown del proyecto como cualquier imagen.
4. PaperBanana vive en `tools/PaperBanana/` (compartido del portafolio), no dentro
   de ningun proyecto — igual que el design system o el framework.

---

## SKILL

El repo trae `skill/SKILL.md` en formato de skill de agente (`name: paperbanana`).
Se puede exponer como skill invocable copiandolo a la carpeta de skills, pero
sigue necesitando la API key: sin ella el skill falla igual. Referencia upstream:
`github.com/dwzhu-pku/PaperBanana` (fork de `google-research/papervizagent`).

---

## REGISTRO — usos aplicados

Cada figura generada se anota: fecha, proyecto, que diagrama, candidatos, cual se
eligio. Si no queda registrado, no se considera hecho.
