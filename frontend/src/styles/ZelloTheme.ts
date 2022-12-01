import { MAX_HEIGHT, MAX_WIDTH, SCALE } from '@utils/constants';

interface ColorsType {
    [key: string]: string;
}

export const colors: ColorsType = {
    primary: '#012CAE',
    primaryLight: '#5C81F0',
    primaryDark: '#102B7B',
    black: '#001D2E',
    blackT1: 'rgba(0,29,46,0.7)',
    white: '#F6F5F8',
    whiteT1: 'rgba(246,245,248,0.25)',
    whiteT2: 'rgba(246,245,248,0.6)',
    gray1: '#A8B2C2',
    gray2: '#626A77',
    sky: '#24B8F2',
    yellow: '#FDBF22',
    green: '#05B98F',
    red: '#FC5D4C',
    pink: '#FF65AB',
    purple: '#8073EC',
    brown: '#DC8D7C',
    rainbow:
        'linear-gradient(#FC5D4C 0%, #FDBF22 27.08%, #05B98F 52.6%, #24B8F2 73.96%, #8073EC 100%)',
};

export const ZelloTheme = {
    color: {
        primary: colors.primary,
        primaryLight: colors.primaryLight,
        primaryDark: colors.primaryDark,
        black: colors.black,
        blackT1: colors.blackT1,
        white: colors.white,
        whiteT1: colors.whiteT1,
        whiteT2: colors.whiteT2,
        gray1: colors.gray1,
        gray2: colors.gray2,
        sky: colors.sky,
        yellow: colors.yellow,
        green: colors.green,
        red: colors.red,
        pink: colors.pink,
        purple: colors.purple,
        brown: colors.brown,
    },

    gradation: {
        purplePrimary: `radial-gradient(97.4% 97.4% at 50% -15.44%, ${colors.purple} 0%, ${colors.primary} 100%)`,
        gray1Black: `radial-gradient(50% 50% at 50% 50%, ${colors.gray1} 39.58%, ${colors.black} 100%)`,
        yellowGreen: `linear-gradient(${colors.yellow}, ${colors.green})`,
        primaryLightBrown: `linear-gradient(${colors.primaryLight}, ${colors.brown})`,
        whitePurple: `linear-gradient(${colors.white} 44.8%, ${colors.purple} 100%)`,
        gray1Red: `linear-gradient(${colors.gray1}, ${colors.red})`,
        yellowPurple: `linear-gradient(${colors.yellow} -13.93%, ${colors.purple}) 100%`,
        rainbow: `linear-gradient(${colors.red}, ${colors.yellow}, ${colors.green}, ${colors.sky}, ${colors.purple})`,
    },

    typo: {
        h1: '2.75rem',
        h2: '2.25rem',
        h3: '1.875rem',
        h4: '1.5rem',
        h5: '1.25rem',
    },

    shadow: {
        card: '0px 6px 9px 2px rgba(0, 29, 46, 0.2)',
        icon: '0px 1px 3px 1px rgba(0, 29, 46, 0.5)',
        btn: '0px 1px 3px 1px rgba(0, 29, 46, 0.3)',
        text: '0px 1px 3px rgba(0, 29, 46, 0.5)',
    },

    layout: {
        maxWidth: `${MAX_WIDTH}px`,
        maxHeight: `${MAX_HEIGHT}px`,
        sectionScale: SCALE,
        sketchBook: `
          width: 742px;
          height: 468px;
          position: absolute;
          top: 60px;
          left: 18px;
          border-radius: 40px;
        `,
        gradientTypo: `
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        `,
    },
};
