export type FilterId = 'all' | 'airtime' | 'data' | 'tv' | 'electricity' | 'betting' | 'shopping';

export interface BillService {
  id: number;
  name: string;
  category: FilterId;
  color: string;
  image: string;
}

export interface Provider {
  id: string;
  name: string;
  logo: string;
}

export const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all',         label: 'All Services' },
  { id: 'airtime',     label: 'Airtime'      },
  { id: 'data',        label: 'Data'         },
  { id: 'tv',          label: 'Cable TV'     },
  { id: 'electricity', label: 'Electricity'  },
  { id: 'betting',     label: 'Betting'      },
  { id: 'shopping',    label: 'Shopping'     },
];

export const SERVICES: BillService[] = [ 
  { id: 1, name: 'Airtime',     category: 'airtime',     color: 'green',  image: '/assets/images/airtime-bills.png'     },
  { id: 2, name: 'Betting',     category: 'betting',     color: 'blue',   image: '/assets/images/betting-bills.png'     },
  { id: 3, name: 'Cable TV',    category: 'tv',          color: 'cyan',   image: '/assets/images/cabletv-bills.png'     },
  { id: 4, name: 'Data',        category: 'data',        color: 'black',  image: '/assets/images/airtime-bills.png'     },
  { id: 5, name: 'Shopping',    category: 'shopping',    color: 'purple', image: '/assets/images/shopping-bills.png'    },
  { id: 6, name: 'Electricity', category: 'electricity', color: 'green',  image: '/assets/images/electricity_bill.png' },
];

export const AIRTIME_PROVIDERS: Provider[] = [
  { id: 'airtel',  name: 'Airtel',  logo: '/assets/images/airtel.png'  },
  { id: '9mobile', name: '9mobile', logo: '/assets/images/9mobile.jpg' },
  { id: 'glo',     name: 'Glo',     logo: '/assets/images/glo.jpg'     },
  { id: 'mtn',     name: 'MTN',     logo: '/assets/images/mtn.png'     },
  { id: 'smile',   name: 'Smile',   logo: '/assets/images/smile.png'   },
];

export const TV_PROVIDERS: Provider[] = [
  { id: 'dstv',      name: 'DSTV',      logo: '/assets/images/dstv.jpg'      },
  { id: 'gotv',      name: 'GOtv',      logo: '/assets/images/gotv.png'      },
  { id: 'startimes', name: 'Startimes', logo: '/assets/images/startimes.png' },
];

export const ELECTRICITY_PROVIDERS: Provider[] = [
  { id: 'ekedc', name: 'EKEDC (Eko)',    logo: '/assets/images/ekoelectric.png'    },
  { id: 'ikedc', name: 'IKEDC (Ikeja)',  logo: '/assets/images/ikejaelectric.png'  },
  { id: 'phed',  name: 'PHED (Port H)',  logo: '/assets/images/portelectric.png'   },
  { id: 'ibedc', name: 'IBEDC (Ibadan)', logo: '/assets/images/ibadanelectric.png' },
  { id: 'aedc',  name: 'AEDC (Abuja)',   logo: '/assets/images/abujaelectric.jpg'  },
];

export const BETTING_PROVIDERS: Provider[] = [
  { id: 'bet9ja',  name: 'Bet9ja',  logo: '/assets/images/bet9ja.jpeg'  },
  { id: 'betway',  name: 'Betway',  logo: '/assets/images/betway.jpeg'  },
  { id: 'betking', name: 'BetKing', logo: '/assets/images/betking.png'  },
  { id: '1xbet',   name: '1xBet',   logo: '/assets/images/onexbet.png'  },
  { id: 'bangbet', name: 'BangBet', logo: '/assets/images/bangbet.jpeg' },
];

export const SHOPPING_PROVIDERS: Provider[] = [
  { id: 'jumia',      name: 'Jumia',      logo: '/assets/images/jumia.png'      },
  { id: 'jiji',       name: 'Jiji',       logo: '/assets/images/jiji.jpg'       },
  { id: 'aliexpress', name: 'AliExpress', logo: '/assets/images/aliexpress.png' },
  { id: 'amazon',     name: 'Amazon',     logo: '/assets/images/amazon.jpg'     },
  { id: 'ebay',       name: 'eBay',       logo: '/assets/images/ebay.png'       },
];

export const ACCOUNT_PLACEHOLDER: Record<FilterId, string> = {
  all:         'Account number',
  airtime:     'Phone number e.g. 08012345678',
  data:        'Phone number e.g. 08012345678',
  tv:          'Smart card / IUC number',
  electricity: 'Meter number',
  betting:     'Username / user ID',
  shopping:    'Voucher / account ID',
};

export function getProviders(category: FilterId): Provider[] {
  switch (category) {
    case 'airtime':
    case 'data':        return AIRTIME_PROVIDERS;
    case 'tv':          return TV_PROVIDERS;
    case 'electricity': return ELECTRICITY_PROVIDERS;
    case 'betting':     return BETTING_PROVIDERS;
    case 'shopping':    return SHOPPING_PROVIDERS;
    default:            return AIRTIME_PROVIDERS;
  }
}
