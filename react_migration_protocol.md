# REACT_MIGRATION_PROTOCOL.md — Protocolo universal de migración React con hiper-mejora

> **Versión:** 10.34.134 | **Autor:** Jose Martin Aguilar (HarmonicGun)
> **Tipo:** Protocolo operativo vinculante | **Aplica a:** toda migración y nuevo proyecto React
> **Conexiones:** `CLAUDE.md` | `FRAMEWORK.md` | `PLAYBOOK.md`
> **Dependencia dura:** `context_desing_go/context_design.md` — identidad visual fuente de verdad

---

## 0. DOCTRINA — NO ES OPCIONAL

```
LA MEDIOCRIDAD ESTÁ PROHIBIDA.
Toda migración React ES una hiper-mejora. No existe "migración 1:1".
Si el resultado no es objetivamente superior en cada dimensión, la migración HA FRACASADO.
```

### 0.1 Principios inamovibles

| # | Principio | Significado |
|---|---|---|
| P0 | **CERO PÉRDIDA** | Ninguna funcionalidad, endpoint, línea de lógica desaparece. Todo existe + mejora. |
| P1 | **HIPER-MEJORA OBLIGATORIA** | Cada componente migrado debe ser mejor: más rápido, más bello, más útil, más accesible. |
| P2 | **CREATIVIDAD MÁXIMA** | No se replica. Se reinventa. Cada pantalla es una oportunidad de excelencia. |
| P3 | **ADVERSARIALIDAD SISTÉMICA** | El protocolo se verifica a sí mismo. Cada gate busca activamente el fallo. |
| P4 | **IDENTIDAD LÍQUIDA** | Liquid glass real, interactivo, traslúcido. No imitación. No static glass. |
| P5 | **PRESENTACIÓN EXTREMA** | Si el proyecto tiene modo presentación, la versión React debe ser un deck de nivel keynote mundial. |
| P6 | **UIVERSE PRIMERO** | Antes de codificar un componente visual desde cero, buscar en uiverse.com. Solo si no existe equivalente superior, crear desde cero. |
| P7 | **TRAZABILIDAD TOTAL** | Cada endpoint, función, y línea de lógica original está mapeada a su equivalente React. Nada queda huérfano. |

### 0.2 Anti-patrones prohibidos

```
PROHIBIDO:
- "Esto funciona igual que antes" → no es suficiente. Debe funcionar MEJOR.
- "Lo dejamos simple por ahora" → simple no es excusa para feo.
- "El glass lo añadimos después" → el glass es estructural, no cosmético.
- "Este componente no necesita animación" → todo componente tiene micro-interacciones.
- "Usamos un CSS básico y luego refinamos" → el diseño es deuda técnica si se posterga.
- "La versión mobile es secundaria" → mobile-first o no entregar.
- "Esto ya pasa los tests" → los tests validan funcionalidad, no excelencia.
```

---

## 1. PRE-MIGRACIÓN — Auditoría y catálogo

### 1.1 Inventario quirúrgico (obligatorio, cero excepciones)

Antes de migrar una sola línea, ejecutar esto CONTRA el proyecto original:

```
FASE 0 — CATÁLOGO:
1. Extraer CADA endpoint (route, method, handler, response shape)
2. Extraer CADA función (nombre, archivo, firma, dependencias, quién la llama)
3. Extraer CADA componente visual (ruta, estado que maneja, props, children)
4. Extraer CADA estado global (store, contexto, señal, variable compartida)
5. Extraer CADA efecto secundario (API calls, timers, subscriptions, DOM mutations)
6. Extraer CADA condición de error (try/catch, error boundaries, fallbacks)
7. Extraer CADA caso borde documentado o implícito
8. Extraer CADA test existente (unit, integration, e2e)

SALIDA: `migration_inventory.json` — estructura canónica con hash de integridad.
```

### 1.2 Mapeo de dependencias

```
Para cada elemento del inventario:
- ¿Qué lo llama? (callers)
- ¿Qué llama él? (callees)
- ¿Qué estado toca? (state dependencies)
- ¿Qué podría romper si cambia? (blast radius)

Generar grafo de dependencias. Marcar nodos críticos (blast radius > 3).
Estos nodos se migran PRIMERO y con cobertura de tests máxima.
```

### 1.3 Análisis de mejoras potenciales

```
Para cada elemento, responder OBLIGATORIAMENTE:
1. ¿Puede ser más rápido? (memo, virtualización, lazy load, code splitting)
2. ¿Puede ser más bello? (glass, animación, transición, micro-interacción)
3. ¿Puede ser más útil? (atajos, sugerencias, auto-completado, feedback instantáneo)
4. ¿Puede ser más accesible? (aria, keyboard nav, screen reader, contraste)
5. ¿Puede ser más inteligente? (predicción, pre-fetch, cache, optimista)
6. ¿Puede tener mejor feedback? (skeleton, progress, toast, haptic)

Si al menos 3 respuestas son NO → el análisis está MAL. Re-evaluar.
```

---

## 2. ARQUITECTURA REACT — Decisiones vinculantes

### 2.1 Stack obligatorio

