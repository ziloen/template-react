import { useState } from 'react'

export function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial)

  return (
    <div>
      <div>
        <span>count: </span>
        {count}
      </div>

      <button className="btn" onClick={() => setCount(count + 1)}>
        +
      </button>
      <button className="btn" onClick={() => setCount(count - 1)}>
        -
      </button>
    </div>
  )
}
