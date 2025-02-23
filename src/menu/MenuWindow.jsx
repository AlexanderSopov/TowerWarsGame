import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { WORLD_WIDTH, WORLD_HEIGHT  } from '../tile-system';

const MenuWindow = () => {
  const { portrait } = useSelector(state => state.commandPanel);
  const world = useSelector(state => state.world );
  const dispatch = useDispatch()
  const refresh = () => {
    dispatch(refreshState())
  }
  
  const COLORS = {
    empty: "beige",
    obstacle: "black",
    building: "red",
  }

  const image = () => portrait.image && <img src={portrait.image} className="menu__window-image" />
  const stats = stat => stat && `${stat.current} / ${stat.max}`
  const portray = () => <>
    {image()}
    <div className="menu__window-stats menu__window-health">{stats(portrait.health)}</div>
    <div className="menu__window-stats menu__window-mana">{stats(portrait.mana)}</div>
  </>

  const worldMap = () => <div className="menu__world-map-container" style={{
    "--tile-width-pct": (100 / WORLD_WIDTH) + "%",
    "--tile-height-pct": (100 / WORLD_HEIGHT) + "%",
  }}>
    {
      world && world.map(
        (row, i) => row.map(
          (cell, j) => <div key={`${i}-${j}`} style={{ backgroundColor: COLORS[cell.type] }}></div>
        )
      )
    }
  </div>
  return <div className='menu__window'>
    { portrait && portrait.image ? portray() : worldMap() }
  </div>
}
export default MenuWindow