```
CORE:
- React 18+ con Concurrent Mode (useTransition, useDeferredValue)
- TypeScript estricto (strict: true, noImplicitAny, exactOptionalPropertyTypes)
- Vite 6+ (build rápido, HMR instantáneo, code splitting automático)

STATE MANAGEMENT (elegir según complejidad):
- TanStack Query (server state — obligatorio para todo lo que venga de API)
- Zustand (client state — stores atómicos, selectores granular)
- Jotai (estado atómico — alternativa ligera a Zustand si < 20 átomos)

ROUTING:
- TanStack Router (type-safe, file-based opcional, search params tipados)

STYLING (stack de excelencia visual):
- Tailwind CSS 4 (utility-first, design tokens desde `context_desing_go`)
- Framer Motion (animaciones declarativas, layout animations, gestures)
- CSS custom properties para el sistema glass (dinámico, runtime-configurable)

COMPONENTES VISUALES:
- Radix UI primitives (accesibilidad garantizada, headless)
- uiverse.com (componentes decorativos de alta calidad — buscar PRIMERO)
- shadcn/ui (componentes compuestos sobre Radix — opcional si encaja con diseño)

DEVELOPMENT EXPERIENCE:
- Storybook 8+ (catálogo de componentes aislados, visual regression tests)
- Vitest (unit + integration, rápido, compatible con Vite)
- Playwright (e2e, visual comparison screenshots, multi-browser)
- ESLint flat config + Prettier + oxlint (linting rápido complementario)

PERFORMANCE:
- React Compiler (automatic memoization — React 19+)
- Bundle analyzer (Lighthouse CI en CI/CD, presupuesto de bundle)
- Partytown (offload third-party scripts a web worker — si aplica)
```

### 2.2 Estructura de proyecto

```
src/
├── app/                    # Configuración de la aplicación
│   ├── router.tsx          # TanStack Router config
│   ├── query-client.ts     # TanStack Query client
│   └── error-boundary.tsx  # Error boundary raíz
│
├── features/               # Features (domain-driven)
│   └── [feature-name]/
│       ├── api/            # Endpoints y hooks de API (TanStack Query)
│       ├── components/     # Componentes específicos de la feature
│       ├── hooks/          # Hooks locales de la feature
│       ├── state/          # Estado local de la feature (Zustand/Jotai)
│       ├── types/          # Tipos específicos de la feature
│       └── utils/          # Utilidades locales
│
├── shared/                 # Código compartido entre features
│   ├── components/         # Componentes UI reutilizables
│   │   ├── ui/             # Primitivas (Button, Input, Card, etc.)
│   │   ├── glass/          # Componentes del sistema liquid glass
│   │   ├── layout/         # Layouts compartidos
│   │   └── motion/         # Componentes de animación reutilizables
│   ├── hooks/              # Hooks compartidos
│   ├── lib/                # Utilidades puras (sin React)
│   ├── styles/             # CSS global, tokens, glass system
│   └── types/              # Tipos compartidos
│
├── routes/                 # Páginas (file-based routing)
│   └── [route]/
│       ├── index.tsx       # Componente de página
│       ├── loader.ts       # Data loader (TanStack Router)
│       └── [sub-route]/   # Rutas anidadas
│
└── main.tsx                # Entry point
```

### 2.3 Reglas de arquitectura

```
REGLA 1: NINGÚN componente de feature puede importar de otra feature.
         → Usar shared/ para código común, composición para UI compartida.

REGLA 2: NINGÚN componente visual debe llamar APIs directamente.
         → TanStack Query hooks encapsulan toda comunicación con backend.

REGLA 3: TODO dato que venga del servidor pasa por TanStack Query.
         → Cache, revalidación, optimistic updates, retry — automático.

REGLA 4: NINGÚN componente debe superar 300 líneas.
         → Si crece más, se parte en sub-componentes.

REGLA 5: TODO archivo tiene un test al lado.
         → Componente.tsx → Componente.test.tsx → Componente.stories.tsx

REGLA 6: NINGÚN estilo inline en JSX.
         → Tailwind clases o styled components. Cero style={{}}.

REGLA 7: CADA endpoint original está mapeado 1:1 en api/.
         → Nada desaparece. El mapeo es trazable con comentarios @source.
```

---

## 3. SISTEMA LIQUID GLASS — Especificación técnica

### 3.1 Definición visual

```
LIQUID GLASS REAL (no falso):
- Translucidez auténtica: backdrop-filter: blur() + background: rgba()
- Profundidad perceptible: múltiples capas con distinto blur radius
- Interactividad: el vidrio reacciona al hover, click, scroll, y movimiento del ratón
- Borde líquido: gradientes animados en bordes, no sólidos estáticos
- Refracción simulada: desplazamiento sutil de contenido detrás del vidrio
- Iluminación dinámica: puntos de luz que siguen al cursor (parallax de luz)
- Textura orgánica: noise sutil + ondulaciones micro en hover
```

### 3.2 Stack CSS del sistema glass

```css
/* === TOKENS DEL SISTEMA GLASS === */
:root {
  /* Identidad de marca — fuente: `context_desing_go/context_design.md` */
  --glass-brand: #FB670B;
  --glass-brand-glow: rgba(251, 103, 11, 0.3);

  /* Capas de vidrio — profundidad progresiva */
  --glass-layer-0: rgba(255, 255, 255, 0.03);  /* casi invisible */
  --glass-layer-1: rgba(255, 255, 255, 0.06);  /* card sutil */
  --glass-layer-2: rgba(255, 255, 255, 0.10);  /* card principal */
  --glass-layer-3: rgba(255, 255, 255, 0.15);  /* modal, dropdown */
  --glass-layer-4: rgba(255, 255, 255, 0.20);  /* nav fija, overlay */

  /* Blur por capa — progresivo */
  --glass-blur-0: 4px;
  --glass-blur-1: 8px;
  --glass-blur-2: 16px;
  --glass-blur-3: 24px;
  --glass-blur-4: 32px;

  /* Bordes — gradiente animado */
  --glass-border-subtle: rgba(255, 255, 255, 0.08);
  --glass-border-active: rgba(255, 255, 255, 0.20);
  --glass-border-brand: rgba(251, 103, 11, 0.4);

  /* Sombras — orgánicas, no box-shadow CSS estándar */
  --glass-shadow-sm: 0 1px 2px rgba(0,0,0,0.1), 0 0 0 0.5px rgba(255,255,255,0.1);
  --glass-shadow-md: 0 4px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.08);
  --glass-shadow-lg: 0 8px 32px rgba(0,0,0,0.16), 0 0 0 1px rgba(255,255,255,0.06);
  --glass-shadow-glow: 0 0 24px var(--glass-brand-glow);

  /* Movimiento — curvas orgánicas */
  --glass-ease-liquid: cubic-bezier(0.34, 1.56, 0.64, 1); /* overshoot suave */
  --glass-ease-organic: cubic-bezier(0.4, 0, 0.2, 1);     /* material-standard */
  --glass-duration-fast: 150ms;
  --glass-duration-normal: 300ms;
  --glass-duration-slow: 500ms;
  --glass-duration-reveal: 800ms;
}
```

