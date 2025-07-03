import sacredFontUrl from '../../../assets/fonts/sacred.ttf';

const loadSacredFont = async () => {
  const font = new FontFace('Sacred', `url(${sacredFontUrl})`, {
    style: 'normal',
    weight: '400',
  });
  await font.load();
  document.fonts.add(font);
};

export default loadSacredFont;
