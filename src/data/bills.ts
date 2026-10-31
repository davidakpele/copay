export type FilterId = 'all' | 'airtime' | 'data' | 'tv' | 'electricity' | 'betting' | 'shopping';

export interface BillService {
  id: number;
  name: string;
  category: FilterId;
  color: string;
  image: string;
  route: string;
}

export interface Provider {
  id: string;
  name: string;
  logo: string;
}

export interface CablePlan {
  name: string;
  price: number;
  value: string;
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
  { id: 1, name: 'Airtime',     category: 'airtime',     color: 'green',  image: '/assets/images/airtime-bills.png',     route: '/bills/airtime'     },
  { id: 2, name: 'Betting',     category: 'betting',     color: 'blue',   image: '/assets/images/betting-bills.png',     route: '/bills/betting'     },
  { id: 3, name: 'Cable TV',    category: 'tv',          color: 'cyan',   image: '/assets/images/cabletv-bills.png',     route: '/bills/cable-tv'    },
  { id: 4, name: 'Data',        category: 'data',        color: 'black',  image: '/assets/images/airtime-bills.png',     route: '/bills/data'        },
  { id: 5, name: 'Shopping',    category: 'shopping',    color: 'purple', image: '/assets/images/shopping-bills.png',    route: '/bills/shopping'    },
  { id: 6, name: 'Electricity', category: 'electricity', color: 'yellow', image: '/assets/images/electricity_bill.png', route: '/bills/electricity' },
];

export const NETWORKS = [
  { id: 'mtn',     name: 'MTN',     bg: '#FFC300', color: '#000', abbr: 'MTN',   logo: '/assets/images/mtn.png'     },
  { id: 'airtel',  name: 'Airtel',  bg: '#E8001C', color: '#fff', abbr: 'AIR',   logo: '/assets/images/airtel.png'  },
  { id: 'glo',     name: 'Glo',     bg: '#008000', color: '#fff', abbr: 'GLO',   logo: '/assets/images/glo.jpg'     },
  { id: '9mobile', name: '9mobile', bg: '#006633', color: '#fff', abbr: '9MB',   logo: '/assets/images/9mobile.jpg' },
  { id: 'smile',   name: 'Smile',   bg: '#2ea613', color: '#fff', abbr: 'SMI',   logo: '/assets/images/smile.png'   },
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

export const DSTV_PLANS: CablePlan[] = [
  { name: 'DSTV Padi',        price: 2500,  value: 'padi'        },
  { name: 'DSTV Yanga',       price: 3500,  value: 'yanga'       },
  { name: 'DSTV Confam',      price: 6200,  value: 'confam'      },
  { name: 'DSTV Compact',     price: 10500, value: 'compact'     },
  { name: 'DSTV Compact Plus',price: 16600, value: 'compact_plus'},
  { name: 'DSTV Premium',     price: 24500, value: 'premium'     },
];

export const GOTV_PLANS: CablePlan[] = [
  { name: 'GOtv Smallie', price: 1575,  value: 'smallie' },
  { name: 'GOtv Jinja',   price: 2715,  value: 'jinja'   },
  { name: 'GOtv Jolli',   price: 4115,  value: 'jolli'   },
  { name: 'GOtv Max',     price: 6200,  value: 'max'     },
  { name: 'GOtv Supa',    price: 9600,  value: 'supa'    },
];

export const STARTIMES_PLANS: CablePlan[] = [
  { name: 'Nova',     price: 900,  value: 'nova'    },
  { name: 'Basic',    price: 1700, value: 'basic'   },
  { name: 'Smart',    price: 2500, value: 'smart'   },
  { name: 'Classic',  price: 3000, value: 'classic' },
  { name: 'Super',    price: 4200, value: 'super'   },
];

export const ELECTRICITY_PROVIDERS: Provider[] = [
  { id: 'ekedc', name: 'EKEDC (Eko)',    logo: '/assets/images/ekoelectric.png'    },
  { id: 'ikedc', name: 'IKEDC (Ikeja)',  logo: '/assets/images/ikejaelectric.png'  },
  { id: 'phed',  name: 'PHED (Port H)',  logo: '/assets/images/portelectric.png'   },
  { id: 'ibedc', name: 'IBEDC (Ibadan)', logo: '/assets/images/ibadanelectric.png' },
  { id: 'aedc',  name: 'AEDC (Abuja)',   logo: '/assets/images/abujaelectric.jpg'  },
  { id: 'kedc',  name: 'KEDC (Kaduna)',  logo: '/assets/images/kadunaelectric.jpg' },
];

export const BETTING_PROVIDERS: Provider[] = [
  { id: 'bet9ja',  name: 'Bet9ja',  logo: '/assets/images/bet9ja.jpeg'  },
  { id: 'betway',  name: 'Betway',  logo: '/assets/images/betway.jpeg'  },
  { id: 'betking', name: 'BetKing', logo: '/assets/images/betking.png'  },
  { id: '1xbet',   name: '1xBet',   logo: '/assets/images/onexbet.png'  },
  { id: 'bangbet', name: 'BangBet', logo: '/assets/images/bangbet.jpeg' },
  { id: 'nairabet',name: 'NairaBet',logo: '/assets/images/nairabet.png' },
];

export const SHOPPING_PROVIDERS: Provider[] = [
  { id: 'jumia',      name: 'Jumia',      logo: '/assets/images/jumia.png'      },
  { id: 'jiji',       name: 'Jiji',       logo: '/assets/images/jiji.jpg'       },
  { id: 'aliexpress', name: 'AliExpress', logo: '/assets/images/aliexpress.png' },
  { id: 'amazon',     name: 'Amazon',     logo: '/assets/images/amazon.jpg'     },
  { id: 'ebay',       name: 'eBay',       logo: '/assets/images/ebay.png'       },
];

export const AIRTIME_QUICK = [100, 200, 500, 1000, 2000];
export const ELECTRICITY_QUICK = [5000, 10000, 20000, 30000, 50000];
export const BETTING_QUICK = [500, 1000, 2000, 5000, 10000];
export const SHOPPING_QUICK = [5000, 10000, 20000];

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

export function getPlansForProvider(providerId: string): CablePlan[] {
  switch (providerId) {
    case 'dstv':      return DSTV_PLANS;
    case 'gotv':      return GOTV_PLANS;
    case 'startimes': return STARTIMES_PLANS;
    default:          return DSTV_PLANS;
  }
}

export const ACCOUNT_PLACEHOLDER: Record<FilterId, string> = {
  all:         'Account number',
  airtime:     'Phone number e.g. 08012345678',
  data:        'Phone number e.g. 08012345678',
  tv:          'Smart card / IUC number',
  electricity: 'Meter number',
  betting:     'Username / user ID',
  shopping:    'Voucher / account ID',
};
