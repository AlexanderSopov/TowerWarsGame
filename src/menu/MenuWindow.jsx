import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { refreshState } from "../store/mousePointer/Slice"

const MenuWindow = () => {
  const selected = useSelector(state => state.mousePointer.selected);
  const dispatch = useDispatch()
  const refresh = () => {
    dispatch(refreshState())
  }

  const title = () => <h1 style={{cursor: 'pointer', padding: '20px'}} onClick={refresh}>
    {selected ? selected.id : 'Standard'}
  </h1>

  return <div className='menu__window'>{title()}</div>
}
export default MenuWindow