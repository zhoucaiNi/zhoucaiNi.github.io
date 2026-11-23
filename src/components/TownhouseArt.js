import React from 'react';
import './TownhouseArt.css';

function TownhouseArt() {
  return (
    <div className="townhouse-art" aria-label="Simple townhouse illustration">
      <svg viewBox="0 0 760 430" role="img" aria-labelledby="townhouse-title">
        <title id="townhouse-title">A simple townhouse in a flat vector landscape</title>
        <rect width="760" height="430" fill="#f6c7b5" />
        <circle cx="620" cy="92" r="42" fill="#f8dfab" />
        <path d="M0 260 C120 210 210 225 320 270 C450 320 565 290 760 230 V430 H0Z" fill="#7caa70" />
        <path d="M0 320 C135 270 235 290 355 330 C490 375 615 330 760 285 V430 H0Z" fill="#4f805d" />
        <path d="M0 382 C170 350 270 370 390 395 C520 420 640 375 760 350 V430 H0Z" fill="#6a9a82" />
        <g className="townhouse-shape">
          <path d="M245 250 L380 145 L515 250 V354 H245Z" fill="#e9a37e" />
          <path d="M225 254 L380 125 L535 254 L518 270 L380 157 L242 270Z" fill="#7b5549" />
          <rect x="279" y="235" width="70" height="119" rx="2" fill="#f4d8bb" />
          <rect x="411" y="235" width="70" height="119" rx="2" fill="#f4d8bb" />
          <rect x="297" y="256" width="30" height="35" fill="#6d9da0" />
          <rect x="429" y="256" width="30" height="35" fill="#6d9da0" />
          <path d="M345 354 V316 Q380 281 415 316 V354Z" fill="#745247" />
          <rect x="365" y="326" width="30" height="28" fill="#a86f58" />
          <path d="M380 125 V96 H404 V145Z" fill="#7b5549" />
          <path d="M389 96 C418 82 430 92 444 100 C426 107 410 108 389 96Z" fill="#6b9b69" />
        </g>
        <g fill="#477052"><path d="M190 351 L218 278 L246 351Z" /><path d="M520 351 L548 274 L576 351Z" /></g>
        <path d="M245 354 H515" stroke="#395c4a" strokeWidth="8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default TownhouseArt;
