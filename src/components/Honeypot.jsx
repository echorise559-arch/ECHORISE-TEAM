// Hidden anti-spam field. People never see or fill it; many bots do.
// The server silently ignores any submission where it has a value.
export default function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        Leave this field empty
        <input type="text" name="hp" tabIndex={-1} autoComplete="off" value={value} onChange={e => onChange(e.target.value)} />
      </label>
    </div>
  )
}