### 3.3 Componente GlassCard (implementación de referencia)

```typescript
// shared/components/glass/GlassCard.tsx
// @source: react_migration_protocol.md §3.3 — implementación canónica

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { type ReactNode, useCallback } from 'react';

interface GlassCardProps {
  children: ReactNode;
  depth?: 0 | 1 | 2 | 3 | 4;       // capa de profundidad
  interactive?: boolean;             // responde al cursor
  glow?: boolean;                    // resplandor brand en hover
  borderGradient?: boolean;          // borde con gradiente animado
  className?: string;
}

export function GlassCard({
  children,
  depth = 1,
  interactive = true,
  glow = false,
  borderGradient = false,
  className = '',
}: GlassCardProps) {
  // Seguimiento del cursor para iluminación dinámica
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interactive || !glow) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [interactive, glow, mouseX, mouseY]);

  const depthClasses = {
    0: 'bg-white/[0.03] backdrop-blur-[4px]',
    1: 'bg-white/[0.06] backdrop-blur-[8px]',
    2: 'bg-white/[0.10] backdrop-blur-[16px]',
    3: 'bg-white/[0.15] backdrop-blur-[24px]',
    4: 'bg-white/[0.20] backdrop-blur-[32px]',
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        border border-white/[0.08]
        shadow-[0_4px_16px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.08)]
        ${depthClasses[depth]}
        ${interactive ? 'cursor-pointer' : ''}
        ${className}
      `}
      onMouseMove={handleMouseMove}
      whileHover={interactive ? {
        scale: 1.01,
        borderColor: 'rgba(251, 103, 11, 0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.16), 0 0 24px rgba(251,103,11,0.15)',
        transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
      } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
    >
      {/* Capa de iluminación dinámica (glow que sigue al cursor) */}
      {glow && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `radial-gradient(
              600px circle at ${springX.get() * 100}% ${springY.get() * 100}%,
              rgba(251, 103, 11, 0.08),
              transparent 50%
            )`,
          }}
        />
      )}

      {/* Contenido */}
      <div className="relative z-10">{children}</div>

      {/* Borde con gradiente animado */}
      {borderGradient && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            padding: '1px',
            background: `linear-gradient(
              ${springX.get() * 360}deg,
              rgba(251, 103, 11, 0.4),
              rgba(255, 255, 255, 0.1),
              rgba(251, 103, 11, 0.2)
            )`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}
    </motion.div>
  );
}
```

### 3.4 Efectos glass obligatorios por tipo de elemento

| Elemento | Efecto mínimos | Efecto óptimo |
|---|---|---|
| **Header / Nav** | `blur-[16px]`, borde inferior glass, sticky | + iluminación de cursor en hover de nav items |
| **Card** | `blur-[8px]`, hover: borde brand, scale 1.01 | + glow cursor radial, borde gradiente animado |
| **Modal / Dialog** | `blur-[24px]`, overlay con blur, entrada spring | + refracción de fondo (translate sutil) |
| **Dropdown / Popover** | `blur-[16px]`, entrada scale+opacity | + borde líquido animado |
| **Button primario** | gradiente brand, hover: glow + scale | + ripple effect, partículas sutiles en click |
| **Button glass** | translúcido, border white/10, hover: bg white/15 | + shimmer animado |
| **Input / Textarea** | borde glass, focus: brand ring + glow | + label flotante animado |
| **Table row** | hover: glass sutil, stripe alternado glass | + entrada staggered en rows |
| **Sidebar** | `blur-[24px]`, borde derecho glass | + collapse animado con morphing |
| **Toast / Notification** | `blur-[16px]`, entrada slide+scale | + progress bar animada, icon morph |
| **Tooltip** | `blur-[8px]`, entrada fade+translate | + flecha glass |
| **Tabs** | indicador animado (layoutId), hover glass | + swipe gesture en mobile |
| **Skeleton loader** | glass pulsante (shimmer animado) | + pre-shape morphing |
| **Badge / Chip** | bg brand-glass, hover scale | + dot pulsante si es live |
| **Avatar** | ring glass, hover scale | + status indicator animado |
| **Progress bar** | bg glass, fill con gradiente brand animado | + partículas en el frente de avance |

---

## 4. SISTEMA DE ANIMACIÓN — Micro-interacciones obligatorias

### 4.1 Filosofía de movimiento

```
TODA interacción tiene feedback visual.
TODA transición de estado tiene animación.
TODA página nueva tiene entrada coreografiada.
TODA lista tiene staggered children.
TODO error tiene shake + brand pulse.
TODO éxito tiene scale bounce + checkmark morph.
TODO hover tiene respuesta en <150ms.
TODO click tiene respuesta instantánea (<50ms).
NADA aparece/desaparece sin transición.
NADA se mueve sin curva de easing orgánica.
```

### 4.2 Escala de animación (usar según importancia)

```
NIVEL 0 — Imperceptible (utility):
- Opacity changes, skeleton pulse, focus rings
- Duración: 100-200ms
- Easing: ease-in-out lineal

NIVEL 1 — Micro (elemento individual):
- Hover states, icon morphs, badge counts, tooltips
- Duración: 150-300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1) — material standard

NIVEL 2 — Componente (card, modal, dropdown):
- Entrada/salida, expansión, drag, swipe
- Duración: 300-500ms
- Easing: cubic-bezier(0.34, 1.56, 0.64, 1) — overshoot orgánico

