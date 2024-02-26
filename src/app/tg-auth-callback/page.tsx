"use client";

import React from "react";

export default function page() {
  return <div onClick={()=>{
    window.open('/telegram-test')
  }}>page</div>;
}
