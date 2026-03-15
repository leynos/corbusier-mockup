/** @file Conversation fixture data: messages, tool calls, handoffs.
 *
 * All entity display strings live in `localizations` maps. Message
 * content is raw text (not localised entity data) per the
 * data-model-driven card architecture spec.
 */

import type { EntityLocalizations } from "../app/domain/entities/localization";

/* ── Enums and primitives ──────────────────────────────────────────── */

/** Allowed authorship roles for timeline messages in a conversation. */
export type MessageRole = "user" | "assistant" | "tool" | "system";

/** Outcome state for a tool invocation captured in the conversation log. */
export type ToolCallStatus = "succeeded" | "failed" | "pending";

/** High-level activity state for a conversation summary row. */
export type ConversationStatus = "active" | "idle";

/** Current agent turn status shown in the detail header badge. */
export type TurnState = "idle" | "processing" | "awaiting_tool_result";

/* ── Tool call info ────────────────────────────────────────────────── */

/**
 * Structured metadata for one tool execution emitted into the conversation log.
 */
export interface ToolCallInfo {
  /** Stable string identifier for this tool call instance. */
  readonly callId: string;
  /** Tool name shown in the execution card header. */
  readonly toolName: string;
  /** Execution outcome displayed in the tool status badge. */
  readonly status: ToolCallStatus;
  /** Execution duration in milliseconds. */
  readonly durationMs: number;
  /** Raw tool input captured for the expandable details view. */
  readonly input: string;
  /** Raw tool output captured for the expandable details view. */
  readonly output: string;
}

/* ── Message ───────────────────────────────────────────────────────── */

/** One chronological message entry within a conversation timeline. */
export interface Message {
  /** Stable string identifier for the message. */
  readonly id: string;
  /** Author or event role for this message. */
  readonly role: MessageRole;
  /** Plain-text body content rendered in the timeline. */
  readonly content: string;
  /** ISO-8601 timestamp string for chronological display. */
  readonly timestamp: string;
  /** Optional backend identifier for assistant-authored messages. */
  readonly agentBackend?: string;
  /** Optional tool execution details for tool-role messages. */
  readonly toolCall?: ToolCallInfo;
}

/* ── Handoff ───────────────────────────────────────────────────────── */

/** Marker describing where agent ownership changes within a conversation. */
export interface Handoff {
  /** Zero-based insertion point within the message list. */
  readonly position: number;
  /** Backend name handing work off. */
  readonly fromBackend: string;
  /** Backend name receiving work. */
  readonly toBackend: string;
}

/* ── Conversation ──────────────────────────────────────────────────── */

/** Project-scoped conversation fixture rendered by the conversations UI. */
export interface Conversation {
  /** Stable string identifier used in routes and links. */
  readonly id: string;
  /** Localized conversation title and description content. */
  readonly localizations: EntityLocalizations;
  /** Task identifier associated with this conversation. */
  readonly taskId: string;
  /** Project slug that scopes the conversation to one project. */
  readonly projectSlug: string;
  /** Chronological timeline messages shown in the detail view. */
  readonly messages: readonly Message[];
  /** Active backend label shown in the agent status badge. */
  readonly agentBackend: string;
  /** Model identifier shown alongside the backend label. */
  readonly agentModel: string;
  /** Current turn state surfaced in the header badge. */
  readonly turnState: TurnState;
  /** Summary activity state used in list views. */
  readonly status: ConversationStatus;
  /** Handoff markers inserted between messages in the timeline. */
  readonly handoffs: readonly Handoff[];
}

/* ── Fixture data ──────────────────────────────────────────────────── */

