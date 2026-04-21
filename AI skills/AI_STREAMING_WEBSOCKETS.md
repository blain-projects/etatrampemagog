# Guide d'Intégration : Streaming IA en Temps Réel via WebSockets

**Contexte :** Ce document est un guide d'implémentation destiné aux agents IA et aux développeurs travaillant sur ce dépôt (`template-fullstack-web`). Il décrit l'architecture requise pour intégrer des fonctionnalités génératives (LLM) nécessitant du streaming en temps réel (pour éviter les timeouts HTTP) au sein de la stack FastAPI + React 19 + Docker/Traefik.

## 1. Outils et Dépendances Requises

### Backend (Python / FastAPI)
Aucune dépendance externe lourde n'est requise, FastAPI intègre le support natif.
* **Modules natifs :** `asyncio` (pour les générateurs asynchrones).
* **Composants FastAPI :** `WebSocket`, `WebSocketDisconnect`.

### Frontend (React 19 / Vite)
* **API native du navigateur :** L'objet natif `WebSocket` est amplement suffisant.
* *(Optionnel)* Si la gestion des reconnexions devient complexe, installer `react-use-websocket`.

### Infrastructure (Docker / Traefik sur blain-projects.ca)
* **Zéro configuration requise :** Traefik proxyifie automatiquement les connexions HTTP `101 Switching Protocols`. Il convertit nativement les requêtes externes sécurisées `wss://` vers le `ws://` interne du conteneur Docker.
* **Sécurité :** Le middleware ForwardAuth protège déjà la route. Le cookie de session passera lors du handshake initial.

---

## 2. Spécifications d'Implémentation Backend

L'agent IA doit implémenter une route WebSocket dédiée dans FastAPI pour gérer le flux de l'agent LLM.

**Règles de code Backend :**
1.  Utiliser le décorateur `@app.websocket("/ws/nom-de-la-feature")`.
2.  Accepter la connexion via `await websocket.accept()`.
3.  Gérer obligatoirement l'exception `WebSocketDisconnect` pour éviter les crashs de workers si l'utilisateur ferme son onglet de navigateur.
4.  La fonction générant la réponse de l'IA (ex: appel OpenAI ou PydanticAI) DOIT être un générateur asynchrone (`async def generator(): ... yield chunk`).
5.  Diffuser les fragments (chunks) via `await websocket.send_text(chunk)`.

---

## 3. Spécifications d'Implémentation Frontend

Le composant React doit établir la connexion, écouter le flux et mettre à jour le DOM sans causer de re-rendus inutiles de toute la page.

**Règles de code Frontend :**
1.  Utiliser `useRef` pour stocker l'instance du WebSocket afin qu'elle persiste entre les rendus (`const ws = useRef(null);`).
2.  Initialiser la connexion dans un `useEffect` qui se déclenche au montage du composant.
3.  **Nettoyage obligatoire :** Retourner une fonction dans le `useEffect` qui appelle `ws.current.close()` pour éviter les fuites de mémoire.
4.  Utiliser l'événement `onmessage` pour concaténer les fragments reçus au *state* du message courant via l'updater de fonction : `setMessages(prev => prev + event.data)`.

---

## 4. Documentation et Ressources de Référence

Si l'agent IA ou le développeur rencontre une difficulté, se référer impérativement à ces documentations officielles :

* **Implémentation Backend FastAPI :** [https://fastapi.tiangolo.com/advanced/websockets/](https://fastapi.tiangolo.com/advanced/websockets/)
* **API Frontend MDN :** [https://developer.mozilla.org/fr/docs/Web/API/WebSocket](https://developer.mozilla.org/fr/docs/Web/API/WebSocket)
* **Gestion du proxying Traefik :** [https://doc.traefik.io/traefik/routing/routers/#websocket](https://doc.traefik.io/traefik/routing/routers/#websocket)