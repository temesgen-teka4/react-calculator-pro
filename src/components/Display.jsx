import React from 'react'
import '../styles/Display.css'

const Display = ({ expression, setExpression }) => {
  return (
    <div className="display-container">
      <input
        className="display"
        value={expression}
        onChange={(e) => setExpression(e.target.value)} // ✅ editable
      />
    </div>
  )
}

export default Display