const CONV_1_MESSAGES: readonly Message[] = [
  {
    id: "msg-1-01",
    role: "system",
    content: "Task execution initiated. Backend: Claude Code SDK. Policy: engineering-standard.",
    timestamp: "2026-03-10T09:00:00Z",
  },
  {
    id: "msg-1-02",
    role: "user",
    content:
      "Migrate the database connection pooling from direct PostgreSQL connections to pgBouncer. Use transaction-level pooling mode.",
    timestamp: "2026-03-10T09:01:00Z",
  },
  {
    id: "msg-1-03",
    role: "assistant",
    content:
      "I will analyse the existing connection pool implementation and prepare a pgBouncer migration plan. Let me start by locating the relevant source files.",
    timestamp: "2026-03-10T09:01:30Z",
    agentBackend: "claude_code_sdk",
  },
  {
    id: "msg-1-04",
    role: "tool",
    content: "Executed bash command to find connection pool files.",
    timestamp: "2026-03-10T09:02:00Z",
    toolCall: {
      callId: "tc-001",
      toolName: "bash_execute",
      status: "succeeded",
      durationMs: 340,
      input: 'find src/ -name "*connection*" -o -name "*pool*"',
      output:
        "src/database/connectionPool.js\nsrc/database/poolManager.js\nsrc/config/databaseConfig.js\nsrc/middleware/dbConnection.js\nsrc/utils/poolMonitor.js",
    },
  },
  {
    id: "msg-1-05",
    role: "assistant",
    content:
      "Found five relevant files. I will now review the current configuration and create the pgBouncer setup. The plan is:\n\n1. Create pgBouncer configuration file\n2. Update application connection strings\n3. Add health check endpoints",
    timestamp: "2026-03-10T09:03:00Z",
    agentBackend: "claude_code_sdk",
  },
  {
    id: "msg-1-06",
    role: "tool",
    content: "Created pgBouncer configuration file.",
    timestamp: "2026-03-10T09:10:00Z",
    toolCall: {
      callId: "tc-002",
      toolName: "file_create",
      status: "succeeded",
      durationMs: 120,
      input: "config/pgbouncer.ini",
      output:
        "[databases]\nplatform_api = host=postgres-primary.internal port=5432 dbname=platform_api\n\n[pgbouncer]\nlisten_addr = 0.0.0.0\nlisten_port = 6432\npool_mode = transaction\nmax_client_conn = 1000\ndefault_pool_size = 25",
    },
  },
  {
    id: "msg-1-07",
    role: "user",
    content:
      "Make sure to use transaction-level pooling mode. Session pooling will not work with our prepared statements.",
    timestamp: "2026-03-10T10:00:00Z",
  },
  {
    id: "msg-1-08",
    role: "assistant",
    content:
      "Understood. The pgBouncer configuration already uses pool_mode = transaction, which ensures compatibility with prepared statements whilst providing connection pooling benefits. Running integration tests now.",
    timestamp: "2026-03-10T10:01:00Z",
    agentBackend: "claude_code_sdk",
  },
  {
    id: "msg-1-09",
    role: "tool",
    content: "Ran integration test suite for connection pooling.",
    timestamp: "2026-03-10T10:05:00Z",
    toolCall: {
      callId: "tc-003",
      toolName: "bash_execute",
      status: "succeeded",
      durationMs: 3200,
      input: 'npm run test:integration -- --grep "connection pool"',
      output:
        "Connection Pool Tests\n  ✓ should establish connection through pgBouncer (145ms)\n  ✓ should handle concurrent connections (892ms)\n  ✓ should respect pool size limits (456ms)\n  ✓ should reconnect on connection loss (1234ms)\n  ✓ should track pool metrics (234ms)\n\n5 passing (3.2s)",
    },
  },
  {
    id: "msg-1-10",
    role: "assistant",
    content:
      "All five integration tests pass. The pgBouncer migration is complete. Connection pooling is now operating in transaction mode with a default pool size of 25.",
    timestamp: "2026-03-10T10:06:00Z",
    agentBackend: "claude_code_sdk",
  },
];