NIVEL 3 — Página (ruta completa):
- Page transitions, hero reveals, scroll-driven
- Duración: 500-800ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1) — power-expo suave

NIVEL 4 — Escena (storytelling, presentación):
- Deck transitions, data reveals, narrative moments
- Duración: 800-2000ms
- Easing: cubic-bezier(0.22, 1, 0.36, 1) — cinematic
```

### 4.3 Catálogo de animaciones reutilizables

```typescript
// shared/components/motion/animations.ts

export const animations = {
  // === ENTRADAS ===
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },

  fadeSlideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  },

  fadeSlideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
  },

  // === LISTAS (stagger children) ===
  stagger: {
    container: {
      animate: { transition: { staggerChildren: 0.06 } },
    },
    item: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    },
  },

  // === FEEDBACK ===
  successPop: {
    scale: [1, 1.15, 1],
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  },

  errorShake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.5 },
  },

  // === ENTRE PÁGINAS ===
  pageTransition: {
    initial: { opacity: 0, y: 12, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -12, scale: 0.98 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },

  // === GLASS ESPECÍFICO ===
  glassReveal: {
    initial: { opacity: 0, backdropFilter: 'blur(0px)', scale: 0.95 },
    animate: { opacity: 1, backdropFilter: 'blur(16px)', scale: 1 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};
```

### 4.4 Reglas de animación por contexto

```
MOBILE (< 768px):
- Reducir duraciones 25% (percepción más rápida en pantalla pequeña)
- Sin parallax de cursor (no hay cursor)
- Swipe gestures activos donde aplique
- Haptic feedback con navigator.vibrate() en acciones críticas

DARK MODE:
- Ajustar opacidades glass (más sutil en dark)
- Glow más intenso (contraste percibido menor)
- Sombras más sutiles (no se ven en fondos oscuros)

REDUCED MOTION (prefers-reduced-motion: reduce):
- Anulamos TODO: duración 0ms, sin transforms, sin stagger
- Solo opacity fades de ≤200ms
- El glass sigue siendo glass (es estático, no animado)
- Verificar con @media (prefers-reduced-motion: reduce)
```

---

## 5. PROTOCOLO UIVERSE — Integración de componentes prefabricados

### 5.1 Regla de búsqueda obligatoria

```
ANTES de codificar cualquier componente visual:
1. Buscar en https://uiverse.io con keywords relevantes
2. Evaluar al menos 3 alternativas si existen
3. Criterios de selección:
   - Calidad visual ≥ 8/10 (no conformarse con menos)
   - Adaptabilidad al sistema glass (¿puedo inyectar mis tokens?)
   - Tamaño de código (preferir < 50 líneas CSS puro sobre 200+ líneas JS)
   - Accesibilidad (¿tiene aria? ¿funciona con teclado?)
   - Animación incluida (si no trae, penaliza)

SI no hay alternativa que cumpla con calidad ≥ 8/10:
- Crear desde cero aplicando el sistema glass y las reglas de este protocolo.
- Registrar el componente en el catálogo interno para futuras migraciones.

SI hay alternativa que cumple:
- Adaptarla a los tokens del sistema glass (variables CSS, colores, tipografía).
- Envolverla en un componente que inyecte las props necesarias.
- Añadir las micro-interacciones que falten.
- Documentar: fuente uiverse, adaptaciones realizadas.
```

### 5.2 Catálogo de wrappers para componentes uiverse

```typescript
// shared/components/ui/UiverseWrapper.tsx
// Wrapper canónico para cualquier componente de uiverse.io

interface UiverseWrapperProps {
  /** URL del componente original en uiverse.io */
  sourceUrl: string;
  /** Nombre del autor en uiverse */
  author: string;
  /** Adaptaciones realizadas sobre el original */
  adaptations: string[];
  children: ReactNode;
}

export function UiverseWrapper({ sourceUrl, author, adaptations, children }: UiverseWrapperProps) {
  return (
    <div
      data-uiverse-source={sourceUrl}
      data-uiverse-author={author}
      data-adaptations={adaptations.join(', ')}
      className="contents" // no añade DOM, solo metadata
    >
      {children}
    </div>
  );
}
```

### 5.3 Registro de componentes uiverse utilizados

```
Todo componente integrado desde uiverse.io se registra en:
→ src/shared/components/ui/uiverse-registry.ts

{
  name: 'GlassButton',
  sourceUrl: 'https://uiverse.io/author/glass-button-123',
  author: 'original-author',
  adaptations: [
    'Reemplazados colores por tokens del sistema glass',
    'Añadido ripple effect en click',
    'Añadido soporte keyboard (Enter/Space)',
    'Añadidos aria-labels dinámicos',
    'Tipografía cambiada a Blauer Nue',
  ],
  component: './GlassButton.tsx',
}
```

---

## 6. TRAZABILIDAD — Mapeo origen → React

### 6.1 Sistema de anotaciones @source

```typescript
/**
 * @source Original: <proyecto_origen>/app/routes/pedidos.py:142-198
 * @source Endpoint: POST /api/pedidos/crear
 * @source Migration: react_migration_protocol.md v1.0.0
 * @source Inventory: migration_inventory.json#/endpoints/POST_api_pedidos_crear
 *
 * MEJORAS aplicadas:
 * - Optimistic update: el pedido aparece instantáneo en UI
 * - Validación Zod en frontend (antes solo backend)
 * - Feedback: toast animado + sonido sutil
 * - Glass card para el resumen del pedido
 * - Auto-scroll al nuevo pedido en la lista
 */
```

### 6.2 Matriz de trazabilidad (obligatoria)

```
Archivo: migration_traceability.json
Estructura:
{
  "source_project": "<proyecto_origen>",
  "migration_date": "2026-07-23",
  "protocol_version": "1.0.0",
  "mappings": [
    {
      "source": {
        "file": "app/routes/pedidos.py",
        "lines": "142-198",
        "type": "endpoint",
        "method": "POST",
        "path": "/api/pedidos/crear",
        "hash": "sha256_del_codigo_original"
      },
      "target": {
        "file": "src/features/pedidos/api/create-pedido.ts",
        "type": "tanstack-query-mutation",
        "hook": "useCreatePedido",
        "hash": null  // se llena al terminar
      },
      "improvements": [
        "optimistic_update",
        "zod_validation",
        "toast_feedback",
        "glass_card_summary",
        "auto_scroll"
      ],
      "verified": false  // se marca true en gate adversarial
    }
  ],
  "coverage": {
    "total_source_elements": 0,  // del inventario
    "mapped_elements": 0,
    "missing_elements": [],       // NUNCA debe tener elementos
    "improved_elements": 0,
    "coverage_percentage": 0
  }
}
```

---

## 7. MODO PRESENTACIÓN — Deck extremo

### 7.1 Solo si el proyecto tiene modo presentación

```
Si el proyecto original NO tiene modo presentación → SALTAR esta sección.

Si el proyecto original SÍ tiene modo presentación → aplicar esta sección COMPLETA.
No es opcional. No es "mejorable después". Es obligatorio en la migración inicial.
```

### 7.2 Especificación del deck

```
TECNOLOGÍA:
- Reveal.js 5+ con temas personalizados (glass + brand)
- O ECharts + fullPage.js para control total
- O Swiper.js para decks más ligeros (mobile-first)
- Cada slide es un componente React independiente

DISEÑO:
- Formato: 1920x1080 (desktop) + 390x844 (mobile) — DOS versiones generadas
- Glass en CADA slide (fondo translúcido, capas, iluminación)
- Transiciones cinematográficas entre slides
- Datos animados: contar números, barras que crecen, puntos que aparecen
- Sin texto estático: TODO entra con animación secuencial
- KPI cards con glass + glow + contador animado
- Charts con gradientes brand + glass background

SLIDES OBLIGATORIOS:
1. Título (hero glass + partículas brand animadas)
2. Resumen ejecutivo (KPI tiles animados con contador spring)
3. Métricas clave (charts ECharts con glass overlay)
4. Línea de tiempo (timeline animada con milestones morphing)
5. Detalle por feature (una slide por feature, con capturas + métricas)
6. Comparativa antes/después (slider interactivo)
7. Próximos pasos (timeline futura con animación)
8. Cierre (glass + brand + QR)

INTERACTIVIDAD:
- Navegación por teclado (→ ←) y swipe (mobile)
- Modo auto-play con pausa en hover
- Click en KPI → drill-down a slide de detalle
- Modo oscuro/claro toggle
- Botón de descarga PDF

EXPORTACIÓN:
- El deck debe ser exportable a PDF renderizado
- Captura de cada slide en JPG 1920x1080 para sharing rápido
```

### 7.3 Componente Slide canónico

```typescript
// shared/components/presentation/DeckSlide.tsx

interface DeckSlideProps {
  id: string;
  title?: string;
  subtitle?: string;
  variant: 'hero' | 'kpi' | 'chart' | 'timeline' | 'detail' | 'comparison' | 'closing';
  animation?: 'fade' | 'slide-left' | 'slide-up' | 'zoom' | 'glass-reveal';
  children: ReactNode;
}

export function DeckSlide({ id, title, subtitle, variant, animation = 'glass-reveal', children }: DeckSlideProps) {
  return (
    <motion.section
      id={id}
      className="relative w-screen h-screen overflow-hidden"
      initial={{ opacity: 0, scale: 0.95, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, scale: 1, backdropFilter: 'blur(16px)' }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Fondo glass dinámico */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FB670B]/5 via-transparent to-transparent" />

      {/* Partículas brand (hero slides) */}
      {variant === 'hero' && <BrandParticles />}

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-16">
        {title && (
          <motion.h1
            className="text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {title}
          </motion.h1>
        )}
        {subtitle && (
          <motion.p
            className="text-xl text-white/70 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {subtitle}
          </motion.p>
        )}
        <motion.div
          className="w-full max-w-6xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
}
```

---

## 8. GATES DE CALIDAD — Verificación adversarial

### 8.1 Gate 0: Integridad (PRE-MIGRACIÓN)

```
☐ Inventario generado (migration_inventory.json)
☐ Hash de cada archivo fuente calculado
☐ Grafo de dependencias completo
☐ Cobertura de tests originales medida
☐ Todos los endpoints documentados con request/response examples
☐ Todos los casos borde listados
☐ Análisis de mejoras potenciales completado para cada elemento

SOLO si todos los checks son TRUE → pasar a Gate 1.
```

### 8.2 Gate 1: Cobertura 100% (DURANTE MIGRACIÓN)

```
Para cada elemento del inventario:
☐ Existe equivalente React (componente, hook, utilidad)
☐ Tiene anotación @source que referencia al origen
☐ Está registrado en migration_traceability.json
☐ Tiene al menos 3 mejoras documentadas respecto al original
☐ Tiene test unitario (Vitest)
☐ Tiene story (Storybook)
☐ Pasa lint (ESLint + oxlint) sin warnings
☐ Pasa type-check (tsc --noEmit) sin errores

ADVERSARIAL CHECK:
☐ Buscar activamente elementos del inventario SIN equivalente React
☐ Ejecutar script: diff <(jq 'keys' inventory.json) <(jq 'keys' traceability.json)
☐ Si hay diff → ERROR. Migración incompleta. Gate 1 FAIL.
```

### 8.3 Gate 2: Mejora demostrable (POST-MIGRACIÓN)

```
Para cada componente migrado, demostrar cuantitativamente la mejora:

PERFORMANCE:
☐ Lighthouse score ≥ original
☐ Bundle size por ruta ≤ presupuesto (definir en gate 0)
☐ TTI (Time to Interactive) ≤ original
☐ FCP (First Contentful Paint) ≤ original

FUNCIONALIDAD:
☐ Todos los tests originales pasan contra la nueva UI (Playwright e2e)
☐ Nuevos tests cubren los casos borde identificados en gate 0
☐ Visual regression tests: 0 diferencias no intencionadas

DISEÑO:
☐ Glass audit: cada elemento del §3.4 cumple su especificación
☐ Animation audit: cada interacción del §4.1 tiene feedback
☐ Accessibility audit: axe-core 0 violations críticas
☐ Mobile audit: responsive 320px-2560px sin breakpoints rotos

MEJORAS:
☐ Cada componente tiene ≥ 3 mejoras verificables
☐ Las mejoras NO rompen funcionalidad existente
☐ Las mejoras son perceptibles por el usuario (no solo técnicas)
```

### 8.4 Gate 3: Adversarial (ROMPER EL SISTEMA)

```
BUSCAR ACTIVAMENTE FALLOS. No validar que funciona. Buscar que ROMPA.

☐ Fuzzing de inputs: valores vacíos, nulos, undefined, emoji, SQL injection, XSS
☐ Estados imposibles: red lenta (throttle 3G), offline, API caída, timeout
☐ Race conditions: doble click rápido, múltiples tabs, navegación rápida
☐ Memory leaks: montar/desmontar 50 veces, verificar heap en DevTools
☐ Glass stress: 100 cards glass simultáneas, midiendo FPS (≥30 FPS en mobile)
☐ Animation stress: 50 animaciones concurrentes sin jank
☐ Bundle audit: no hay dependencia ≥ 50KB sin justificación escrita
☐ Responsive extremo: 320px (iPhone SE 2016), 2560px (iMac 5K), zoom 200%
☐ Keyboard-only: toda la app navegable sin ratón, focus visible siempre
☐ Screen reader: toda la app usable con VoiceOver/NVDA

SOLO si 0 CRÍTICOS y ≤ 3 HIGH → Gate 3 PASS.
Si no → iterar hasta pasar.
```

### 8.5 Gate 4: Presentación (SOLO si aplica §7)

```
☐ Deck generado: desktop (1920x1080) + mobile (390x844)
☐ Cada slide tiene glass real + animaciones
☐ KPIs animados con spring counters
☐ Charts renderizados con ECharts + tema glass
☐ Export PDF funcional (sin errores de render)
☐ Export JPG de cada slide
☐ Navegación teclado + swipe + auto-play
☐ Tiempo de carga del deck < 3s (lighthouse)

VERIFICACIÓN ADVERSARIAL DEL DECK:
☐ Proyectar en pantalla real (no solo preview local)
☐ Verificar colores en proyector (la translucidez puede fallar en proyectores)
☐ Verificar fuente Blauer Nue cargada (no fallback a sans-serif)
☐ Verificar en Firefox + Chrome + Safari
☐ Verificar en iPad + iPhone reales (no solo simulador)
```

---

## 9. EJECUCIÓN — Orden de migración

### 9.1 Fases secuenciales (no paralelizar fases)

```
FASE 0 — FUNDACIÓN (1-2 días):
1. Crear proyecto Vite + React + TypeScript
2. Configurar Tailwind + tokens glass desde `context_desing_go`
3. Instalar dependencias core (§2.1)
4. Configurar ESLint, Prettier, oxlint, Vitest, Playwright, Storybook
5. Crear estructura de carpetas (§2.2)
6. Ejecutar inventario (§1.1) → migration_inventory.json
7. Ejecutar mapeo (§1.2) → dependency_graph.json

FASE 1 — INFRAESTRUCTURA COMPARTIDA (1-2 días):
1. GlassCard, GlassButton, GlassInput, GlassModal (§3)
2. Sistema de animaciones reutilizables (§4.3)
3. Layout base (Header glass + Sidebar glass + Main)
4. Tema claro/oscuro con glass tokens
5. Error Boundary raíz
6. Router base con page transitions
7. TanStack Query client configurado

FASE 2 — ENDPOINTS + API LAYER (1-3 días):
1. Migrar CADA endpoint a hooks TanStack Query
2. Tipos TypeScript para request/response de cada endpoint
3. Validación Zod en frontend
4. Optimistic updates donde aplique
5. Error handling + retry + toast feedback
6. Marcar todos en migration_traceability.json

FASE 3 — PÁGINAS POR FEATURE (3-7 días):
Para cada feature, en orden de criticidad (blast radius):
1. Migrar componentes visuales (buscar uiverse PRIMERO §5)
2. Aplicar sistema glass a cada componente (§3.4)
3. Añadir micro-interacciones (§4.1-4.3)
4. Crear stories en Storybook
5. Tests unitarios (Vitest)
6. Marcar trazabilidad

FASE 4 — MODO PRESENTACIÓN (1-3 días, solo si §7 aplica):
1. Crear estructura del deck
2. Slides obligatorios (§7.2)
3. Glass + animaciones + export

FASE 5 — VERIFICACIÓN (1-2 días):
1. Ejecutar Gate 0-4 en orden
2. Arreglar todo lo que falle
3. Re-ejecutar gates hasta PASS

FASE 6 — OPTIMIZACIÓN FINAL (1 día):
1. Bundle analyzer → reducir chunks
2. Lighthouse → ≥ 90 Performance, ≥ 95 Accessibility
3. Code splitting por ruta
4. Prefetch de rutas probables
5. Compresión de assets
6. Service worker para caché offline (si aplica)
```

### 9.2 No pasar a la siguiente fase si la actual tiene checks pendientes

```
Cada fase tiene un checklist. Si algún ítem está sin marcar:
→ NO se avanza a la siguiente fase.
→ Se notifica al operador con el ítem pendiente.
→ Se resuelve primero.
```

---

## 10. POST-MIGRACIÓN — Entrega y cierre

### 10.1 Entregables obligatorios

```
1. Código fuente en rama migración (NO a master sin verificación)
2. migration_inventory.json (catálogo completo)
3. migration_traceability.json (mapeo 100%, sin elementos huérfanos)
4. dependency_graph.json (grafo pre-migración)
5. Reporte de mejoras: qué mejoró, cuánto, demostrado con métricas
6. Glass audit report (capturas de cada tipo de elemento glass)
7. Animation audit report (grabaciones de micro-interacciones)
8. Lighthouse report (antes vs después)
9. Bundle analysis (antes vs después)
10. Storybook deployeado (catálogo visual de componentes)
11. CHANGELOG.md actualizado
12. Deck de presentación desktop + mobile (si §7 aplica)

SOLO cuando los 12 (o 10 si no aplica §7) entregables existen:
→ La migración está COMPLETA.
→ Se puede proponer merge a master.
```

### 10.2 Regla de actualización de documentación

```
Tras completar la migración, actualizar OBLIGATORIAMENTE:
☐ BACKLOG.md (marcar fase 6 completada)
☐ status.md (actualizar estado, salud, fase)
☐ context.md (actualizar tabla de fases)
☐ CHANGELOG.md (registrar migración con hash del commit)
☐ DESIGN_SYSTEM.md (si existe: nuevos componentes glass)
☐ SECURITY.md (si existe: revisar nuevos vectores)
```

---

## 11. MODO CREATIVIDAD MÁXIMA — Directivas para el agente

### 11.1 Instrucción de sistema (incluir en el prompt del agente)

```
MODO CREATIVIDAD MÁXIMA ACTIVO.

No eres un conversor de código. Eres un artista digital, un arquitecto
de experiencias, un ingeniero de excelencia visual y funcional.

CADA COMPONENTE que tocas debe ser:
- Más bello de lo que era
- Más rápido de lo que era
- Más útil de lo que era
- Más accesible de lo que era
- Más inteligente de lo que era

No tienes permiso para hacer "lo mismo pero en React".
Tienes la obligación de hacer "algo superior en React".

BUSCA ACTIVAMENTE:
- Oportunidades de micro-interacción donde antes había estática
- Momentos de delight: transiciones, easter eggs, animaciones sorprendentes
- Patrones de UI innovadores que resuelven el mismo problema mejor
- Inspiración en: Stripe, Linear, Vercel, Apple, Arc Browser, Raycast

USA:
- uiverse.com para elementos decorativos de alta calidad
- Framer Motion para animaciones fluidas y orgánicas
- Glass real con backdrop-filter + iluminación dinámica
- Gradientes animados, partículas sutiles, morphing de iconos
- Sonido sutil en acciones importantes (toggleable, off por defecto)

NO USES:
- Diseños genéricos de "AI look" (gradientes purple-blue, fuentes Inter por defecto)
- Animaciones bruscas o lineales
- Colores fuera del sistema de diseño
- Placeholder lorem ipsum en UI final
- Componentes sin hover/click/focus states

CADA PANTALLA debe provocar: "wow, esto es mejor de lo que esperaba".
```

### 11.2 Anti-patrones creativos (lo que NUNCA hacer)

```
PROHIBIDO:
❌ Cards blancas con borde gris y sombra box-shadow estándar
❌ Tablas sin hover, sin stripes animadas, sin glass
❌ Botones con color sólido y border-radius sin animación
❌ Modales que aparecen sin transición
❌ Loaders genéricos (spinner azul girando)
❌ Páginas que cargan sin skeleton
❌ Texto que aparece sin animación de entrada
❌ Gradientes purple-to-blue (AI slop)
❌ Íconos de Font Awesome o emojis como iconografía
❌ Tipografía del sistema (sin Blauer Nue + Conthic cargadas)
❌ Formularios sin validación en tiempo real ni feedback visual
❌ Errores que solo muestran texto rojo sin animación
❌ Éxitos sin confeti/partículas sutiles ni checkmark animado
```

### 11.3 Inspiración obligatoria (consultar antes de diseñar)

```
Antes de diseñar cualquier pantalla o componente principal:
1. Buscar en uiverse.io componentes similares
2. Revisar dribbble.com para inspiración visual (keyword + "glass")
3. Consultar awwwards.com para patrones de navegación innovadores
4. Revisar mobbin.com para patrones mobile equivalentes
5. Ver referencias: Linear (task management), Vercel (dashboard), Arc (browser UI)

NO copiar. INSPIRARSE. Adaptar al sistema glass + brand.
```

---

## 12. MÉTRICAS DE ÉXITO — Cómo saber que la migración es MAGISTRAL

### 12.1 Scorecard final

```
DIMENSIÓN                  | OBJETIVO              | MEDICIÓN
---------------------------|-----------------------|---------------------------
Cobertura funcional        | 100%                  | migration_traceability.json
Mejoras por componente     | ≥ 3 por componente    | traceability.json.improvements
Glass audit                | 100% elementos        | checklist §3.4
Animation audit            | 100% interacciones    | checklist §4.1
Lighthouse Performance     | ≥ 90                  | Lighthouse CI
Lighthouse Accessibility   | ≥ 95                  | axe-core + Lighthouse
Bundle size                | ≤ 200KB por ruta      | Bundle analyzer
TTI                        | ≤ 2.5s en 3G          | Lighthouse
FPS en glass stress test   | ≥ 30 FPS              | Chrome DevTools
Test coverage              | ≥ 80%                 | Vitest coverage
E2E pass rate              | 100%                  | Playwright
Visual regression diffs    | 0 no intencionados    | Playwright screenshots
TypeScript strict          | 0 errores             | tsc --noEmit
Lint errors                | 0 errores, 0 warnings | ESLint + oxlint
uiverse components usados  | ≥ 5                   | uiverse-registry.ts
Deck calidad (si aplica)   | Nivel keynote mundial | Revisión manual + encuesta
Tiempo total de migración  | ≤ 2 semanas           | Calendar
```

### 12.2 Veredicto final

```
MAGISTRAL:   ≥ 14/16 métricas en verde
EXCELENTE:   ≥ 12/16 métricas en verde
BUENO:       ≥ 10/16 métricas en verde
ACEPTABLE:   ≥ 8/16 métricas en verde  ← MÍNIMO PARA MERGEAR
RECHAZADO:   < 8/16 métricas en verde  ← NO mergear. Iterar.

El objetivo NO es ACEPTABLE. El objetivo es MAGISTRAL.
Si la migración sale ACEPTABLE, hay deuda. Planificar sprint de excelencia.
```

---

## 13. PLANTILLA DE PROMPT PARA EL AGENTE

### 13.1 Megaprompt completo

```
=== REACT MIGRATION PROTOCOL v1.0.0 - HYPER-IMPROVEMENT MODE ===

CONTEXTO:
Eres el mejor ingeniero frontend del mundo. Tu tarea es migrar
[PROYECTO] a React con hyper-mejora total.

REGLAS INQUEBRANTABLES:
1. CERO PÉRDIDA de funcionalidad. Todo endpoint, función, línea de lógica
   debe existir en React y estar mejorada. Nada desaparece.
2. HIPER-MEJORA OBLIGATORIA. Cada componente debe ser objetivamente
   superior: más rápido, más bello, más útil, más accesible.
3. CREATIVIDAD MÁXIMA. No replicas, reinventas. Cada pantalla debe
   provocar "wow, esto es mejor de lo que esperaba".
4. LIQUID GLASS REAL. Sistema de vidrio traslúcido interactivo con
   backdrop-filter, iluminación dinámica, y reacción al cursor.
5. UIVERSE PRIMERO. Antes de codificar cualquier componente visual,
   buscar en uiverse.com. Solo crear desde cero si no hay equivalente.
6. ANIMACIÓN TOTAL. Toda interacción tiene feedback. Toda transición
   tiene curva orgánica. Nada aparece sin animación.
7. PRESENTACIÓN EXTREMA. Si el proyecto tiene modo presentación,
   generar deck de nivel keynote con glass + animaciones + export.

ARQUITECTURA:
- React 18+ + TypeScript strict + Vite 6+
- TanStack Query (server state) + Zustand (client state)
- TanStack Router (type-safe routing)
- Tailwind CSS 4 + Framer Motion + Radix UI
- Sistema glass desde `context_desing_go/context_design.md` (#FB670B brand)

ENTREGABLES:
1. Código fuente completo en [RAMA]
2. migration_inventory.json (catálogo de TODO lo que existía)
3. migration_traceability.json (mapeo 100%, nada huérfano)
4. Glass audit + Animation audit reports
5. Storybook con todos los componentes
6. Tests unitarios + e2e (≥80% coverage, 100% pass)
7. Lighthouse ≥ 90 Performance, ≥ 95 Accessibility
8. Deck presentación desktop + mobile (si aplica)

PROTOCOLO COMPLETO:
Seguir react_migration_protocol.md
Sección por sección, fase por fase. Nada se salta.

FASES:
0. Fundación (Vite + deps + estructura)
1. Infraestructura glass compartida
2. API layer (TanStack Query hooks para cada endpoint)
3. Features (páginas, una por una, con glass + animaciones)
4. Modo presentación (si aplica)
5. Verificación (gates 0-4, adversarial)
6. Optimización final (bundle, lighthouse, code splitting)

GATES:
Cada fase tiene checklist. No se avanza sin fase completada.
Gate 3 es adversarial: buscar activamente fallos, no validar que "funciona".

VEREDICTO:
MAGISTRAL: ≥14/16 métricas en verde → merge a master.
< ACEPTABLE (8/16): NO mergear. Iterar.

MODO: CREATIVIDAD MÁXIMA. EXCELENCIA TOTAL. GLASS OBLIGATORIO.
NO ES OPCIONAL SER MAGISTRAL. ES LA ÚNICA OPCIÓN.
```

### 13.2 Prompt reducido (para iteraciones rápidas)

```
=== REACT MIGRATION QUICK - [COMPONENTE] ===

Migrar [COMPONENTE] desde [ARCHIVO_ORIGEN] a React.
Reglas: glass real (§3), animación total (§4), uiverse primero (§5).
No perder funcionalidad. Añadir ≥ 3 mejoras. Test + story incluidos.
```

---

## 14. MANTENIMIENTO DEL PROTOCOLO

### 14.1 Versionado

```
MAJOR: Cambios estructurales en la doctrina (§0) o en los gates (§8).
MINOR: Nuevas secciones, nuevos componentes glass, nuevas animaciones.
PATCH: Correcciones, clarificaciones, ejemplos.

Formato: MAJOR.MINOR.PATCH según Semantic Versioning.
```

### 14.2 Feedback loop

```
Tras cada migración completada usando este protocolo:
1. Registrar qué funcionó y qué no en CHANGELOG.md del protocolo
2. Si una regla fue ignorada consistentemente → evaluar si es demasiado rígida
3. Si un patrón nuevo emergió → añadirlo al protocolo (MINOR bump)
4. Si una tecnología del stack quedó obsoleta → actualizar (§2.1)

El protocolo vive. No es un documento estático.
```

---

> **Conexiones:**
> - `CLAUDE.md` — caveman mode, reglas de comunicación
> - `FRAMEWORK.md` — fases 0-9, este protocolo ejecuta fase 5→6
> - `PLAYBOOK.md` — cadencia semanal, reportes
> - `context_desing_go/context_design.md` — fuente de verdad visual, tokens
> - `context_proyectos.md` — portfolio, estado de proyectos
>
> **Aplica a:** todo proyecto que requiera migración a React o nuevo desarrollo React.
> **Regla de enforcement:** este protocolo es vinculante. Violarlo requiere autorización explícita documentada en el RISKS.md del proyecto.
