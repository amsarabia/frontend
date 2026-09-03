# QA Tests — Frontend (React CRA)

Cubre flujos UI en `http://friendsapp.com:3000`. Tests manuales con browser + algunos automatizables con `curl`.

## Pre-requisitos

```bash
# Hosts entry (una vez)
echo "127.0.0.1 friendsapp.com" | sudo tee -a /etc/hosts

cd /Users/asarabia/Repos/local-stack
docker compose up -d
```

`REACT_APP_AUTH_MODE=dev` debe estar seteado (ya en compose) para mostrar el botón "Entrar como dev".

## Smoke (F01-F04)

### F01 — Frontend accesible

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://friendsapp.com:3000/
```

**Esperado:** `200` con HTML conteniendo `<div id="root">`.

### F02 — Bundle JS carga sin errores 404

Abrir DevTools → Network en `http://friendsapp.com:3000/`. Recargar.

**Esperado:** todos los assets (`bundle.js`, CSS) cargan con 200. Sin 404.

### F03 — No hay errores en consola del browser

Abrir DevTools → Console.

**Esperado:** sin errores rojos. Warnings de React Strict Mode aceptables.

### F04 — Hot reload funciona

Con frontend corriendo, editar `frontend/src/components/Login.js` (ej. cambiar un texto). Esperar 2-3s.

**Esperado:** el cambio aparece en el browser sin recargar.

## Login (L01-L06)

### L01 — Botón "Continuar con Google" presente

Ir a `http://friendsapp.com:3000/` → redirige a `/login`.

**Esperado:** botón "Continuar con Google" visible con ícono SVG.

### L02 — Botón "Entrar como dev" presente (solo en `REACT_APP_AUTH_MODE=dev`)

**Esperado:** segundo botón "Entrar como dev (mock)" debajo del de Google, fondo gris.

### L03 — Click en dev login navega a Home

Click "Entrar como dev (mock)".

**Esperado:**
- Redirige a `http://friendsapp.com:3000/auth/callback?token=...`
- Redirige automáticamente a `/`
- Navbar muestra "🌊 Ocean App"

### L04 — Token guardado en localStorage

Abrir DevTools → Application → Local Storage → `http://friendsapp.com:3000`.

**Esperado:** dos keys:
- `token`: JWT string
- `user`: JSON con `{id, email, name, identity_status}`

### L05 — Refresh mantiene sesión

En Home, presionar F5.

**Esperado:** sigue en Home, no redirige a `/login`.

### L06 — Logout limpia localStorage

Menú usuario (esquina superior derecha) → "Cerrar sesión".

**Esperado:** localStorage limpio (sin `token`, sin `user`). Redirige a `/login`.

### L07 — Acceso directo a `/` sin token redirige a login

Limpiar localStorage manualmente. Ir a `http://friendsapp.com:3000/`.

**Esperado:** redirige a `/login`.

## Test OCEAN (T01-T07)

### T01 — Pantalla de test carga preguntas

Login dev → ir a `/test` (ícono cerebro en navbar).

**Esperado:** muestra primera dimensión ("Apertura a la experiencia"), con animación Lottie y 10 preguntas.

### T02 — Botones de respuesta visibles

**Esperado:** para cada pregunta, 5 botones circulares (rojo → verde, escala 1-5).

### T03 — Selección visual

Click en cualquier botón de respuesta.

**Esperado:** botón seleccionado se destaca con ring azul.

### T04 — Botones "Anterior/Siguiente categoría"

Responder todas las preguntas de la primera dimensión. Click "Siguiente categoría".

**Esperado:** pasa a segunda dimensión (Responsabilidad). Preguntas OCEAN cambian a C.

### T05 — Navegación hacia atrás preserva respuestas

Click "Anterior categoría".

**Esperado:** vuelve a primera dimensión con respuestas anteriores marcadas.

### T06 — Finalizar con respuestas parciales

Responder solo 2 preguntas, click "Finalizar".

**Esperado:** (asume frontend lo permite) muestra resultados con scores calculados sobre lo respondido. **Nota:** el backend espera al menos 1 respuesta; si no hay, error 400.

### T07 — Finalizar con 50 respuestas → ver MBTI

Responder todas las preguntas de las 5 dimensiones → click "Finalizar".

