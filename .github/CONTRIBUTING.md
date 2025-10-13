# 🤝 Contributing to HD_App_chart

Vielen Dank für dein Interesse, zu HD_App_chart beizutragen! Dieses Dokument erklärt, wie du am besten beitragen kannst.

## 📋 Inhaltsverzeichnis

- [Code of Conduct](#code-of-conduct)
- [Wie kann ich beitragen?](#wie-kann-ich-beitragen)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

Dieses Projekt folgt einem Code of Conduct. Durch deine Teilnahme stimmst du zu, diesen einzuhalten.

## Wie kann ich beitragen?

### 🐛 Bug Reports

Wenn du einen Bug findest:

1. **Prüfe**, ob der Bug bereits gemeldet wurde
2. **Erstelle** ein neues Issue mit dem "Bug Report" Template
3. **Beschreibe** das Problem detailliert
4. **Füge** Screenshots oder Logs hinzu

### ✨ Feature Requests

Für neue Features:

1. **Prüfe**, ob das Feature bereits vorgeschlagen wurde
2. **Erstelle** ein neues Issue mit dem "Feature Request" Template
3. **Beschreibe** die Motivation und den Nutzen
4. **Diskutiere** mit der Community

### 💻 Code Contributions

1. **Fork** das Repository
2. **Erstelle** einen Feature Branch
3. **Implementiere** deine Änderungen
4. **Teste** gründlich
5. **Erstelle** einen Pull Request

## Development Setup

### Voraussetzungen

- Node.js 20+
- npm oder yarn
- Docker & Docker Compose
- Git

### Installation

```bash
# Repository klonen
git clone https://github.com/yourusername/HD_App_chart.git
cd HD_App_chart

# Dependencies installieren
cd frontend
npm install

# Environment Variables konfigurieren
cp .env.local.example .env.local
# Bearbeite .env.local mit deinen Werten

# Development Server starten
npm run dev
```

### Development Workflow

```bash
# 1. Development Server (Port 3005)
cd frontend
npm run dev

# 2. Docker-Dev (Port 3000)
docker-compose -f docker-compose.dev.yml up -d

# 3. Staging (Port 3002)
.\deploy\staging\deploy-staging.ps1

# 4. Production-Local (Port 3004)
.\deploy\production\deploy-prod-local.ps1
```

## Coding Guidelines

### TypeScript

```typescript
// ✅ Verwende explizite Types
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Verwende Interfaces für Objekte
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Verwende Enums für konstante Werte
enum UserRole {
  ADMIN = 'admin',
  VIP = 'vip',
  FREE = 'free'
}
```

### React Components

```typescript
// ✅ Funktionale Komponenten mit TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
}
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions**: camelCase (`calculateTotal()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Files**: kebab-case (`user-profile.tsx`)
- **CSS Classes**: kebab-case (`user-profile-card`)

### Code Style

```typescript
// ✅ Verwende const/let statt var
const apiUrl = process.env.API_URL;
let counter = 0;

// ✅ Verwende Arrow Functions
const handleClick = () => {
  console.log('Clicked');
};

// ✅ Verwende Template Literals
const message = `Hello, ${userName}!`;

// ✅ Verwende Optional Chaining
const email = user?.profile?.email;

// ✅ Verwende Nullish Coalescing
const port = process.env.PORT ?? 3000;
```

### Error Handling

```typescript
// ✅ Verwende try-catch für async Operationen
try {
  const data = await fetchData();
  return data;
} catch (error) {
  logger.error('Failed to fetch data', error);
  throw new Error('Data fetch failed');
}

// ✅ Verwende Error Boundaries für React
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

## Pull Request Process

### 1. Branch erstellen

```bash
# Feature Branch
git checkout -b feature/user-authentication

# Bug Fix Branch
git checkout -b fix/login-error

# Refactoring Branch
git checkout -b refactor/api-client
```

### 2. Änderungen implementieren

```bash
# Änderungen committen
git add .
git commit -m "feat: add user authentication"

# Tests ausführen
npm test
npm run lint
npm run build
```

### 3. Pull Request erstellen

1. **Push** deinen Branch
2. **Erstelle** einen Pull Request auf GitHub
3. **Fülle** das PR Template aus
4. **Warte** auf Review

### 4. Review Process

- Code Review durch Maintainer
- CI/CD Checks müssen bestehen
- Mindestens 1 Approval erforderlich
- Alle Kommentare müssen aufgelöst sein

### 5. Merge

Nach Approval wird der PR gemerged:
- **Squash and Merge** für Feature Branches
- **Rebase and Merge** für kleine Fixes
- **Merge Commit** für größere Features

## Commit Message Guidelines

Wir folgen den [Conventional Commits](https://www.conventionalcommits.org/) Richtlinien:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: Neues Feature
- **fix**: Bug Fix
- **docs**: Dokumentation
- **style**: Code-Formatierung
- **refactor**: Code-Refactoring
- **test**: Tests
- **chore**: Build/Tool-Änderungen

### Beispiele

```bash
# Feature
git commit -m "feat(auth): add user authentication"

# Bug Fix
git commit -m "fix(login): resolve token expiration issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(api): simplify error handling"

# Breaking Change
git commit -m "feat(api)!: change authentication endpoint

BREAKING CHANGE: Authentication endpoint changed from /auth to /api/auth"
```

## Testing

### Unit Tests

```typescript
// ✅ Schreibe Tests für neue Features
describe('calculateTotal', () => {
  it('should calculate total correctly', () => {
    const items = [
      { price: 10 },
      { price: 20 }
    ];
    expect(calculateTotal(items)).toBe(30);
  });
});
```

### Integration Tests

```typescript
// ✅ Teste API-Integrationen
describe('User API', () => {
  it('should fetch user data', async () => {
    const user = await fetchUser('123');
    expect(user).toHaveProperty('id', '123');
  });
});
```

### E2E Tests

```typescript
// ✅ Teste User Flows
describe('Login Flow', () => {
  it('should login successfully', async () => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## Documentation

### Code Comments

```typescript
// ✅ Kommentiere komplexe Logik
/**
 * Calculates the total price of items with tax
 * @param items - Array of items with prices
 * @param taxRate - Tax rate as decimal (e.g., 0.19 for 19%)
 * @returns Total price including tax
 */
function calculateTotalWithTax(items: Item[], taxRate: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + taxRate);
}
```

### README Updates

Wenn du Features hinzufügst, aktualisiere die README:
- Installation Instructions
- Usage Examples
- API Documentation
- Configuration Options

## Questions?

Wenn du Fragen hast:

1. **Prüfe** die Dokumentation
2. **Suche** in bestehenden Issues
3. **Erstelle** ein neues Issue
4. **Kontaktiere** die Maintainer

## License

Durch deine Beiträge stimmst du zu, dass deine Arbeit unter der gleichen Lizenz wie das Projekt veröffentlicht wird.

---

**Vielen Dank für deine Beiträge! 🎉**

