// ==================== AES-128 Implementation ====================
class AES {
  constructor() {
    this.sBox = [
      // h = 104 , hexa = 0x68  = Row 6 |, Column 8--.
      0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
      0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
      0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26,
      0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
      0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
      0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
      0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed,
      0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
      0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
      0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
      0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec,
      0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
      0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
      0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
      0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d,
      0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
      0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
      0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
      0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11,
      0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
      0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
      0xb0, 0x54, 0xbb, 0x16,
    ];

    this.invSBox = [
      //0x45 = Row 4 |, Column 5--. = 0x68
      0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e,
      0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87,
      0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32,
      0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
      0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49,
      0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16,
      0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50,
      0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
      0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05,
      0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02,
      0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41,
      0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
      0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
      0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89,
      0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b,
      0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
      0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59,
      0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d,
      0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d,
      0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
      0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63,
      0x55, 0x21, 0x0c, 0x7d,
    ];

    this.rCon = [
      //rCon = Round Constant. fixed table of numbers used in the AES Key Expansion process
      0x01,
      0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36,
    ];
  }

  // Galois Field multiplication
  gmul(a, b) {
    let p = 0;
    for (let i = 0; i < 8; i++) {
      if (b & 1) p ^= a;
      const hi = a & 0x80;
      a <<= 1;
      if (hi) a ^= 0x1b; //Irreducible Polynomial.
      b >>= 1;
    }
    return p & 0xff;
  }

  // Key expansion
  keyExpansion(key) {
    const w = [];
    for (let i = 0; i < 4; i++) {
      w[i] = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
    }

    for (let i = 4; i < 44; i++) {
      let temp = w[i - 1].slice();
      if (i % 4 === 0) {
        temp = [
          this.sBox[temp[1]] ^ this.rCon[i / 4 - 1],
          this.sBox[temp[2]],
          this.sBox[temp[3]],
          this.sBox[temp[0]],
        ];
      }
      w[i] = [
        w[i - 4][0] ^ temp[0],
        w[i - 4][1] ^ temp[1],
        w[i - 4][2] ^ temp[2],
        w[i - 4][3] ^ temp[3],
      ];
    }
    return w;
  }

