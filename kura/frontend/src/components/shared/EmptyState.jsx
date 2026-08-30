export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 24px' }}>
      {Icon && (
        <div style={{
          width: 40, height: 40, borderRadius: 4, background: 'var(--color-surface-sunken)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          color: 'var(--color-text-muted)',
        }}>
          <Icon size={19} strokeWidth={1.6} />
        </div>
      )}
      <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 4 }}>{title}</div>
      {description && <div className="text-muted" style={{ fontSize: 13, maxWidth: 340, margin: '0 auto' }}>{description}</div>}
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  )
}
