const base65Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.";
const base65Map = base65Chars.split('').reduce((acc, char, index) => {
  acc[char] = index;
  return acc;
}, {});

export const encodeBase65 = (input) => {
    let output = '';
    let i = 0;
    while (i < input.length) {
      let char1 = input.charCodeAt(i++) & 0xff;
      if (i == input.length) {
        output += base65Chars.charAt(char1 >> 2);
        output += base65Chars.charAt((char1 & 0x3) << 4);
        break;
      }
      let char2 = input.charCodeAt(i++);
      if (i == input.length) {
        output += base65Chars.charAt(char1 >> 2);
        output += base65Chars.charAt(((char1 & 0x3) << 4) | ((char2 & 0xf0) >> 4));
        output += base65Chars.charAt((char2 & 0xf) << 2);
        break;
      }
      let char3 = input.charCodeAt(i++);
      output += base65Chars.charAt(char1 >> 2);
      output += base65Chars.charAt(((char1 & 0x3) << 4) | ((char2 & 0xf0) >> 4));
      output += base65Chars.charAt(((char2 & 0xf) << 2) | ((char3 & 0xc0) >> 6));
      output += base65Chars.charAt(char3 & 0x3f);
    }
    return output;
  };
  
 export const decodeBase65 = (input) => {
    let output = '';
    let i = 0;
    while (i < input.length) {
      let char1 = base65Map[input.charAt(i++)];
      let char2 = base65Map[input.charAt(i++)];
      let char3 = base65Map[input.charAt(i++)];
      let char4 = base65Map[input.charAt(i++)];
      output += String.fromCharCode((char1 << 2) | (char2 >> 4));
      if (char3 != null) {
        output += String.fromCharCode(((char2 & 0xf) << 4) | (char3 >> 2));
        if (char4 != null) {
          output += String.fromCharCode(((char3 & 0x3) << 6) | char4);
        }
      }
    }
    return output;
  };