import React from "react";
import { mediumArr } from './contants';
import './index.css';

const Footer = ({className}: {className?: string}) => {

  return <div className={className || 'medium'}>
  {/* eslint-disable-next-line @next/next/no-img-element */}
  {mediumArr.map(item => <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer"><img src={item.icon} alt={item.title} /></a>)}
</div>
}

export default Footer