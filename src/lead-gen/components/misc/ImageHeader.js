import React from 'react';

export const ImageHeader = ({ title, image }) => (
  <div className="image-header">
    <img src={image} />
    <h2>{title}</h2>
  </div>
);
