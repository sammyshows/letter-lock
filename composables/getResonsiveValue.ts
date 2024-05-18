export const getResponsiveValue = (variableName) => {
  const values = {
    topPadding1: {
      'xs': 'pt-3',
      '': 'pt-8',
      'sm': 'pt-8',
      'md': 'pt-8',
      'lg': 'pt-8'
    },
    topPadding2: {
      'xs': 'pt-3',
      '': 'pt-12',
      'sm': 'pt-12',
      'md': 'pt-12',
      'lg': 'pt-12'
    },
    lockBoltHeight: {
      '': '0.60rem',
      'sm': '0.60rem',
      'md': '0.96rem',
      'lg': '1.536rem'
    },
    lockBoltColor1: {
      'xs': 'rgb(42,101,229)',
      '': 'rgb(31,99,227)',
      'sm': 'rgb(31,99,227)',
      'md': 'rgb(31,99,227)',
      'lg': 'rgb(39, 97, 227)'
    },
    lockBoltColor2: {
      '': 'rgb(50, 120, 239)',
      'sm': 'rgb(50, 120, 239)',
      'md': 'rgb(50, 120, 239)',
      'lg': 'rgb(52, 120, 240)'
    },
    gridGap1: {
      'xs': 'gap-1.5',
      '': 'gap-2',
      'sm': 'gap-2',
      'md': 'gap-3',
      'lg': 'gap-4'
    },
    gridGap2: { // just the number because it's dynamically changed when set based on gridSize
      'xs': 4,
      '': 5,
      'sm': 6,
      'md': 7,
      'lg': 8
    },
    gridGap3: {
      '': 'gap-1',
      'sm': 'gap-2',
      'md': 'gap-2',
      'lg': 'gap-2'
    }
  };

  const currentScreenWidth = window.innerWidth;
  const currentScreenHeight = window.innerHeight;
  const pixelRatio = window.devicePixelRatio;
  let screen = '';
  let extraSmallOptions = ['gridGap1', 'gridGap2', 'topPadding1', 'topPadding2']

  if (currentScreenWidth >= 1536) screen = '2xl';
  else if (currentScreenWidth >= 1280) screen = 'xl';
  else if (currentScreenWidth >= 1024) screen = 'lg';
  else if (currentScreenWidth >= 768) screen = 'md';
  else if (currentScreenWidth >= 640) screen = 'sm';
  else if (extraSmallOptions.includes(variableName) && currentScreenWidth < 320) screen = 'xs';
  if (extraSmallOptions.includes(variableName) && pixelRatio === 2 && currentScreenWidth < 380 && currentScreenHeight < 700) screen = 'xs'; // special case for iPhone SE, iPhone 8, iPhone 7, iPhone 6s, iPhone 6 etc.

  return values[variableName][screen];
}