  // Add round key
  addRoundKey(state, roundKey) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        state[i][j] ^= roundKey[i][j];
      }
    }
  }

  // SubBytes
  subBytes(state) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        state[i][j] = this.sBox[state[i][j]];
      }
    }
  }

  // Inverse SubBytes
  invSubBytes(state) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        state[i][j] = this.invSBox[state[i][j]];
      }
    }
  }

  // ShiftRows
  shiftRows(state) {
    let temp = state[1][0];
    state[1][0] = state[1][1];
    state[1][1] = state[1][2];
    state[1][2] = state[1][3];
    state[1][3] = temp;

    temp = state[2][0];
    state[2][0] = state[2][2];
    state[2][2] = temp;
    temp = state[2][1];
    state[2][1] = state[2][3];
    state[2][3] = temp;

    temp = state[3][3];
    state[3][3] = state[3][2];
    state[3][2] = state[3][1];
    state[3][1] = state[3][0];
    state[3][0] = temp;
  }

  // Inverse ShiftRows
  invShiftRows(state) {
    let temp = state[1][3];
    state[1][3] = state[1][2];
    state[1][2] = state[1][1];
    state[1][1] = state[1][0];
    state[1][0] = temp;

    temp = state[2][0];
    state[2][0] = state[2][2];
    state[2][2] = temp;
    temp = state[2][1];
    state[2][1] = state[2][3];
    state[2][3] = temp;

    temp = state[3][0];
    state[3][0] = state[3][1];
    state[3][1] = state[3][2];
    state[3][2] = state[3][3];
    state[3][3] = temp;
  }

  // MixColumns
  mixColumns(state) {
    for (let i = 0; i < 4; i++) {
      const s0 = state[0][i];
      const s1 = state[1][i];
      const s2 = state[2][i];
      const s3 = state[3][i];

      state[0][i] = this.gmul(s0, 2) ^ this.gmul(s1, 3) ^ s2 ^ s3;
      state[1][i] = s0 ^ this.gmul(s1, 2) ^ this.gmul(s2, 3) ^ s3;
      state[2][i] = s0 ^ s1 ^ this.gmul(s2, 2) ^ this.gmul(s3, 3);
      state[3][i] = this.gmul(s0, 3) ^ s1 ^ s2 ^ this.gmul(s3, 2);
    }
  }

  // Inverse MixColumns
  invMixColumns(state) {
    for (let i = 0; i < 4; i++) {
      const s0 = state[0][i];
      const s1 = state[1][i];
      const s2 = state[2][i];
      const s3 = state[3][i];

      state[0][i] =
        this.gmul(s0, 14) ^
        this.gmul(s1, 11) ^
        this.gmul(s2, 13) ^
        this.gmul(s3, 9);
      state[1][i] =
        this.gmul(s0, 9) ^
        this.gmul(s1, 14) ^
        this.gmul(s2, 11) ^
        this.gmul(s3, 13);
      state[2][i] =
        this.gmul(s0, 13) ^
        this.gmul(s1, 9) ^
        this.gmul(s2, 14) ^
        this.gmul(s3, 11);
      state[3][i] =
        this.gmul(s0, 11) ^
        this.gmul(s1, 13) ^
        this.gmul(s2, 9) ^
        this.gmul(s3, 14);
    }
  }

  // Encrypt a single 16-byte block
  encryptBlock(block, key) {
    //block>> [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]
    const state = [
      [block[0], block[4], block[8], block[12]],
      [block[1], block[5], block[9], block[13]],
      [block[2], block[6], block[10], block[14]],
      [block[3], block[7], block[11], block[15]],
    ];

    const w = this.keyExpansion(key);

    // Initial round
    const roundKey0 = [
      [w[0][0], w[1][0], w[2][0], w[3][0]],
      [w[0][1], w[1][1], w[2][1], w[3][1]],
      [w[0][2], w[1][2], w[2][2], w[3][2]],
      [w[0][3], w[1][3], w[2][3], w[3][3]],
    ];
    this.addRoundKey(state, roundKey0);

    // Main rounds
    for (let round = 1; round < 10; round++) {
      this.subBytes(state); // change in subbites
      this.shiftRows(state); //shift rows
      this.mixColumns(state); //predefine matrix (gmul) ^ state array

      const roundKey = [
        //add my key it adds 4 words in total there is 44 in 10 round
        [
          w[round * 4][0],
          w[round * 4 + 1][0],
          w[round * 4 + 2][0],
          w[round * 4 + 3][0],
        ],
        [
          w[round * 4][1],
          w[round * 4 + 1][1],
          w[round * 4 + 2][1],
          w[round * 4 + 3][1],
        ],
        [
          w[round * 4][2],
          w[round * 4 + 1][2],
          w[round * 4 + 2][2],
          w[round * 4 + 3][2],
        ],
        [
          w[round * 4][3],
          w[round * 4 + 1][3],
          w[round * 4 + 2][3],
          w[round * 4 + 3][3],
        ],
      ];
      this.addRoundKey(state, roundKey);
    }

    // Final round
    this.subBytes(state);
    this.shiftRows(state);
    const finalKey = [
      [w[40][0], w[41][0], w[42][0], w[43][0]],
      [w[40][1], w[41][1], w[42][1], w[43][1]],
      [w[40][2], w[41][2], w[42][2], w[43][2]],
      [w[40][3], w[41][3], w[42][3], w[43][3]],
    ];
    this.addRoundKey(state, finalKey); //key and state matrix xor (^)
    //no mix colum
    return [
      state[0][0],
      state[1][0],
      state[2][0],
      state[3][0],
      state[0][1],
      state[1][1],
      state[2][1],
      state[3][1],
      state[0][2],
      state[1][2],
      state[2][2],
      state[3][2],
      state[0][3],
      state[1][3],
      state[2][3],
      state[3][3],
    ];
  }

  // Decrypt a single 16-byte block
  decryptBlock(block, key) {
    const state = [
      [block[0], block[4], block[8], block[12]],
      [block[1], block[5], block[9], block[13]],
      [block[2], block[6], block[10], block[14]],
      [block[3], block[7], block[11], block[15]],
    ];

    const w = this.keyExpansion(key);

    // Initial round
    const finalKey = [
      [w[40][0], w[41][0], w[42][0], w[43][0]],
      [w[40][1], w[41][1], w[42][1], w[43][1]],
      [w[40][2], w[41][2], w[42][2], w[43][2]],
      [w[40][3], w[41][3], w[42][3], w[43][3]],
    ];
    this.addRoundKey(state, finalKey);

    // Main rounds in reverse
    for (let round = 9; round >= 1; round--) {
      this.invShiftRows(state);
      this.invSubBytes(state);

      const roundKey = [
        [
          w[round * 4][0],
          w[round * 4 + 1][0],
          w[round * 4 + 2][0],
          w[round * 4 + 3][0],
        ],
        [
          w[round * 4][1],
          w[round * 4 + 1][1],
          w[round * 4 + 2][1],
          w[round * 4 + 3][1],
        ],
        [
          w[round * 4][2],
          w[round * 4 + 1][2],
          w[round * 4 + 2][2],
          w[round * 4 + 3][2],
        ],
        [
          w[round * 4][3],
          w[round * 4 + 1][3],
          w[round * 4 + 2][3],
          w[round * 4 + 3][3],
        ],
      ];
      this.addRoundKey(state, roundKey);
      this.invMixColumns(state);
    }

    // Final round
    this.invShiftRows(state);
    this.invSubBytes(state);
    const roundKey0 = [
      [w[0][0], w[1][0], w[2][0], w[3][0]],
      [w[0][1], w[1][1], w[2][1], w[3][1]],
      [w[0][2], w[1][2], w[2][2], w[3][2]],
      [w[0][3], w[1][3], w[2][3], w[3][3]],
    ];
    this.addRoundKey(state, roundKey0);

    return [
      state[0][0],
      state[1][0],
      state[2][0],
      state[3][0],
      state[0][1],
      state[1][1],
      state[2][1],
      state[3][1],
      state[0][2],
      state[1][2],
      state[2][2],
      state[3][2],
      state[0][3],
      state[1][3],
      state[2][3],
      state[3][3],
    ];
  }

  // Encrypt message with PKCS7 padding
  encrypt(message, key) {
    // step 1
    const messageBytes = Buffer.from(message, "utf8"); /// "hello" becomes [0x68, 0x65, 0x6c, 0x6c, 0x6f].  each word changes into hex actual output ==> <Buffer 68 65 6c 6c 6f>
    const paddingLength = 16 - (messageBytes.length % 16); // for making non negative
    const paddedMessage = Buffer.concat([
      messageBytes,
      Buffer.alloc(paddingLength, paddingLength),
    ]); //PKCS#7 ppadding .. we can give only one which add only 00 by giving 2nd arg as the lenghth it will add same number of padding like hello remain 11 it add 0b which is 11
    // we add //PKCS#7 because it add padding any way if bolck is full it adds .. if not it adds . because 1 can create a problem . a 15 char and a 0x1 at end is same as 16 car word with last char is 0x1 so we add padding any how . so if there is perfect 16 block it create an extra block with all 0x16 padding

    const encrypted = [];
    for (let i = 0; i < paddedMessage.length; i += 16) {
      // it first encode 1 block then another then combile all block
      const block = Array.from(paddedMessage.slice(i, i + 16)); // it slices 0 to 15 then in another loop it slices 16 to 31
      const encryptedBlock = this.encryptBlock(block, key); //this is where encryption happens. .... block>> [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]
      encrypted.push(...encryptedBlock); //hex =>its in array
    }

    return Buffer.from(encrypted); //Buffer.from simply wraps those numbers into a Buffer object.
  } //return buffer object

  // Decrypt message and remove PKCS7 padding
  decrypt(ciphertext, key) {
    const decrypted = [];
    for (let i = 0; i < ciphertext.length; i += 16) {
      const block = Array.from(ciphertext.slice(i, i + 16));
      const decryptedBlock = this.decryptBlock(block, key);
      decrypted.push(...decryptedBlock);
    }

    const paddingLength = decrypted[decrypted.length - 1];
    const unpadded = decrypted.slice(0, -paddingLength);
    return Buffer.from(unpadded).toString("utf8");
  }
}

