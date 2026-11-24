import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Icon } from "../ui/Icon.jsx";

const integrationSteps = [
  { label: "React interface", detail: "Prompt and response UI", icon: "grid" },
  { label: "FastAPI backend", detail: "Validated REST endpoint", icon: "activity" },
  { label: "Gemini provider", detail: "Backend-only API connection", icon: "sparkles" },
];

function OverviewDashboard({ backendMessage, backendStatus, onOpenAi }) {
  const statusVariant =
    backendStatus === "Connected"
      ? "success"
      : backendStatus === "Disconnected"
        ? "danger"
        : "warning";

  return (
    <section className="page-section">
      <header className="page-heading">
        <div>
          <p className="eyebrow">WORKSPACE / OVERVIEW</p>
          <h1>Build something remarkable.</h1>
          <p className="page-description">
            Your reusable foundation for turning a new idea into a working
            hackathon project.
          </p>
        </div>
        <Badge variant="accent">
          <Icon name="sparkles" size={14} />
          Starter workspace
        </Badge>
      </header>

      <div className="welcome-panel">
        <div className="welcome-copy">
          <div className="welcome-kicker">
            <span className="welcome-kicker-dot" />
            YOUR PROJECT WORKSPACE
          </div>
          <h2>A solid starting point for your next big idea.</h2>
          <p>
            Start with a clean React interface, a FastAPI backend, and a
            reusable AI integration. Shape the rest around the challenge you
            choose.
          </p>
          <Button onClick={onOpenAi} variant="primary">
            Open AI playground
            <Icon name="arrowUpRight" size={16} />
          </Button>
        </div>
        <div className="architecture-preview" aria-label="Application request flow">
          <div className="preview-topline">
            <span>REQUEST FLOW</span>
            <span className="preview-live">
              <span />
              MODULE MAP
            </span>
          </div>
          <div className="flow-step">
            <span className="flow-icon flow-icon-purple">
              <Icon name="grid" size={16} />
            </span>
            <span>
              <strong>React</strong>
              <small>Frontend</small>
            </span>
            <span className="flow-port" />
          </div>
          <div className="flow-connector" />
          <div className="flow-step">
            <span className="flow-icon flow-icon-blue">
              <Icon name="activity" size={16} />
            </span>
            <span>
              <strong>FastAPI</strong>
              <small>Backend API</small>
            </span>
            <span className="flow-port" />
          </div>
          <div className="flow-connector" />
          <div className="flow-step">
            <span className="flow-icon flow-icon-green">
              <Icon name="sparkles" size={16} />
            </span>
            <span>
              <strong>Gemini</strong>
              <small>AI provider</small>
            </span>
            <Badge variant="neutral">Optional</Badge>
          </div>
          <p className="preview-note">
            Provider credentials stay on the backend.
          </p>
        </div>
        <span className="welcome-glow" aria-hidden="true" />
      </div>

      <div className="section-heading">
        <div>
          <h2>System overview</h2>
          <p>Current app modules and their actual connection state.</p>
        </div>
        <span className="section-caption">LIVE APP STATUS</span>
      </div>

      <div className="overview-grid">
        <Card
          className="overview-card"
          title="Backend API"
          description="FastAPI service at the local development endpoint."
        >
          <div className="overview-card-main">
            <span className="module-icon module-icon-blue">
              <Icon name="activity" size={18} />
            </span>
            <Badge dot variant={statusVariant}>
              {backendStatus}
            </Badge>
          </div>
          <p className="backend-response">{backendMessage}</p>
          <div className="card-footnote">
            <span className="status-pulse" />
            <span>GET / connection check</span>
          </div>
        </Card>

        <Card
          className="overview-card"
          title="AI integration"
          description="A working prompt flow through the backend."
        >
          <div className="overview-card-main">
            <span className="module-icon module-icon-purple">
              <Icon name="sparkles" size={18} />
            </span>
            <Badge variant="accent">Integrated</Badge>
          </div>
          <p className="endpoint-label">POST /api/ai/chat</p>
          <button className="text-action" onClick={onOpenAi} type="button">
            Try the AI playground
            <Icon name="arrowUpRight" size={15} />
          </button>
        </Card>

        <Card
          className="overview-card stack-card"
          title="Technology stack"
          description="Simple building blocks, ready to extend."
        >
          <div className="stack-list">
            <div className="stack-row">
              <span className="stack-mark react-mark">R</span>
              <span>
                <strong>React + Vite</strong>
                <small>Frontend</small>
              </span>
              <Badge variant="success">Ready</Badge>
            </div>
            <div className="stack-row">
              <span className="stack-mark python-mark">Py</span>
              <span>
                <strong>Python + FastAPI</strong>
                <small>Backend</small>
              </span>
              <Badge variant="success">Ready</Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card
        className="integration-card"
        title="How the AI request travels"
        description="A small, clear boundary keeps provider details out of the browser."
        actions={<Badge variant="neutral">Current architecture</Badge>}
      >
        <div className="integration-flow">
          {integrationSteps.map((step, index) => (
            <div className="integration-flow-item" key={step.label}>
              <span className={`integration-icon integration-icon-${index}`}>
                <Icon name={step.icon} size={17} />
              </span>
              <span>
                <strong>{step.label}</strong>
                <small>{step.detail}</small>
              </span>
              {index < integrationSteps.length - 1 && (
                <span className="integration-arrow" aria-hidden="true">
                  <Icon name="arrowUpRight" size={15} />
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

export default OverviewDashboard;
