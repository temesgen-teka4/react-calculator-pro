import React, { useState, useEffect } from 'react'
import { evaluate } from 'mathjs'
import axios from 'axios'
import Display from './Display'
import Button from './Button'
import History from './History'
import '../styles/Calculator.css'

const Calculator = () => {
  const [expression, setExpression] = useState("")
  const [history, setHistory] = useState([])
  const [theme, setTheme] = useState("dark")
  const [mode, setMode] = useState("basic") // basic, scientific, currency

  // Currency conversion function
  const convertCurrency = async (amount, from, to) => {
    try {
      const res = await axios.get(
        `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
      )
      if (res.data && res.data.result !== undefined) {
        return res.data.result
      } else {
        return "Conversion Error"
      }
    } catch (err) {
      console.error(err)
      return "Error"
    }
  }

  const handleNumberClick = (value) => setExpression((prev) => prev + value)
  const handleOperatorClick = (op) => setExpression((prev) => prev + op)

  const handleEqual = async () => {
    try {
      // Currency parsing
      if (expression.includes("USD→EUR")) {
        const amount = parseFloat(expression.split(" ")[0])
        const result = await convertCurrency(amount, "USD", "EUR")
        setHistory(prev => [...prev, `${amount} USD = ${result} EUR`])
        setExpression(result.toString())
        return
      }
      if (expression.includes("EUR→USD")) {
        const amount = parseFloat(expression.split(" ")[0])
        const result = await convertCurrency(amount, "EUR", "USD")
        setHistory(prev => [...prev, `${amount} EUR = ${result} USD`])
        setExpression(result.toString())
        return
      }
      if (expression.includes("USD→ETB")) {
        const amount = parseFloat(expression.split(" ")[0])
        const result = await convertCurrency(amount, "USD", "ETB")
        setHistory(prev => [...prev, `${amount} USD = ${result} ETB`])
        setExpression(result.toString())
        return
      }

      // Normal math evaluation
      const result = evaluate(expression.replace(/x/g, "*"))
      setHistory(prev => [...prev, `${expression} = ${result}`])
      setExpression(result.toString())
    } catch {
      setExpression("Error")
    }
  }

  const handleClear = () => setExpression("")

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"))
  const toggleBasic = () => setMode("basic")
  const toggleScientific = () => setMode("scientific")
  const toggleCurrency = () => setMode("currency")

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event
      if (!isNaN(key) || key === ".") setExpression((prev) => prev + key)
      else if (["+", "-", "*", "/", "%"].includes(key)) setExpression((prev) => prev + key)
      else if (key === "Enter") handleEqual()
      else if (key.toLowerCase() === "c") handleClear()
      else if (key.toLowerCase() === "s") toggleScientific()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [expression])

  return (
    <div className={`calculator ${theme}-theme`}>
      <div className="top-bar">
        <button className="theme-toggle" onClick={toggleTheme}>☀️/🌙</button>
        <button className="mode-toggle" onClick={toggleBasic} title="Basic Mode">∑</button>
        <button className="mode-toggle" onClick={toggleScientific} title="Scientific Mode">√</button>
        <button className="mode-toggle" onClick={toggleCurrency} title="Currency Mode">💱</button>
      </div>

      <Display expression={expression} setExpression={setExpression} />
      <History history={history} />

      {/* Basic buttons */}
      {mode === "basic" && (
        <div className="buttons">
          <Button label="C" onClick={handleClear} />
          <Button label="/" onClick={() => handleOperatorClick("/")} />
          <Button label="x" onClick={() => handleOperatorClick("x")} />
          <Button label="⬅️" onClick={() => setExpression(expression.slice(0, -1))} />

          <Button label="7" onClick={() => handleNumberClick("7")} />
          <Button label="8" onClick={() => handleNumberClick("8")} />
          <Button label="9" onClick={() => handleNumberClick("9")} />
          <Button label="-" onClick={() => handleOperatorClick("-")} />

          <Button label="4" onClick={() => handleNumberClick("4")} />
          <Button label="5" onClick={() => handleNumberClick("5")} />
          <Button label="6" onClick={() => handleNumberClick("6")} />
          <Button label="+" onClick={() => handleOperatorClick("+")} />

          <Button label="1" onClick={() => handleNumberClick("1")} />
          <Button label="2" onClick={() => handleNumberClick("2")} />
          <Button label="3" onClick={() => handleNumberClick("3")} />
          <Button label="=" onClick={handleEqual} className="equal" />

          <Button label="%" onClick={() => handleOperatorClick("%")} />
          <Button label="0" onClick={() => handleNumberClick("0")} />
          <Button label="." onClick={() => handleNumberClick(".")} />
        </div>
      )}

      {/* Scientific buttons */}
      {mode === "scientific" && (
        <div className="scientific-buttons">
          <Button label="(" onClick={() => handleOperatorClick("(")} />
          <Button label=")" onClick={() => handleOperatorClick(")")} />
          <Button label="xʸ" onClick={() => handleOperatorClick("^")} />
          <Button label="√" onClick={() => handleOperatorClick("sqrt(")} />
          <Button label="x²" onClick={() => handleOperatorClick("^2")} />
          <Button label="x⁻¹" onClick={() => handleOperatorClick("^-1")} />
          <Button label="x!" onClick={() => handleOperatorClick("!")} />
          <Button label="sin" onClick={() => handleOperatorClick("sin(")} />
          <Button label="cos" onClick={() => handleOperatorClick("cos(")} />
          <Button label="tan" onClick={() => handleOperatorClick("tan(")} />
          <Button label="log" onClick={() => handleOperatorClick("log(")} />
          <Button label="ln" onClick={() => handleOperatorClick("ln(")} />
          <Button label="π" onClick={() => handleOperatorClick("pi")} />
          <Button label="e" onClick={() => handleOperatorClick("e")} />
          <Button label="deg" onClick={() => handleOperatorClick(" deg")} />
        </div>
      )}

      {/* Currency buttons */}
      {mode === "currency" && (
        <div className="currency-buttons">
          <Button label="USD→EUR" onClick={async () => {
            const result = await convertCurrency(1, "USD", "EUR")
            setHistory(prev => [...prev, `1 USD = ${result} EUR`])
            setExpression(result.toString())
          }} />
          <Button label="EUR→USD" onClick={async () => {
            const result = await convertCurrency(1, "EUR", "USD")
            setHistory(prev => [...prev, `1 EUR = ${result} USD`])
            setExpression(result.toString())
          }} />
          <Button label="USD→ETB" onClick={async () => {
            const result = await convertCurrency(1, "USD", "ETB")
            setHistory(prev => [...prev, `1 USD = ${result} ETB`])
            setExpression(result.toString())
          }} />
        </div>
      )}
    </div>
  )
}

export default Calculator