// ==================== RSA Implementation ====================
class RSA {
  // Miller-Rabin primality test
  isPrime(n, k = 5) {
    if (n === 2n || n === 3n) return true;
    if (n < 2n || n % 2n === 0n) return false;

    let r = 0n;
    let d = n - 1n;
    while (d % 2n === 0n) {
      r++;
      d /= 2n;
    }

    for (let i = 0; i < k; i++) {
      const a = this.randomBigInt(2n, n - 2n);
      let x = this.modPow(a, d, n);

      if (x === 1n || x === n - 1n) continue;

      let continueOuter = false;
      for (let j = 0n; j < r - 1n; j++) {
        x = this.modPow(x, 2n, n);
        if (x === n - 1n) {
          continueOuter = true;
          break;
        }
      }
      if (continueOuter) continue;
      return false;
    }
    return true;
  }

  // Generate random BigInt
  randomBigInt(min, max) {
    const range = max - min;
    const bits = range.toString(2).length;
    let result;
    do {
      result = 0n;
      for (let i = 0; i < bits; i++) {
        result = (result << 1n) | BigInt(Math.random() < 0.5 ? 0 : 1);
      }
      result = min + (result % range);
    } while (result < min || result >= max);
    return result;
  }

  // Generate random prime
  generatePrime(bits) {
    let prime;
    do {
      prime = this.randomBigInt(2n ** BigInt(bits - 1), 2n ** BigInt(bits));
      if (prime % 2n === 0n) prime++;
    } while (!this.isPrime(prime));
    return prime;
  }

