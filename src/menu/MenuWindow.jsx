import React from 'react';
import { useSelector, useDispatch } from 'react-redux'

const MenuWindow = () => {
  const { portrait } = useSelector(state => state.commandPanel);
  const dispatch = useDispatch()
  const refresh = () => {
    dispatch(refreshState())
  }
  
  const image = () => portrait.image && <img src={portrait.image} className="menu__window-image" />
  const stats = stat => stat && `${stat.current} / ${stat.max}`
  return <div className='menu__window'>
    {image()}
    <div className="menu__window-stats menu__window-health">{stats(portrait.health)}</div>
    <div className="menu__window-stats menu__window-mana">{stats(portrait.mana)}</div>
  </div>
  // return <div className='menu__window'>{title()}</div>
}
export default MenuWindow