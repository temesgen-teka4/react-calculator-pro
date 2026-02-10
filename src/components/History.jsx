import React from 'react'
import '../styles/History.css'

const History = ({ history }) => {
  return (
    <div className="history-container">
      <h3>History</h3>
      <div className="history-list">
        {history.slice(-5).map((item, index) => (
          <div key={index} className="history-item">{item}</div>
        ))}
      </div>
    </div>
  )
}

export default History