const CONV_2_MESSAGES: readonly Message[] = [
  {
    id: "msg-2-01",
    role: "system",
    content: "Task execution initiated. Backend: Codex CLI. Policy: review-standard.",
    timestamp: "2026-03-11T14:00:00Z",
  },
  {
    id: "msg-2-02",
    role: "user",
    content:
      "Review the authentication middleware and ensure all endpoints enforce token validation. Check for any bypasses.",
    timestamp: "2026-03-11T14:01:00Z",
  },
  {
    id: "msg-2-03",
    role: "assistant",
    content:
      "I will audit the authentication middleware stack. Let me enumerate all route handlers and their middleware chains.",
    timestamp: "2026-03-11T14:02:00Z",
    agentBackend: "codex_cli",
  },
  {
    id: "msg-2-04",
    role: "tool",
    content: "Scanned route handlers for authentication middleware.",
    timestamp: "2026-03-11T14:03:00Z",
    toolCall: {
      callId: "tc-101",
      toolName: "codebase_search",
      status: "succeeded",
      durationMs: 1850,
      input: "pattern: router.use|app.use|authenticate|requireAuth",
      output:
        "Found 23 route handlers.\n12 use requireAuth middleware.\n8 use optional auth.\n3 have NO auth middleware:\n  - GET /api/health\n  - GET /api/version\n  - POST /api/webhooks/stripe",
    },
  },
  {
    id: "msg-2-05",
    role: "assistant",
    content:
      "I found three endpoints without authentication middleware. The health and version endpoints are expected to be public. However, the Stripe webhook endpoint at POST /api/webhooks/stripe should validate the Stripe signature header. Let me check its implementation.",
    timestamp: "2026-03-11T14:04:00Z",
    agentBackend: "codex_cli",
  },
  {
    id: "msg-2-06",
    role: "tool",
    content: "Read the Stripe webhook handler source.",
    timestamp: "2026-03-11T14:05:00Z",
    toolCall: {
      callId: "tc-102",
      toolName: "file_read",
      status: "succeeded",
      durationMs: 45,
      input: "src/routes/webhooks/stripe.ts",
      output:
        "// WARNING: No signature verification!\nrouter.post('/stripe', async (req, res) => {\n  const event = req.body;\n  await processWebhookEvent(event);\n  res.sendStatus(200);\n});",
    },
  },
  {
    id: "msg-2-07",
    role: "assistant",
    content:
      "Critical finding: the Stripe webhook handler does not verify the webhook signature. This means any attacker could forge webhook events. I will add Stripe signature verification.",
    timestamp: "2026-03-11T14:06:00Z",
    agentBackend: "codex_cli",
  },
  {
    id: "msg-2-08",
    role: "tool",
    content: "Applied Stripe signature verification patch.",
    timestamp: "2026-03-11T14:10:00Z",
    toolCall: {
      callId: "tc-103",
      toolName: "file_edit",
      status: "succeeded",
      durationMs: 210,
      input: "src/routes/webhooks/stripe.ts — add stripe.webhooks.constructEvent verification",
      output: "File updated. Added signature verification using STRIPE_WEBHOOK_SECRET.",
    },
  },
  {
    id: "msg-2-09",
    role: "tool",
    content: "Ran webhook test suite.",
    timestamp: "2026-03-11T14:12:00Z",
    toolCall: {
      callId: "tc-104",
      toolName: "bash_execute",
      status: "failed",
      durationMs: 1500,
      input: "npm run test -- --grep webhook",
      output:
        "Webhook Tests\n  ✓ rejects unsigned requests (42ms)\n  ✓ accepts valid signatures (38ms)\n  ✗ handles expired signatures (timeout)\n\n2 passing, 1 failing",
    },
  },
  {
    id: "msg-2-10",
    role: "assistant",
    content:
      "Two of three webhook tests pass. The expired-signature test is timing out — likely a test configuration issue with the clock mock. I will investigate the test setup.",
    timestamp: "2026-03-11T14:13:00Z",
    agentBackend: "codex_cli",
  },
];

const CONV_3_MESSAGES: readonly Message[] = [
  {
    id: "msg-3-01",
    role: "system",
    content: "Task execution initiated. Backend: Claude Code SDK. Policy: engineering-standard.",
    timestamp: "2026-03-12T08:00:00Z",
  },
  {
    id: "msg-3-02",
    role: "user",
    content:
      "Set up the CI/CD pipeline for the new microservice. It needs build, test, and deploy stages.",
    timestamp: "2026-03-12T08:01:00Z",
  },
  {
    id: "msg-3-03",
    role: "assistant",
    content:
      "I will create a GitHub Actions workflow with three stages: build, test, and deploy. Let me check the existing CI configuration first.",
    timestamp: "2026-03-12T08:02:00Z",
    agentBackend: "claude_code_sdk",
  },
  {
    id: "msg-3-04",
    role: "tool",
    content: "Listed existing workflow files.",
    timestamp: "2026-03-12T08:03:00Z",
    toolCall: {
      callId: "tc-201",
      toolName: "bash_execute",
      status: "succeeded",
      durationMs: 180,
      input: "ls -la .github/workflows/",
      output:
        "total 8\n-rw-r--r-- 1 user user 2048 Mar 1 main.yml\n-rw-r--r-- 1 user user 1024 Mar 1 lint.yml",
    },
  },
  {
    id: "msg-3-05",
    role: "assistant",
    content:
      "There are two existing workflows. I will create a new deploy.yml workflow that extends the existing patterns. Handing off to the Codex CLI backend for the deployment configuration, as it has access to the infrastructure credentials.",
    timestamp: "2026-03-12T08:04:00Z",
    agentBackend: "claude_code_sdk",
  },
  {
    id: "msg-3-06",
    role: "assistant",
    content:
      "I have received the handoff from Claude Code SDK. I will configure the deployment stage with staging and production environments, including the necessary secrets and approval gates.",
    timestamp: "2026-03-12T08:05:00Z",
    agentBackend: "codex_cli",
  },
  {
    id: "msg-3-07",
    role: "tool",
    content: "Created deployment workflow file.",
    timestamp: "2026-03-12T08:10:00Z",
    toolCall: {
      callId: "tc-202",
      toolName: "file_create",
      status: "succeeded",
      durationMs: 95,
      input: ".github/workflows/deploy.yml",
      output:
        "name: Deploy\non:\n  push:\n    branches: [main]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run build\n  test:\n    needs: build\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test\n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    environment: production\n    steps:\n      - run: ./scripts/deploy.sh",
    },
  },
  {
    id: "msg-3-08",
    role: "assistant",
    content:
      "The deployment workflow is ready. It runs build → test → deploy in sequence, with the deploy stage gated by the production environment approval requirement.",
    timestamp: "2026-03-12T08:11:00Z",
    agentBackend: "codex_cli",
  },
];

