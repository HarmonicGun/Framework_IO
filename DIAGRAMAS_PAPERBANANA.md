# DIAGRAMAS_PAPERBANANA — generar diagramas conceptuales para la documentacion

> Herramienta del framework para los DIAGRAMAS conceptuales de la documentacion
> tecnica de un proyecto (arquitectura, pipeline, flujo entre modulos). Es
> PaperBanana (fork de `google-research/papervizagent`): un pipeline multi-agente
> que convierte texto de metodo + caption en una figura de calidad de publicacion.
>
> Conexiones: `CLAUDE.md` | `FRAMEWORK.md` | `ONBOARDING.md`

---

## QUE ES Y QUE NO ES

PaperBanana genera **diagramas conceptuales** a partir de una descripcion escrita
(el texto de un metodo o de una arquitectura) y una caption. Cinco agentes en
secuencia: Retriever -> Planner -> Stylist -> Visualizer -> Critic (este ultimo
refina hasta 3 rondas).

| Para esto SI | Para esto NO |
|---|---|
| Diagrama de arquitectura de un sistema, para `context.md` o un plan tecnico | Capturas de la interfaz (eso es el manual de uso: se hace con un navegador headless) |
| Diagrama de un pipeline o de una maquina de estados de varias etapas | Diagramas simples de 3-4 cajas (para eso basta `mermaid` inline en el markdown) |
| Figura de flujo de datos entre modulos para un deck o un documento de direccion | Graficas de datos con numeros exactos (usar una libreria de charts) |

**Regla de decision:** si el diagrama tiene que ser EXACTO en numeros, no es para
PaperBanana. Si es conceptual y quieres que se vea de paper, si. Y si cabe en
cuatro cajas y dos flechas, `mermaid` es mas barato, mas rapido y versionable en
texto — no gastes una corrida de agentes en eso.

---

## INSTALACION (una sola vez, por maquina)

El framework NO incluye la herramienta: es un repo de terceros que cada quien
clona. Vive fuera de los proyectos, como recurso compartido del portafolio:

```bash
mkdir -p tools && cd tools
git clone https://github.com/dwzhu-pku/PaperBanana.git
cd PaperBanana
uv pip install -r requirements.txt
```

Requiere Python 3.12 y `uv`.

---

## REQUISITOS (la key la pone la persona, no el agente)

- **Una API key**, por variable de entorno o en `configs/model_config.yaml`
  (copiar de `configs/model_config.template.yaml`):
  - `OPENROUTER_API_KEY` — recomendada: una sola key cubre texto e imagen, o
  - `GOOGLE_API_KEY` — Gemini directo.
- Si estan configuradas las dos, se usa OpenRouter por defecto.
- La key es un SECRETO: nunca se commitea. `configs/model_config.yaml` ya viene
  en el `.gitignore` del upstream — verificalo antes de tu primer commit.

**El agente NUNCA teclea ni inventa una API key.** Si falta, la pide y se detiene.
Sin key PaperBanana no corre: no hay modo de respaldo.

---

## USO (una figura)

```bash
cd tools/PaperBanana
export OPENROUTER_API_KEY="..."          # o GOOGLE_API_KEY

python skill/run.py \
  --content-file /ruta/al/texto_del_metodo.md \
  --caption "Figura 1: arquitectura de <lo que sea>" \
  --task diagram \
  --output /ruta/de/salida.png \
  --num-candidates 4 \
  --aspect-ratio 16:9
```

| Parametro | Para que |
|---|---|
| `--content` / `--content-file` | El texto que describe lo que se va a dibujar. Uno de los dos es obligatorio. |
| `--caption` | El pie de figura / la intencion visual. Obligatorio. |
| `--num-candidates N` | Genera N variantes en paralelo (por defecto 10). Cada una imprime su ruta absoluta en stdout; se elige la mejor a mano. |
| `--aspect-ratio` | `21:9` (por defecto), `16:9` o `3:2`. |
| `--exp-mode` | `demo_full` (con Stylist) o `demo_planner_critic` (sin Stylist, mas rapido). |

**Costo y tiempo, segun el propio upstream:** cada candidato son varias llamadas
a un LLM (Retriever + Planner + Stylist + Visualizer + hasta 3 rondas de Critic)
y tarda entre 3 y 10 minutos. Con los 10 candidatos por defecto: 10-30 minutos y
diez veces el costo de API de una figura. **Bajar `--num-candidates` a 3-4 salvo
que se quiera barrer mucho**, y avisar del costo antes de lanzar una tanda
grande. Esto cae en el nivel "Moderado" de la escalera de escalamiento: se avanza
y se informa, pero una tanda de 10+ figuras ya merece preguntar antes.

---

## COMO SE INTEGRA AL FLUJO DEL PROYECTO

1. El diagrama sale de un TEXTO QUE YA EXISTE en la documentacion del proyecto
   (la seccion de arquitectura de `context.md`, un plan tecnico). No se inventa
   el contenido: se le pasa el texto real con `--content-file`.
2. La figura generada se guarda en `docs/` o `assets/` **del proyecto que la
   pidio**, nunca dentro de la carpeta de la herramienta.
3. Se referencia desde el markdown del proyecto como cualquier imagen.
4. La herramienta vive en `tools/`, como recurso compartido del portafolio — al
   mismo nivel que el sistema de diseno o el propio framework.
5. Toda figura publicada se anota en el `CHANGELOG.md` del proyecto: fecha, que
   diagrama, cuantos candidatos y cual se eligio. Si no queda registrado, no se
   considera hecho.

---

## SKILL

El repo trae `skill/SKILL.md` en formato de skill de agente (`name: paperbanana`).
Se puede exponer como skill invocable copiandolo a la carpeta de skills del
agente, pero sigue necesitando la API key: sin ella el skill falla igual.

Referencia upstream: `github.com/dwzhu-pku/PaperBanana`, fork de
`google-research/papervizagent`.
