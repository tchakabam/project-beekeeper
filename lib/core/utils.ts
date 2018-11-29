export function parseOptionsFromQueryString (
    query: string = (window as any).location.search,
    validProperties: string[] = null): {[property: string]: string} {
    if (!query) {
      return {};
    }

    if (!query.startsWith('?')) {
      throw new Error('Malformed query string, should start with a `?`');
    }

    query = query.substr(1);
    const queryTokens = query.split(/&|=/);

    if (queryTokens.length % 2 !== 0) {
      throw new Error('Invalid query string in URL, uneven amount of tokens');
    }

    const options = {};

    let i = 0;
    while (i <= queryTokens.length) {
      if (validProperties) {
        let validPropsIndex = validProperties.indexOf(queryTokens[i]);
        if (validPropsIndex >= 0) {
          options[validProperties[validPropsIndex]] = queryTokens[i + 1];
        }
      } else if (queryTokens[i]) {
        options[queryTokens[i]] = queryTokens[i + 1];
      }
      i = i + 2;
    }

    return options;
  }
