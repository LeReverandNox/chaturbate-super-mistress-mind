import Config from './Config';

export default class CommandParser {
  _sanitize(str) {
    return str
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\t+/g, ' ');
  }

  parse(str, looksForQuotes = true) {
    const cleanStr = this._sanitize(str);
    const args = [];
    let readingPart = false;
    let part = '';

    for (let i = Config.CMD_PREFIX.length; i < cleanStr.length; i += 1) {
      if (cleanStr.charAt(i) === ' ' && !readingPart) {
        if (part !== '') args.push(part.trim());
        part = '';
      } else if (cleanStr.charAt(i) === '"' && looksForQuotes) {
        readingPart = !readingPart;
      } else {
        part += cleanStr.charAt(i);
      }
    }

    args.push(part.trim());

    return args;
  }
}