  // Modular exponentiation
  modPow(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        result = (result * base) % mod;
      }
      exp = exp / 2n;
      base = (base * base) % mod;
    }
    return result;
  }

  // Extended Euclidean Algorithm
  extendedGCD(a, b) {
    if (b === 0n) return { gcd: a, x: 1n, y: 0n };
    const { gcd, x, y } = this.extendedGCD(b, a % b);
    return { gcd, x: y, y: x - (a / b) * y };
  }

  // Modular inverse
  modInverse(a, m) {
    const { gcd, x } = this.extendedGCD(a, m);
    if (gcd !== 1n) return null;
    return ((x % m) + m) % m;
  }

  // Generate RSA key pair
  generateKeyPair(bits = 512) {
    const p = this.generatePrime(bits / 2);
    const q = this.generatePrime(bits / 2);
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    const e = 65537n;
    const d = this.modInverse(e, phi);

    return {
      publicKey: { e, n },
      privateKey: { d, n },
    };
  }

  // Encrypt with public key
  encrypt(message, publicKey) {
    const { e, n } = publicKey;
    const messageInt = BigInt("0x" + message.toString("hex"));
    const encrypted = this.modPow(messageInt, e, n);
    return encrypted;
  }

  // Decrypt with private key
  decrypt(ciphertext, privateKey) {
    const { d, n } = privateKey;
    const decrypted = this.modPow(ciphertext, d, n);
    let hex = decrypted.toString(16);
    if (hex.length % 2) hex = "0" + hex;
    return Buffer.from(hex, "hex");
  }
}

// ==================== Hybrid Encryption System ====================
class HybridCrypto {
  constructor() {
    this.aes = new AES();
    this.rsa = new RSA();
  }

  // Generate random AES key
  generateAESKey() {
    const key = [];
    for (let i = 0; i < 16; i++) {
      key.push(Math.floor(Math.random() * 256)); //we cannot give char directly if we want  we need to convert to decimal valu beforing feeding it..
    }
    return key;
  }