const CONV_4_MESSAGES: readonly Message[] = [
  {
    id: "msg-4-01",
    role: "system",
    content: "Task execution initiated. Backend: Claude Code SDK. Policy: engineering-standard.",
    timestamp: "2026-03-12T11:00:00Z",
  },
  {
    id: "msg-4-02",
    role: "user",
    content:
      "Add rate limiting to the public API endpoints. Use a sliding window algorithm with configurable limits per endpoint.",
    timestamp: "2026-03-12T11:01:00Z",
  },
  {
    id: "msg-4-03",
    role: "assistant",
    content:
      "I will implement a Redis-backed sliding window rate limiter as Express middleware. Let me first check the existing middleware stack.",
    timestamp: "2026-03-12T11:02:00Z",
    agentBackend: "claude_code_sdk",
  },
  {
    id: "msg-4-04",
    role: "tool",
    content: "Checked existing middleware configuration.",
    timestamp: "2026-03-12T11:03:00Z",
    toolCall: {
      callId: "tc-301",
      toolName: "file_read",
      status: "succeeded",
      durationMs: 32,
      input: "src/middleware/index.ts",
      output:
        "export { authMiddleware } from './auth';\nexport { corsMiddleware } from './cors';\nexport { loggingMiddleware } from './logging';\n// No rate limiting middleware found",
    },
  },
  {
    id: "msg-4-05",
    role: "assistant",
    content:
      "No rate limiting exists yet. I will create the rate limiter middleware with Redis as the backing store and a configurable per-endpoint limit map.",
    timestamp: "2026-03-12T11:04:00Z",
    agentBackend: "claude_code_sdk",
  },
];

