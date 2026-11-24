export function Card({
  actions,
  children,
  className = "",
  description,
  title,
}) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || description || actions) && (
        <header className="card-header">
          <div>
            {title && <h2 className="card-title">{title}</h2>}
            {description && <p className="card-description">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
