import { Coords } from './types';

// 25333,126 = 0,0
// 170,12679 = 0,6400
// 50706,12806 = 6400,0
// 25608,25344 = 6400,6400

// coefficients calculated by interpolating points to polynomial function in 3d space
const X_A = 15016550749040/122325855716559;
const X_B = 938534421815/3783273888141;
const X_C = 5260160/122325855716559;
const X_D = 3986215/22699643328846;
const X_E = -121210023410560/38214887759;

const Y_A = -15573597270896/122325855716559;
const Y_B = 937394558519/3783273888141;
const Y_C = 5616256/122325855716559;
const Y_D = 4256069/22699643328846;
const Y_E = 123438209497984/38214887759;

const translateMapCoordsToGameCoords = ({ x, y }: Coords): Coords => {
  // ax + by + cx^2 + dy^2 + e
  const gameX = X_A * x + X_B * y + X_C * x * x + X_D * y * y + X_E;
  const gameY = Y_A * x + Y_B * y + Y_C * x * x + Y_D * y * y + Y_E;

  return {
    x: Math.round(gameX),
    y: Math.round(gameY),
  }
};

export default translateMapCoordsToGameCoords;