export const CONVERSATIONS: readonly Conversation[] = [
  {
    id: "conv-1",
    localizations: {
      "en-GB": {
        name: "pgBouncer migration",
        description: "Database connection pool migration to pgBouncer",
      },
      ar: {
        name: "ترحيل pgBouncer",
        description: "ترحيل تجمع اتصالات قاعدة البيانات إلى pgBouncer",
      },
      de: {
        name: "pgBouncer-Migration",
        description: "Migration des Datenbankverbindungspools zu pgBouncer",
      },
      es: {
        name: "Migración a pgBouncer",
        description: "Migración del pool de conexiones a pgBouncer",
      },
      hi: { name: "pgBouncer माइग्रेशन", description: "डेटाबेस कनेक्शन पूल का pgBouncer में माइग्रेशन" },
      ja: { name: "pgBouncer移行", description: "データベース接続プールのpgBouncer移行" },
      "zh-CN": { name: "pgBouncer 迁移", description: "数据库连接池迁移至 pgBouncer" },
    },
    taskId: "TASK-1001",
    projectSlug: "apollo-guidance",
    messages: CONV_1_MESSAGES,
    agentBackend: "claude_code_sdk",
    agentModel: "claude-sonnet-4",
    turnState: "idle",
    status: "idle",
    handoffs: [],
  },
  {
    id: "conv-2",
    localizations: {
      "en-GB": {
        name: "Authentication audit",
        description: "Security review of authentication middleware",
      },
      ar: { name: "تدقيق المصادقة", description: "مراجعة أمنية لبرمجيات المصادقة الوسيطة" },
      de: {
        name: "Authentifizierungs-Audit",
        description: "Sicherheitsüberprüfung der Authentifizierungs-Middleware",
      },
      es: {
        name: "Auditoría de autenticación",
        description: "Revisión de seguridad del middleware de autenticación",
      },
      hi: { name: "प्रमाणीकरण ऑडिट", description: "प्रमाणीकरण मिडलवेयर की सुरक्षा समीक्षा" },
      ja: { name: "認証監査", description: "認証ミドルウェアのセキュリティレビュー" },
      "zh-CN": { name: "认证审计", description: "认证中间件安全审查" },
    },
    taskId: "TASK-1004",
    projectSlug: "apollo-guidance",
    messages: CONV_2_MESSAGES,
    agentBackend: "codex_cli",
    agentModel: "codex-2026-03",
    turnState: "processing",
    status: "active",
    handoffs: [],
  },
  {
    id: "conv-3",
    localizations: {
      "en-GB": {
        name: "CI/CD pipeline setup",
        description: "Configure build, test, and deploy stages",
      },
      ar: { name: "إعداد خط أنابيب CI/CD", description: "تهيئة مراحل البناء والاختبار والنشر" },
      de: {
        name: "CI/CD-Pipeline einrichten",
        description: "Build-, Test- und Deploy-Stufen konfigurieren",
      },
      es: {
        name: "Configuración de CI/CD",
        description: "Configurar etapas de compilación, prueba y despliegue",
      },
      hi: { name: "CI/CD पाइपलाइन सेटअप", description: "बिल्ड, टेस्ट और डिप्लॉय चरणों को कॉन्फ़िगर करें" },
      ja: { name: "CI/CDパイプライン構築", description: "ビルド、テスト、デプロイステージの設定" },
      "zh-CN": { name: "CI/CD 流水线搭建", description: "配置构建、测试和部署阶段" },
    },
    taskId: "TASK-1002",
    projectSlug: "netsuke-weave",
    messages: CONV_3_MESSAGES,
    agentBackend: "codex_cli",
    agentModel: "codex-2026-03",
    turnState: "idle",
    status: "idle",
    handoffs: [{ position: 5, fromBackend: "Claude Code SDK", toBackend: "Codex CLI" }],
  },
  {
    id: "conv-4",
    localizations: {
      "en-GB": { name: "API rate limiting", description: "Implement sliding window rate limiter" },
      ar: { name: "تحديد معدل API", description: "تنفيذ محدد معدل النافذة المنزلقة" },
      de: {
        name: "API-Ratenbegrenzung",
        description: "Gleitendes Fenster-Ratenbegrenzer implementieren",
      },
      es: {
        name: "Limitación de tasa de API",
        description: "Implementar limitador de tasa de ventana deslizante",
      },
      hi: { name: "API दर सीमित करना", description: "स्लाइडिंग विंडो रेट लिमिटर लागू करें" },
      ja: { name: "APIレート制限", description: "スライディングウィンドウ レートリミッタの実装" },
      "zh-CN": { name: "API 速率限制", description: "实现滑动窗口速率限制器" },
    },
    taskId: "TASK-1006",
    projectSlug: "netsuke-weave",
    messages: CONV_4_MESSAGES,
    agentBackend: "claude_code_sdk",
    agentModel: "claude-sonnet-4",
    turnState: "awaiting_tool_result",
    status: "active",
    handoffs: [],
  },
];

/* ── Helpers ───────────────────────────────────────────────────────── */

/** Find a conversation by its project slug and ID. */
export function findConversation(projectSlug: string, id: string): Conversation | undefined {
  return CONVERSATIONS.find((conversation) => {
    return conversation.projectSlug === projectSlug && conversation.id === id;
  });
}

/** Get all conversations for a given project slug. */
export function getConversationsForProject(slug: string): readonly Conversation[] {
  return CONVERSATIONS.filter((c) => c.projectSlug === slug);
}

/** Get the last message timestamp for a conversation. */
export function getLastActivityTimestamp(conversation: Conversation): string {
  const last = conversation.messages[conversation.messages.length - 1];
  return last?.timestamp ?? "";
}
