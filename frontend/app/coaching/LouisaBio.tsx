import React, { useState } from 'react';

interface LouisaBioProps {
  bio: string;
}

const SHORT_BIO = '';

export default function LouisaBio({ bio }: LouisaBioProps) {
  return (
    <div style={{marginTop:'1.2rem',fontSize:'1rem',color:'#3b2e5a',whiteSpace:'pre-line'}}>
      {bio}
    </div>
  );
}
