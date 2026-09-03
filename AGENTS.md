# frontend — Agent Context

React CRA (Create React App) para FriendLink. Pantallas de login, home, test OCEAN y resultados. Bundle servido vía CRA dev server en `:3000`.

## Reglas

- **NO ejecutar `docker-compose` sin aprobación explícita del usuario.** Documentar y proponer.
- Todo en español. Sin emojis. Sin comentarios en código.
- No agregar dependencias sin aprobación (package.json congelado salvo necesidad).

## Stack

- React 18 (CRA), React Router v6, Material Tailwind
- `lottie-react` para animaciones OCEAN
- Sin TypeScript (JS puro)
- Build con CRA webpack (no Vite)

## Estructura

```
frontend/
├── public/
│   ├── animations/                # Lottie JSONs por dimensión OCEAN
│   ├── index.html
│   └── ...
├── src/
│   ├── App.js                     # Router, theme provider, token expiry check
│   ├── Api.js                     # helpers: getQuestions, submitAnswers, fetchProfile, fetchMe, ...
│   ├── components/
│   │   ├── Login.js               # botones Google + dev (si AUTH_MODE=dev)
│   │   ├── AuthCallback.js        # lee ?token=, guarda en localStorage, llama /me
│   │   ├── Home.js                # navbar + brain icon (adapta según si hay perfil)
│   │   ├── Test.js                # flujo OCEAN: 5 dimensiones × 10 preguntas
│   │   └── Results.js             # muestra mbti_proxy + description + scores
│   └── index.js
├── package.json
└── TESTS.md                       # QA test cases manuales
```

## Rutas (App.js)

| Path | Componente | Notas |
|---|---|---|
| `/` | Home | si no user → redirect a `/login` |
| `/login` | Login | muestra botón dev si `REACT_APP_AUTH_MODE=dev` |
| `/auth/callback` | AuthCallback | Google OAuth callback, lee `?token=` |
| `/test` | Test | fetch profile on mount → si existe, redirect a `/results` |
| `/results` | Results | fetch on mount (self-sufficient), maneja 404/loading |

## localStorage

| Key | Shape |
|---|---|
| `token` | JWT string |
| `user` | JSON: `{id, email, name, identity_status}` |

## Variables de entorno (build-time)

| Var | Default | Notas |
|---|---|---|
| `REACT_APP_AUTH_MODE` | `production` | si `dev` → muestra botón dev-login |
| `CHOKIDAR_USEPOLLING` | `true` | para hot-reload en Docker |
| `HOST` | `0.0.0.0` | dev server bind |

**CRA congela env vars en build-time.** Si cambiás `REACT_APP_AUTH_MODE`, hay que rebuild la imagen, no alcanza con recreate container.

## URLs del backend (hardcoded)

```js
const IDENTITY_BASE = "http://friendsapp.com:8080"
const PERSONALITY_BASE = "http://friendsapp.com:3100"
```

(Usar `friendsapp.com` y NO `localhost` — el dominio está en `/etc/hosts` apuntando a `127.0.0.1`. Es para simular prod.)

## Gotchas críticos

- **NO uses `localhost`** en fetch URLs. Siempre `friendsapp.com` para que OAuth funcione.
- **Bundle cachea agresivamente.** Después de cambios en código, hard refresh (Cmd+Shift+R) o rebuild imagen.
- **Lottie animations:** `Test.js` usa `require()` dinámico (`require(`.${currentData.animation}`)`). Funciona en CRA por ahora pero es frágil.
- **JWT user_id parsing:** `JSON.parse(atob(token.split('.')[1])).user_id` devuelve number o string según quién generó el JWT. Siempre convertir con `Number()` antes de mandar a backend.
- **React Router state** se pierde en refresh. `Results.js` debe fetchar por su cuenta (no depender de `useLocation().state`).
- **Bundle incluye backend URL hardcoded.** Si cambia el host, hay que rebuild imagen.
- **`AuthCallback.js` maneja 401 con redirect a `/login?error=session_expired`.**
- **`Home.js` adapta el brain icon:** si user tiene personality profile → "Ver mis resultados" → `/results`; si no → "Ir al test" → `/test`.
- **`Test.js` redirige a `/results` si ya hay perfil** (mount check via `fetchProfile`).
- **`Results.js` es self-sufficient:** fetch profile on mount via `fetchProfile(userId)`. Maneja 404 ("Aún no completaste"), loading, error.

## Bugs conocidos arreglados (NO re-romper)

1. ✅ `Results.js` lee `profile.description` y `profile.mbti_proxy` (NO `profile.message` que el backend nunca devuelve).
2. ✅ `Test.js` parsea `user_id` del JWT (NO hardcoded `"user123"`).
3. ✅ `AuthCallback.js` maneja 401 → redirect a `/login`.
4. ✅ `Test.js` navega a `/results` post-Finalizar (NO renderiza resultados inline).
5. ✅ `App.js` mount check: si token expirado → clear storage + redirect a `/login?error=session_expired`.

## Comandos (PROPONER, no ejecutar)

```bash
# Build imagen
docker-compose -f /Users/asarabia/Repos/local-stack/docker-compose.yml build frontend

# Recreate container (CRA NO hace hot-reload de env vars)
docker-compose -f /Users/asarabia/Repos/local-stack/docker-compose.yml up -d --force-recreate frontend

# Verify container usa imagen nueva
docker inspect friendsapp-frontend --format='{{.Created}}'

# Local dev (si Node está instalado)
cd /Users/asarabia/Repos/frontend
npm install
REACT_APP_AUTH_MODE=dev npm start
```

## Verificación rápida post-cambio

```bash
# 1. Frontend responde
curl -s -o /dev/null -w "%{http_code}\n" http://friendsapp.com:3000/

# 2. Hot reload activo (cambios en src/ se reflejan sin rebuild)
docker-compose -f /Users/asarabia/Repos/local-stack/docker-compose.yml logs frontend | grep -i webpack
```

## Próximos pasos (depende de milestones)

- **M3:** Editar perfil (bio, intereses, fotos upload a MinIO).
- **M4:** Pantalla de discovery/swipe de matches.
- **M6:** Chat 1:1 UI.
- **M8:** Wallet UI (mostrar FriendCoins, purchases).
- **M10:** Push notifications + service worker.