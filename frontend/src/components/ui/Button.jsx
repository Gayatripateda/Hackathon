export function Button({
  children,
  className = "",
  size = "medium",
  variant = "secondary",
  ...props
}) {
  return (
    <button
      className={`button button-${variant} button-${size} ${className}`.trim()}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
