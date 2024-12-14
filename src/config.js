

export const data = {
    3: "eth-C871",
    4: "eth-bCb9",
    5: "eth-14AD",
    6: "eth-9f02",
    7: "eth-f9e7",
    8: "eth-8257",
    9: "eth-7084",
    10: "eth-702f",
    11: "eth-891b",
    12: "eth-a48e",
    13: "eth-f0C8",
    14: "eth-E696",
    15: "eth-cCDC",
    16: "eth-B9C6",
    17: "eth-1f0A",
    18: "eth-8dC7",
    19: "eth-4d64",
    20: "eth-32BE",
    21: "eth-FAf4",
    22: "eth-76DA",
    23: "eth-Ef65",
    24: "eth-451d",
    25: "eth-5fF4",
    26: "eth-5D48",
    27: "eth-3573",
    28: "eth-F994",
    29: "eth-661A",
    30: "eth-942b",
    31: "eth-1eD0",
    32: "eth-9955",
    33: "eth-0dd3",
    34: "eth-dcBe",
    35: "eth-a1Eb",
    36: "eth-1556",
    37: "eth-6dFb",
    38: "eth-7663",
    39: "eth-87Eb",
    40: "eth-21D7",
    41: "eth-CAA9",
    42: "eth-438b",
    43: "eth-e4F0",
    44: "eth-AeF5",
    45: "eth-4706",
    46: "eth-2bc2",
    47: "eth-49Fb",
    48: "eth-1fBb",
    49: "eth-68De",
    50: "eth-91a7",
    51: "eth-D029",
    52: "eth-Ca9F",
    53: "eth-C32E",
    54: "eth-58e0",
    55: "eth-ADdb",
    56: "eth-4b75",
    57: "eth-edC5",
    58: "eth-83A8",
    59: "eth-639b",
    60: "eth-0BF5",
    61: "eth-D196",
    62: "eth-de62",
    63: "eth-b561",
    64: "eth-F383",
    65: "eth-eFbC",
    66: "eth-A2BE",
    67: "eth-C84c",
    68: "eth-7225",
    69: "eth-4233",
    70: "eth-Ff96",
    71: "eth-203A",
    72: "eth-7550",
    73: "eth-4012",
    74: "eth-3bbF",
    75: "eth-3eCE",
    76: "eth-cF1b",
    77: "eth-bb3F",
    78: "eth-0d15",
    79: "eth-a178",
    80: "eth-b0d4",
    81: "eth-f549",
    82: "eth-827c",
    83: "eth-c3B8",
    84: "eth-8cf7",
    85: "eth-B6eC",
    86: "eth-9D68",
    87: "eth-1d70",
    88: "eth-29F5",
    89: "eth-3319",
    90: "eth-882B",
    91: "eth-c3B5",
    92: "eth-441A",
    93: "eth-210D",
}

export const list = Object.entries(data).map(it=>{
    const [key, value] = it
    return {
        key,
        title: value,
        group: 'eth',
        location: '-',
        open: false,
    }
});


export const listUp = list.filter((item) => item[0] < 54);
export const listDown = list.filter((item) => item[0] > 54);




















































































































































































































































































































































































































































































































































































































































































































































































































































































