  // Encrypt message using hybrid approach
  encrypt(message, rsaPublicKey) {
    // 1. Generate random AES key
    const aesKey = this.generateAESKey();

    // 2. Encrypt message with AES
    const encryptedMessage = this.aes.encrypt(message, aesKey);

    // 3. Encrypt AES key with RSA
    const encryptedKey = this.rsa.encrypt(Buffer.from(aesKey), rsaPublicKey);

    return {
      encryptedMessage: encryptedMessage.toString("base64"),
      encryptedKey: encryptedKey.toString(),
      algorithm: "AES-128 + RSA-512",
    };
  }

  // Decrypt message using hybrid approach
  decrypt(encryptedData, rsaPrivateKey) {
    // 1. Decrypt AES key with RSA
    const encryptedKey = BigInt(encryptedData.encryptedKey);
    const aesKeyBuffer = this.rsa.decrypt(encryptedKey, rsaPrivateKey);
    const aesKey = Array.from(aesKeyBuffer);

    // 2. Decrypt message with AES
    const encryptedMessage = Buffer.from(
      encryptedData.encryptedMessage,
      "base64",
    );
    const decryptedMessage = this.aes.decrypt(encryptedMessage, aesKey);

    return decryptedMessage;
  }
}

// ==================== Main Program ====================

const crypto = new HybridCrypto();

// Generate RSA key pair
console.log("\n[1] Generating RSA key pair (512-bit)...");
const { publicKey, privateKey } = crypto.rsa.generateKeyPair(512);
console.log("✓ RSA keys generated successfully");
console.log(
  `   Public Key (e, n): (${publicKey.e}, ${publicKey.n.toString().slice(0, 30)}...)`,
);
console.log(
  `   Private Key (d, n): (${privateKey.d.toString().slice(0, 30)}..., ${privateKey.n.toString().slice(0, 30)}...)`,
);

// Message to encrypt
const message =
  "Hello! This is a secret message for my bachelor project. AES and RSA working together!";
console.log(`\n[2] Original Message:\n   "${message}"`);

// Encrypt
console.log("\n[3] Encrypting...");
const encrypted = crypto.encrypt(message, publicKey);
console.log("✓ Encryption complete");
console.log(`   Algorithm: ${encrypted.algorithm}`);
console.log(
  `   Encrypted AES Key (RSA): ${encrypted.encryptedKey.slice(0, 50)}...`,
);
console.log(
  `   Encrypted Message (AES): ${encrypted.encryptedMessage.slice(0, 50)}...`,
);

// Decrypt
console.log("\n[4] Decrypting...");
const decrypted = crypto.decrypt(encrypted, privateKey);
console.log("✓ Decryption complete");
console.log(`   Decrypted Message:\n   "${decrypted}"`);

// Verify
console.log("\n[5] Verification:");
if (message === decrypted) {
  console.log("   ✓ SUCCESS! Original and decrypted messages match!");
} else {
  console.log("   ✗ FAILED! Messages do not match!");
}

console.log("\n" + "=".repeat(60));
console.log("TECHNICAL DETAILS:");
console.log("=".repeat(60));
console.log("• AES-128 Implementation:");
console.log("  - Block size: 128 bits (16 bytes)");
console.log("  - Key size: 128 bits (16 bytes)");
console.log("  - Rounds: 10");
console.log("  - Mode: ECB with PKCS7 padding");
console.log("\n• RSA Implementation:");
console.log("  - Key size: 512 bits (for demo, use 2048+ in production)");
console.log("  - Public exponent: 65537");
console.log("  - Prime generation: Miller-Rabin test");
console.log("\n• Hybrid Approach:");
console.log("  1. Generate random AES key");
console.log("  2. Encrypt message with AES (fast, symmetric)");
console.log("  3. Encrypt AES key with RSA (secure key exchange)");
console.log("  4. Send both encrypted message and encrypted key");
console.log("  5. Receiver decrypts AES key with RSA private key");
console.log("  6. Receiver decrypts message with AES key");
console.log("=".repeat(60));

// Export classes for use in other files
export { AES, RSA, HybridCrypto };
