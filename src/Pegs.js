import Config from './Config';

const EMPTY_PEGS = {
  code: {
    name: 'code-empty',
    image: `:${Config.IMAGE_PREFIX}-code-empty`,
    color: '#000000',
  },
  key: {
    name: 'key-empty',
    image: `:${Config.IMAGE_PREFIX}-key-empty`,
    color: '#000000',
    priority: 2,
  },
};

const CODE_PEGS = {
  W: {
    name: 'white',
    image: `:${Config.IMAGE_PREFIX}-white`,
    color: '#FFFFFF',
  },
  R: {
    name: 'red',
    image: `:${Config.IMAGE_PREFIX}-red`,
    color: '#FF0000',
  },
  B: {
    name: 'blue',
    image: `:${Config.IMAGE_PREFIX}-blue`,
    color: '#0000FF',
  },
  G: {
    name: 'green',
    image: `:${Config.IMAGE_PREFIX}-green`,
    color: '#008000',
  },
  V: {
    name: 'violet',
    image: `:${Config.IMAGE_PREFIX}-violet`,
    color: '#8000FF',
  },
  O: {
    name: 'orange',
    image: `:${Config.IMAGE_PREFIX}-orange`,
    color: '#FFA500',
  },
  Y: {
    name: 'yellow',
    image: `:${Config.IMAGE_PREFIX}-yellow`,
    color: '##fFFF00',
  },
  M: {
    name: 'maroon',
    image: `:${Config.IMAGE_PREFIX}-maroon`,
    color: '#8b4513',
  },
  P: {
    name: 'pink',
    image: `:${Config.IMAGE_PREFIX}-pink`,
    color: '##FF69B4',
  },
  C: {
    name: 'cyan',
    image: `:${Config.IMAGE_PREFIX}-cyan`,
    color: '##00ffff',
  },
  L: {
    name: 'lime',
    image: `:${Config.IMAGE_PREFIX}-lime`,
    color: '##00ff00',
  },
};

const KEY_PEGS = [
  {
    name: 'white',
    image: `:${Config.IMAGE_PREFIX}-key-white`,
    color: '#FFFFFF',
    priority: 1,
  },
  {
    name: 'red',
    image: `:${Config.IMAGE_PREFIX}-key-red`,
    color: '#FF0000',
    priority: 0,
  },
];

const PEG_LETTERS = Object.keys(CODE_PEGS);

const NB_PEGS = PEG_LETTERS.length;

export { EMPTY_PEGS, CODE_PEGS, KEY_PEGS, PEG_LETTERS, NB_PEGS };
