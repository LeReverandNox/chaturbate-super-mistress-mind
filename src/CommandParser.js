class CommandParser {
  _sanitize(str) {
    return str.trim()
      .replace(/\s+/g, ' ')
      .replace(/\t+/g, ' ');
  }

  parse(str, looksForQuotes = true) {
    str = this._sanitize(str);
    let args = [];
    let readingPart = false;
    let part = '';
    for(let i = CMD_PREFIX.length; i < str.length; i += 1) {
      if (str.charAt(i) === ' ' && !readingPart) {
        if (part !== '')
          args.push(part);
        part = '';
      } else {
        if (str.charAt(i) === '\"' && looksForQuotes) {
          readingPart = !readingPart;
        } else {
          part += str.charAt(i);
        }
      }
    }
    args.push(part);

    return args;
  }
}
