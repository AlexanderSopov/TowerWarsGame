import React from "react"
import { useSelector, useDispatch } from 'react-redux'

const MenuOptions = () => {
  const { options } = useSelector(state => state.commandPanel);
  return <div className="menu__options">
  { (new Array(12)).fill().map(
    (_, i) => options[i]
  ).map((opt, i) => <div key={i} title={opt && `${opt.description} Price: ${opt.cost}`}>
      { opt && <img
        src={opt.icon}
        style={{
          width: "100%",
          height: "100%",
          objectFit: 'cover'
        }}
      /> }
    </div>
  )}
  </div>
}

export default MenuOptions