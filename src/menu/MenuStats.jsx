import React from "react"
import { useSelector, useDispatch } from 'react-redux'

const MenuStats = () => {
  const { stats } = useSelector(state => state.commandPanel);

  return <div className="menu__stats">
    <h1>{stats.name}</h1>
    <div className="menu__stats-container">
      {stats.stats.map(
        (stat, i) => <div key={i}>
          {stat.label}: {stat.valueLabel}
        </div>
      )}
    </div>
  </div>
}
export default MenuStats