**Esperado:** pantalla de resultados con:
- Texto de descripción (parrafo en español)
- JSON con `scores` por dimensión (O, C, E, A, N)
- El `mbti_proxy` se computa server-side pero NO aparece en `Results.js` (ver `frontend/src/components/Results.js:17-22` — bug menor, falta mostrar `result.mbti_proxy`)

**Bug detectado:** `Results.js` solo muestra `result.message` (que el backend no devuelve), no `result.description`. Registrar como issue.

## API integration (API01-API06)

### API01 — `fetchQuestions` llama a :3100

En DevTools → Network, ir a `/test`. Filtrar XHR.

**Esperado:** request a `http://friendsapp.com:3100/api/v1/personality/questions` con `200` y 50 items.

### API02 — `submitAnswers` POST a :3100

En `/test`, click "Finalizar" después de responder. Network → XHR.

**Esperado:** request POST a `:3100/api/v1/personality/answers` con body JSON, `200`, response con scores.

### API03 — `AuthCallback` llama a /me

Limpiar localStorage, ir a `/login`, click dev login. Network → XHR.

**Esperado:** request GET a `http://friendsapp.com:8080/api/auth/me` con header `Authorization: Bearer ...`, `200`.

### API04 — CORS permite localhost y friendsapp.com

Network → ver headers de cualquier request a `:8080` o `:3100`.

**Esperado:** `Access-Control-Allow-Origin` contiene `http://friendsapp.com:3000` o `http://localhost:3000`.

### API05 — Sin `Access-Control-Allow-Credentials` con `*`

**Esperado:** header `Access-Control-Allow-Credentials: true` y `Allow-Origins` con origen específico (no wildcard).

### API06 — `Api.js` apunta a hosts correctos

```bash
grep -E "(localhost|8080|3100)" /Users/asarabia/Repos/frontend/src/Api.js
```

**Esperado:** referencias a `friendsapp.com:8080` y `friendsapp.com:3100`.

## Responsive (R01-R03)

### R01 — Mobile (375px)

Abrir DevTools → Toggle Device Toolbar → iPhone SE.

**Esperado:** login, home y test se ven correctamente, sin scroll horizontal.

### R02 — Tablet (768px)

**Esperado:** layout se adapta, navbar colapsa si aplica.

### R03 — Desktop (1280px)

**Esperado:** layout completo con sidebar en Home.

## Resiliencia UI (U01-U03)

### U01 — Backend caído: mensaje claro

Detener `personality-service`: `docker compose stop personality-service`. Login dev → ir a `/test`.

**Esperado:** error visible al usuario (puede ser silencioso o mostrar mensaje). Verificar network: request a `:3100` falla.

**Reactivar:** `docker compose start personality-service`.

### U02 — JWT expirado en localStorage

Editar manualmente localStorage: cambiar `token` a un JWT expirado.

**Esperado:** siguiente request a `/me` devuelve 401, frontend puede redirigir a `/login` o quedarse colgado (verificar comportamiento).

### U03 — Sin conexión a internet

Detener frontend y backend. Refrescar `/login`.

**Esperado:** error de carga visible.

## Accesibilidad básico (A01-A03)

### A01 — Labels de botones

Inspeccionar botones con DevTools.

**Esperado:** todos los botones con `type="button"` y texto accesible. Botón dev tiene `data-testid="dev-login-btn"`.

### A02 — Contraste de colores

**Esperado:** texto legible (verificar con extensión axe DevTools o Lighthouse).

### A03 — Navegación por teclado

Tab por la página.

**Esperado:** foco visible en cada elemento interactivo.

## Resumen

| Categoría | Tests |
|---|---|
| Smoke | 4 |
| Login | 7 |
| Test OCEAN | 7 |
| API integration | 6 |
| Responsive | 3 |
| Resiliencia UI | 3 |
| Accesibilidad | 3 |
| **Total** | **33** |

## Bugs conocidos detectados durante QA inicial

1. **`Results.js` no muestra MBTI ni descripción**: `frontend/src/components/Results.js:17-22` solo lee `state.result.message` (que el backend no devuelve). Debería leer `state.result.description` y `state.result.mbti_proxy`. Pendiente fix.

2. **`Test.js` hardcoded user_id `"user123"`**: en `frontend/src/components/Test.js:77`, `user_id: "user123"`. Debería leer del JWT (parsear `user_id` del localStorage). Pendiente fix.

3. **`AuthCallback.js` no llama a refresh endpoint**: si JWT expira, no hay rotación automática. Pendiente agregar interceptor o wrapper.