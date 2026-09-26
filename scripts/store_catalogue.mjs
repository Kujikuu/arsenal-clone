// Club store catalogue for the seed: category tree, kit families, printing,
// promotions, delivery, gift cards, reviews and shop home content.
// Imported by gen_seed.mjs. Product imagery is either a stock photo or a
// `shirt:<style>` URL that the app draws as an SVG kit.

const json = (v) => ({ __json: v });

// ---------------------------------------------------------------- categories
// [slug, title, parent, showInMenu]
const TREE = [
  ['sale', '20% Off', null],
  ['new', 'New In', null],
  ['kit', 'Kit', null],
  ['home-kit', 'Home', 'kit'],
  ['away-kit', 'Away', 'kit'],
  ['third-kit', 'Third', 'kit'],
  ['goalkeeper', 'Goalkeeper', 'kit'],
  ['adidas', 'adidas', null],
  ['training', 'Training', 'adidas'],
  ['pre-match', 'Pre-Match', 'training'],
  ['european-range', 'European Range', 'training'],
  ['mens-training', 'Mens', 'training'],
  ['womens-training', 'Womens', 'training'],
  ['kids-training', 'Kids', 'training'],
  ['training-accs', 'Accessories', 'training'],
  ['adidas-collections', 'Fashion', 'adidas'],
  ['originals', 'Originals', 'adidas-collections'],
  ['tiro-travel', 'Tiro Travel', 'adidas-collections'],
  ['dna-range', 'DNA', 'adidas-collections'],
  ['as-seen-on-players', 'As Seen On Players', 'adidas'],
  ['authentic-kit', 'Authentic Kit', 'as-seen-on-players'],
  ['pro-trainingwear', 'Pro Trainingwear', 'as-seen-on-players'],
  ['warm-up', 'Warm Up', 'as-seen-on-players'],
  ['travel-wear', 'Travelwear', 'as-seen-on-players'],
  ['clothing', 'Clothing', null],
  ['mens-clothing', 'Mens', 'clothing'],
  ['mens-tshirts', 'T-Shirts', 'mens-clothing'],
  ['mens-retro', 'Retro Shirts', 'mens-clothing'],
  ['mens-sweatshirts', 'Sweatshirts & Hoodies', 'mens-clothing'],
  ['mens-jackets', 'Jackets & Coats', 'mens-clothing'],
  ['womens-clothing', 'Womens', 'clothing'],
  ['womens-tshirts', 'T-Shirts', 'womens-clothing'],
  ['womens-sweatshirts', 'Sweatshirts & Hoodies', 'womens-clothing'],
  ['womens-jackets', 'Jackets & Coats', 'womens-clothing'],
  ['kids-clothing', 'Kids & Baby', 'clothing'],
  ['baby', 'Baby', 'kids-clothing'],
  ['kids-kit', 'Kit', 'kids-clothing'],
  ['kids-tshirts', 'T-Shirts', 'kids-clothing'],
  ['arsenal-collections', 'Collections', 'clothing'],
  ['cold-weather', 'Winter Essentials', 'arsenal-collections'],
  ['matchday', 'Match Day', 'arsenal-collections'],
  ['best-sellers', 'Best Sellers', 'arsenal-collections'],
  ['awfc', 'AWFC Collection', 'arsenal-collections'],
  ['classics', 'Classics', 'arsenal-collections'],
  ['accessories', 'Accessories', null],
  ['accessories-hats-caps', 'Hats & Caps', 'accessories'],
  ['scarves', 'Scarves & Gloves', 'accessories'],
  ['bags', 'Bags & Wallets', 'accessories'],
  ['underwear-socks', 'Underwear & Socks', 'accessories'],
  ['footwear', 'Footwear', 'accessories'],
  ['pet', 'Pets', 'accessories'],
  ['champions', 'Champions', null],
  ['memorabilia', 'Memorabilia', null],
  ['signature', 'Signature Collection', 'memorabilia'],
  ['special-collection', 'Limited Edition', 'memorabilia'],
  ['legends', 'Legends', 'memorabilia'],
  ['photography', 'Photography & Prints', 'memorabilia'],
  ['gifts', 'Gifts', null],
  ['toys', 'Toys & Games', 'gifts'],
  ['gift-cards', 'Gift Cards', 'gifts'],
  ['souvenirs', 'Souvenirs', 'gifts'],
  ['home-car', 'Homeware', 'gifts'],
  ['books', 'Books & Stationery', 'gifts'],
  ['stadium-tours', 'Stadium Tours', null],
  ['retro-shop', 'Retro', null],
  ['outlet', 'Outlet', null],
];

// ---------------------------------------------------------------- charts
const sizeCharts = [
  {
    id: 'adult-shirt',
    title: 'Adult shirt size chart',
    columns: ['Size', 'Chest', 'Waist', 'Hip'],
    rows: json([
      ['XS', '32.5-34"', '27.5-29"', '32-33.5"'],
      ['S', '34.5-36"', '29.5-31.5"', '34-36"'],
      ['M', '36.5-39"', '32-34.5"', '36.5-39"'],
      ['L', '39.5-42.5"', '35-38"', '39.5-42"'],
      ['XL', '43-46.5"', '38.5-42"', '42.5-45.5"'],
      ['2XL', '47-51"', '42.5-47"', '46-49"'],
      ['3XL', '51.5-56"', '47.5-52"', '49.5-53"'],
    ]),
  },
  {
    id: 'womens-shirt',
    title: 'Womens shirt size chart',
    columns: ['Size', 'UK', 'Bust', 'Waist'],
    rows: json([
      ['XS', '4-6', '30.5-32"', '24-25.5"'],
      ['S', '8-10', '32.5-34.5"', '26-28"'],
      ['M', '12-14', '35-37"', '28.5-30.5"'],
      ['L', '16-18', '37.5-40.5"', '31-34"'],
      ['XL', '20-22', '41-44.5"', '34.5-38"'],
    ]),
  },
  {
    id: 'kids',
    title: 'Kids size chart',
    columns: ['Age', 'Height', 'Chest'],
    rows: json([
      ['5-6Y', '110-116cm', '58-61cm'],
      ['7-8Y', '122-128cm', '62-66cm'],
      ['9-10Y', '134-140cm', '67-70cm'],
      ['11-12Y', '146-152cm', '71-76cm'],
      ['13-14Y', '158-164cm', '77-82cm'],
    ]),
  },
  {
    id: 'baby',
    title: 'Baby size chart',
    columns: ['Age', 'Height', 'Weight'],
    rows: json([
      ['3-6M', '62-68cm', '6-8kg'],
      ['6-9M', '68-74cm', '8-9kg'],
      ['9-12M', '74-80cm', '9-10kg'],
      ['12-18M', '80-86cm', '10-12kg'],
      ['18-24M', '86-92cm', '12-13kg'],
    ]),
  },
];

const ADULT = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const WOMENS = ['XS', 'S', 'M', 'L', 'XL'];
const KIDS = ['5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y'];
const BABY = ['3-6M', '6-9M', '9-12M', '12-18M', '18-24M'];
const ONE = ['One Size'];

const CARE =
  'If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.';

// ---------------------------------------------------------------- products
export function storeCatalogue(IMG) {
  const products = [];
  const productCategories = [];
  const printOptions = [];
  const productPatches = [];
  let seq = 0;

  const add = (p, categories, extra = {}) => {
    seq += 1;
    const row = {
      id: p.id,
      category: p.legacy ?? 'Accessories',
      title: p.title,
      description: p.description,
      price_gbp: p.gbp,
      price_usd: p.usd,
      compare_at_price_gbp: p.wasGbp ?? null,
      compare_at_price_usd: p.wasUsd ?? null,
      main_image_url: p.image,
      gallery_urls: p.gallery ?? [p.image],
      back_image_url: p.back ?? null,
      sizes: p.sizes,
      is_customizable: Boolean(extra.print),
      customisation_price_gbp: 15,
      customisation_price_usd: 20,
      badge: p.badge ?? null,
      external_buy_url: null,
      brand: p.brand ?? 'Arsenal',
      family_id: p.family ?? null,
      kit_role: p.kitRole ?? null,
      profile: p.profile ?? 'unisex',
      profile_group_id: p.group ?? null,
      size_chart_id: p.chart ?? null,
      details: json(p.details ?? {}),
      returnable: p.returnable ?? true,
      popularity: p.popularity ?? Math.max(1, 200 - seq),
      member_discount_eligible: p.memberEligible ?? true,
      is_active: true,
    };
    products.push(row);
    categories.forEach((slug, i) =>
      productCategories.push({ product_id: p.id, category_slug: slug, position: i })
    );
    if (extra.print) printOptions.push({ product_id: p.id, ...extra.print });
    for (const patch of extra.patches ?? [])
      productPatches.push({ product_id: p.id, patch_id: patch });
  };

  // ---- Kits: every role in mens / womens / kids (+ authentic, shorts, socks)
  const KITS = [
    {
      role: 'home',
      label: 'Home',
      colour: 'Red / White',
      legacy: 'Kits',
      story:
        'Marking 20 years at our modern home ground, the new home shirt echoes the Emirates Stadium’s architecture on the collar and cuffs, with the classic red body and white sleeves.',
    },
    {
      role: 'away',
      label: 'Away',
      colour: 'Collegiate Navy',
      legacy: 'Kits',
      sale: true,
      story:
        'A deep navy away shirt with a tonal cannon graphic and gold trims, built for big nights on the road.',
    },
    {
      role: 'third',
      label: 'Third',
      colour: 'Almost Yellow',
      legacy: 'Kits',
      sale: true,
      story:
        'A modern take on the club’s famous yellow change strips with a subtle zigzag weave and maroon trims.',
    },
    {
      role: 'goalkeeper',
      label: 'Home Goalkeeper',
      colour: 'Lime',
      legacy: 'Kits',
      story:
        'The shirt our goalkeepers wear at the Emirates, with padded elbows on the long sleeve version.',
    },
  ];

  const mensPatches = ['pl', 'ucl'];
  const womensPatches = ['wsl', 'uwcl', 'wcc', 'wcc-uwcl', 'wcc-wsl'];
  const menPrint = {
    team_type: 'men',
    player_price_gbp: 15,
    player_price_usd: 20,
    name_price_gbp: 7.5,
    name_price_usd: 10,
    number_price_gbp: 7.5,
    number_price_usd: 10,
    fonts: ['premier_league', 'arsenal'],
  };
  const womenPrint = { ...menPrint, team_type: 'women', fonts: ['premier_league', 'pride'] };
  const kidsPrint = {
    ...menPrint,
    player_price_gbp: 12,
    player_price_usd: 16,
    name_price_gbp: 6,
    name_price_usd: 8,
    number_price_gbp: 6,
    number_price_usd: 8,
  };

  const shirtDetails = (colour, code, extra = []) => ({
    bullets: [
      'Embroidered Club crest at chest',
      'Embroidered adidas badge of sport',
      'Moisture-absorbing adidas Climacool technology',
      'Round neck',
      ...extra,
    ],
    fit: 'Slim fit',
    model: 'Our model (6’0") wears a size M and has a 38" chest, 32" waist',
    care: CARE,
    colour,
    code,
    material: '100% recycled polyester',
  });

  for (const k of KITS) {
    const s = k.role === 'goalkeeper' ? 'gk' : k.role;
    const cats = [`${k.role === 'goalkeeper' ? 'goalkeeper' : `${k.role}-kit`}`, 'kit'];
    const saleCats = k.sale ? [] : [];
    const code = (p) => `${p}${k.role.slice(0, 2).toUpperCase()}2627`;
    const badgeFor = k.role === 'home' ? 'Best Seller' : k.role === 'third' ? 'New' : null;

    add(
      {
        id: `kit-${k.role}-shirt-m`,
        legacy: k.legacy,
        title: `Arsenal adidas 26/27 ${k.label} Shirt`,
        description: k.story,
        gbp: 85,
        usd: 100,
        image: `shirt:${s}`,
        back: `shirt:${s}:back`,
        gallery: [`shirt:${s}`, `shirt:${s}:back`, IMG.action, IMG.crowd],
        sizes: ADULT,
        badge: badgeFor,
        brand: 'adidas',
        family: 'kit-2627-shirt',
        kitRole: k.role,
        profile: 'mens',
        group: `kit-${k.role}-shirt`,
        chart: 'adult-shirt',
        popularity: k.role === 'home' ? 1000 : 900,
        details: shirtDetails(k.colour, code('MJ'), ['Dual-contrast adidas 3-stripe details']),
      },
      [...cats, 'mens-clothing', 'best-sellers', 'matchday', ...saleCats],
      { print: menPrint, patches: mensPatches }
    );
    add(
      {
        id: `kit-${k.role}-shirt-w`,
        legacy: k.legacy,
        title: `Arsenal adidas Womens 26/27 ${k.label} Shirt`,
        description: `${k.story} Cut for a women’s fit.`,
        gbp: 85,
        usd: 100,
        image: `shirt:${s}`,
        back: `shirt:${s}:back`,
        gallery: [`shirt:${s}`, `shirt:${s}:back`, IMG.women],
        sizes: WOMENS,
        brand: 'adidas',
        family: 'kit-2627-shirt',
        kitRole: k.role,
        profile: 'womens',
        group: `kit-${k.role}-shirt`,
        chart: 'womens-shirt',
        popularity: 700,
        details: { ...shirtDetails(k.colour, code('WK')), fit: 'Regular women’s fit' },
      },
      [...cats, 'womens-clothing', 'awfc'],
      { print: womenPrint, patches: womensPatches }
    );
    add(
      {
        id: `kit-${k.role}-shirt-k`,
        legacy: k.legacy,
        title: `Arsenal adidas Kids 26/27 ${k.label} Shirt`,
        description: `${k.story} Sized for young Gooners.`,
        gbp: 65,
        usd: 80,
        image: `shirt:${s}`,
        back: `shirt:${s}:back`,
        gallery: [`shirt:${s}`, `shirt:${s}:back`],
        sizes: KIDS,
        brand: 'adidas',
        family: 'kit-2627-shirt',
        kitRole: k.role,
        profile: 'kids',
        group: `kit-${k.role}-shirt`,
        chart: 'kids',
        popularity: 650,
        details: { ...shirtDetails(k.colour, code('KJ')), fit: 'Regular fit', model: null },
      },
      [...cats, 'kids-clothing', 'kids-kit'],
      { print: kidsPrint, patches: mensPatches }
    );
    if (k.role !== 'goalkeeper') {
      add(
        {
          id: `kit-${k.role}-authentic-m`,
          legacy: k.legacy,
          title: `Arsenal adidas 26/27 Authentic ${k.label} Shirt`,
          description: `The exact shirt the players wear. ${k.story} HEAT.RDY fabric and a heat-applied crest keep it light on match day.`,
          gbp: 115,
          usd: 150,
          image: `shirt:${s}`,
          back: `shirt:${s}:back`,
          gallery: [`shirt:${s}`, `shirt:${s}:back`, IMG.action],
          sizes: ADULT,
          brand: 'adidas',
          family: 'kit-2627-authentic',
          kitRole: k.role,
          profile: 'mens',
          group: `kit-${k.role}-authentic`,
          chart: 'adult-shirt',
          popularity: 600,
          details: {
            ...shirtDetails(k.colour, code('MA'), ['HEAT.RDY technology', 'Heat-applied crest']),
            material: '100% recycled polyester doubleknit',
          },
        },
        [...cats, 'authentic-kit', 'as-seen-on-players'],
        { print: menPrint, patches: mensPatches }
      );
      add(
        {
          id: `kit-${k.role}-authentic-w`,
          legacy: k.legacy,
          title: `Arsenal adidas Womens 26/27 Authentic ${k.label} Shirt`,
          description: `As worn by Arsenal Women. ${k.story}`,
          gbp: 115,
          usd: 150,
          image: `shirt:${s}`,
          back: `shirt:${s}:back`,
          sizes: WOMENS,
          brand: 'adidas',
          family: 'kit-2627-authentic',
          kitRole: k.role,
          profile: 'womens',
          group: `kit-${k.role}-authentic`,
          chart: 'womens-shirt',
          popularity: 400,
          details: shirtDetails(k.colour, code('WA'), ['HEAT.RDY technology']),
        },
        [...cats, 'authentic-kit', 'awfc'],
        { print: womenPrint, patches: womensPatches }
      );
      add(
        {
          id: `kit-${k.role}-shorts-m`,
          legacy: k.legacy,
          title: `Arsenal adidas 26/27 ${k.label} Shorts`,
          description: `Match shorts to complete the 26/27 ${k.label.toLowerCase()} kit.`,
          gbp: 40,
          usd: 60,
          image: k.role === 'home' ? IMG.action : IMG.ball,
          sizes: ADULT,
          brand: 'adidas',
          profile: 'mens',
          group: `kit-${k.role}-shorts`,
          chart: 'adult-shirt',
          popularity: 300,
          details: {
            bullets: ['Elasticated waist with drawcord', 'Climacool fabric'],
            colour: k.colour,
            code: code('SH'),
            material: '100% recycled polyester',
            care: CARE,
          },
        },
        cats
      );
      add(
        {
          id: `kit-${k.role}-socks`,
          legacy: k.legacy,
          title: `Arsenal adidas 26/27 ${k.label} Socks`,
          description: `Cushioned match socks in ${k.colour.toLowerCase()}.`,
          gbp: 18,
          usd: 25,
          image: IMG.ball,
          sizes: ['S', 'M', 'L'],
          brand: 'adidas',
          profile: 'unisex',
          popularity: 200,
        },
        [...cats, 'underwear-socks']
      );
    }
    if (k.role === 'home' || k.role === 'away') {
      add(
        {
          id: `kit-${k.role}-minikit`,
          legacy: k.legacy,
          title: `Arsenal adidas 26/27 ${k.label} Mini Kit`,
          description: 'Shirt, shorts and socks for the smallest Gooners.',
          gbp: 55,
          usd: 70,
          image: `shirt:${s}`,
          back: `shirt:${s}:back`,
          sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y'],
          brand: 'adidas',
          profile: 'kids',
          popularity: 350,
        },
        [...cats, 'kids-kit', 'kids-clothing'],
        { print: kidsPrint }
      );
    }
  }
  add(
    {
      id: 'kit-home-ls-m',
      legacy: 'Kits',
      title: 'Arsenal adidas 26/27 Home Long Sleeved Shirt',
      description: 'The 26/27 home shirt with long sleeves and ribbed cuffs.',
      gbp: 90,
      usd: 110,
      image: 'shirt:home',
      back: 'shirt:home:back',
      sizes: ADULT,
      brand: 'adidas',
      profile: 'mens',
      chart: 'adult-shirt',
      popularity: 380,
    },
    ['home-kit', 'kit', 'cold-weather'],
    { print: menPrint, patches: mensPatches }
  );
  add(
    {
      id: 'champions-home-shirt',
      legacy: 'Kits',
      title: 'Arsenal adidas Premier League Champions Home Shirt',
      description:
        'Celebrate the title with the home shirt and gold Champions 26 printing on the back.',
      gbp: 120,
      usd: 145,
      image: 'shirt:home:back:champions',
      back: 'shirt:home:back:champions',
      gallery: ['shirt:home:back:champions', 'shirt:home'],
      sizes: ADULT,
      badge: 'Champions',
      brand: 'adidas',
      profile: 'mens',
      chart: 'adult-shirt',
      popularity: 950,
      returnable: false,
      memberEligible: false,
      details: shirtDetails('Red / White / Gold', 'MJZCH26', ['Gold Champions 26 print']),
    },
    ['champions', 'home-kit', 'kit']
  );

  // ---- Training and adidas collections
  const training = [
    [
      'tr-prematch-jersey',
      'Arsenal adidas 26/27 Pre-Match Jersey',
      60,
      75,
      'shirt:prematch',
      ['pre-match', 'training', 'mens-training'],
      'mens',
      ADULT,
      'New',
    ],
    [
      'tr-european-top',
      'Arsenal adidas 26/27 European Training Top',
      70,
      90,
      'shirt:training-euro',
      ['european-range', 'training', 'mens-training'],
      'mens',
      ADULT,
      'New',
    ],
    [
      'tr-training-jersey-w',
      'Arsenal adidas Womens 26/27 Training Jersey',
      45,
      60,
      'shirt:training',
      ['womens-training', 'training', 'awfc'],
      'womens',
      WOMENS,
      null,
    ],
    [
      'tr-training-jersey-k',
      'Arsenal adidas Kids 26/27 Training Jersey',
      35,
      45,
      'shirt:training',
      ['kids-training', 'training', 'kids-clothing'],
      'kids',
      KIDS,
      null,
    ],
    [
      'tr-anthem-jacket',
      'Arsenal adidas 26/27 Anthem Jacket',
      90,
      110,
      IMG.training,
      ['warm-up', 'as-seen-on-players', 'mens-jackets'],
      'mens',
      ADULT,
      null,
    ],
    [
      'tr-pro-top',
      'Arsenal adidas Pro Training Top',
      75,
      95,
      IMG.training,
      ['pro-trainingwear', 'as-seen-on-players', 'mens-training'],
      'mens',
      ADULT,
      null,
    ],
    [
      'tr-travel-hoodie',
      'Arsenal adidas Tiro Travel Hoodie',
      70,
      90,
      IMG.crowd,
      ['tiro-travel', 'travel-wear', 'adidas-collections', 'mens-sweatshirts'],
      'mens',
      ADULT,
      null,
    ],
    [
      'tr-travel-pants',
      'Arsenal adidas Tiro Travel Pants',
      55,
      70,
      IMG.crowd,
      ['tiro-travel', 'travel-wear', 'adidas-collections'],
      'mens',
      ADULT,
      null,
    ],
    [
      'tr-originals-tee',
      'Arsenal adidas Originals Trefoil T-Shirt',
      35,
      45,
      IMG.stadium,
      ['originals', 'adidas-collections', 'mens-tshirts'],
      'mens',
      ADULT,
      null,
    ],
    [
      'tr-dna-hoodie',
      'Arsenal adidas DNA Hoodie',
      65,
      80,
      IMG.crowd,
      ['dna-range', 'adidas-collections', 'mens-sweatshirts', 'cold-weather'],
      'mens',
      ADULT,
      null,
    ],
    [
      'tr-training-shorts',
      'Arsenal adidas Training Shorts',
      35,
      45,
      IMG.training,
      ['mens-training', 'training'],
      'mens',
      ADULT,
      null,
    ],
    [
      'tr-training-beanie',
      'Arsenal adidas Training Beanie',
      22,
      30,
      IMG.women,
      ['training-accs', 'training', 'accessories-hats-caps', 'cold-weather'],
      'unisex',
      ONE,
      null,
    ],
    [
      'tr-gk-gloves',
      'Arsenal adidas Goalkeeper Gloves',
      45,
      58,
      IMG.keeper,
      ['training-accs', 'goalkeeper'],
      'unisex',
      ['7', '8', '9', '10', '11'],
      null,
    ],
    [
      'tr-football',
      'Arsenal adidas 26/27 Home Football Size 5',
      22,
      25,
      IMG.action,
      ['training-accs', 'toys', 'best-sellers'],
      'unisex',
      ['Size 5'],
      'Best Seller',
    ],
    [
      'tr-mini-football',
      'Arsenal adidas 26/27 Mini Home Football Size 1',
      12,
      15,
      IMG.ball,
      ['training-accs', 'toys'],
      'unisex',
      ['Size 1'],
      null,
    ],
  ];
  for (const [id, title, gbp, usd, image, cats, profile, sizes, badge] of training) {
    add(
      {
        id,
        legacy: 'Training',
        title,
        description: `${title.replace('Arsenal adidas ', '')}: the gear the squad trains in at Sobha Realty Training Centre.`,
        gbp,
        usd,
        image,
        sizes,
        badge,
        brand: 'adidas',
        profile,
        chart:
          sizes === ADULT
            ? 'adult-shirt'
            : sizes === WOMENS
              ? 'womens-shirt'
              : sizes === KIDS
                ? 'kids'
                : null,
        details: {
          bullets: ['adidas AEROREADY fabric', 'Embroidered crest'],
          material: '100% recycled polyester',
          care: CARE,
        },
      },
      cats
    );
  }

  // ---- Clothing, retro, collections
  const clothing = [
    [
      'cl-cannon-tee',
      'Arsenal Cannon Graphic T-Shirt',
      25,
      32,
      IMG.crowd,
      ['mens-tshirts', 'mens-clothing', 'essentials'],
      'mens',
      ADULT,
    ],
    [
      'cl-crest-hoodie',
      'Arsenal Crest Hoodie',
      50,
      65,
      IMG.crowd,
      ['mens-sweatshirts', 'mens-clothing', 'cold-weather', 'classics'],
      'mens',
      ADULT,
    ],
    [
      'cl-padded-jacket',
      'Arsenal Padded Jacket',
      95,
      120,
      IMG.stadium,
      ['mens-jackets', 'mens-clothing', 'cold-weather'],
      'mens',
      ADULT,
    ],
    [
      'cl-matchday-scarf-jacket',
      'Arsenal Matchday Rain Jacket',
      70,
      90,
      IMG.stadium,
      ['mens-jackets', 'matchday'],
      'mens',
      ADULT,
    ],
    [
      'cl-womens-tee',
      'Arsenal Womens Script T-Shirt',
      25,
      32,
      IMG.women,
      ['womens-tshirts', 'womens-clothing', 'awfc'],
      'womens',
      WOMENS,
    ],
    [
      'cl-womens-hoodie',
      'Arsenal Womens Cropped Hoodie',
      50,
      65,
      IMG.women,
      ['womens-sweatshirts', 'womens-clothing', 'cold-weather'],
      'womens',
      WOMENS,
    ],
    [
      'cl-womens-jacket',
      'Arsenal Womens Puffer Jacket',
      95,
      120,
      IMG.women,
      ['womens-jackets', 'womens-clothing', 'cold-weather'],
      'womens',
      WOMENS,
    ],
    [
      'cl-kids-tee',
      'Arsenal Kids Cannon T-Shirt',
      18,
      24,
      IMG.ball,
      ['kids-tshirts', 'kids-clothing'],
      'kids',
      KIDS,
    ],
    [
      'cl-kids-hoodie',
      'Arsenal Kids Crest Hoodie',
      35,
      45,
      IMG.ball,
      ['kids-clothing', 'cold-weather'],
      'kids',
      KIDS,
    ],
    [
      'cl-baby-bodysuit',
      'Arsenal Baby Home Bodysuit',
      18,
      24,
      'shirt:home',
      ['baby', 'kids-clothing'],
      'baby',
      BABY,
    ],
    [
      'cl-baby-kit',
      'Arsenal adidas 26/27 Home Baby Kit',
      45,
      60,
      'shirt:home',
      ['baby', 'kids-kit', 'home-kit'],
      'baby',
      BABY,
    ],
  ];
  for (const [id, title, gbp, usd, image, cats, profile, sizes] of clothing) {
    add(
      {
        id,
        legacy: 'Training',
        title,
        description: `${title.replace('Arsenal ', '')} in soft, everyday fabric with the club crest.`,
        gbp,
        usd,
        image,
        sizes,
        profile,
        chart:
          sizes === ADULT
            ? 'adult-shirt'
            : sizes === WOMENS
              ? 'womens-shirt'
              : sizes === KIDS
                ? 'kids'
                : 'baby',
        details: {
          bullets: ['Embroidered crest', 'Regular fit'],
          material: '80% cotton, 20% polyester',
          care: 'Machine wash at 30°C.',
        },
      },
      cats
    );
  }
  const retro = [
    [
      'sp05',
      'Arsenal 1991-93 Away "Bruised Banana" Shirt',
      'shirt:retro-9193',
      'The cult classic yellow and navy zigzag away shirt.',
    ],
    [
      'rt-8889-home',
      'Arsenal 1988-89 Home Shirt',
      'shirt:retro-home',
      'The shirt from Anfield ’89 and the most dramatic title win of all.',
    ],
    [
      'rt-7172-away',
      'Arsenal 1971 Double Away Shirt',
      'shirt:retro-7172',
      'Yellow and blue, as worn in the 1971 FA Cup final to seal the Double.',
    ],
    [
      'rt-0304-home',
      'Arsenal 2003-04 Invincibles Home Shirt',
      'shirt:retro-home',
      '49 unbeaten. The home shirt of the Invincibles season.',
    ],
  ];
  for (const [id, title, image, description] of retro) {
    add(
      {
        id,
        legacy: 'Retro',
        title,
        description,
        gbp: 65,
        usd: 85,
        image,
        back: `${image}:back`,
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        badge: 'Heritage',
        profile: 'mens',
        chart: 'adult-shirt',
        popularity: 320,
        details: {
          bullets: ['Faithful recreation of the original', 'Embroidered vintage crest'],
          material: '100% polyester',
          care: CARE,
        },
      },
      ['retro-shop', 'mens-retro', 'classics']
    );
  }
  add(
    {
      id: 'sp09',
      legacy: 'Retro',
      title: 'Arsenal 1971 Double Winners Jacket',
      description: 'A heritage track jacket celebrating the first league and cup Double.',
      gbp: 75,
      usd: 95,
      image: IMG.stadium,
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      badge: 'Limited',
      profile: 'mens',
      chart: 'adult-shirt',
    },
    ['retro-shop', 'mens-jackets', 'special-collection']
  );

  // ---- Accessories, memorabilia, gifts (manual was-prices land in the Outlet)
  const accessories = [
    [
      'sp06',
      'Arsenal Cannon Cuff Beanie',
      22,
      28,
      IMG.women,
      ['accessories-hats-caps', 'accessories', 'cold-weather'],
      ONE,
    ],
    [
      'sp10',
      'Arsenal Home Bar Scarf',
      18,
      24,
      IMG.crowd,
      ['scarves', 'accessories', 'matchday', 'best-sellers'],
      ONE,
    ],
    [
      'ac-cap-red',
      "Arsenal '47 Red Cap",
      28,
      35,
      IMG.crowd,
      ['accessories-hats-caps', 'accessories'],
      ONE,
    ],
    [
      'ac-bobble',
      'Arsenal Bobble Hat',
      18,
      24,
      IMG.women,
      ['accessories-hats-caps', 'cold-weather'],
      ONE,
    ],
    [
      'ac-gloves',
      'Arsenal Knitted Gloves',
      20,
      25,
      IMG.women,
      ['scarves', 'cold-weather'],
      ['S/M', 'L/XL'],
    ],
    [
      'ac-backpack',
      'Arsenal adidas 26/27 Backpack',
      60,
      60,
      IMG.stadium,
      ['bags', 'accessories'],
      ONE,
    ],
    ['ac-wallet', 'Arsenal Leather Wallet', 25, 32, IMG.stadium, ['bags', 'gifts'], ONE],
    [
      'ac-socks-3pk',
      'Arsenal Socks 3 Pack',
      15,
      20,
      IMG.ball,
      ['underwear-socks', 'accessories'],
      ['6-8', '9-11'],
    ],
    [
      'ac-sliders',
      'Arsenal Crest Sliders',
      25,
      32,
      IMG.ball,
      ['footwear', 'accessories'],
      ['6', '7', '8', '9', '10', '11'],
    ],
    [
      'ac-dog-shirt',
      'Arsenal Pet Football Shirt',
      18,
      24,
      'shirt:home',
      ['pet', 'accessories'],
      ['XS', 'S', 'M', 'L'],
    ],
    ['ac-dog-lead', 'Arsenal Dog Lead', 12, 16, IMG.crowd, ['pet'], ONE],
  ];
  for (const [id, title, gbp, usd, image, cats, sizes] of accessories) {
    add(
      {
        id,
        legacy: 'Accessories',
        title,
        description: `${title.replace('Arsenal ', '')} with the club crest.`,
        gbp,
        usd,
        image,
        sizes,
      },
      cats
    );
  }
  const memorabilia = [
    [
      'mem-signed-shirt',
      'Signed 26/27 Home Shirt – First Team Squad',
      450,
      575,
      'shirt:home:back',
      ['signature', 'memorabilia'],
      'Limited',
    ],
    [
      'mem-signed-ball',
      'Signed Football – Arsenal Women',
      150,
      190,
      IMG.action,
      ['signature', 'memorabilia', 'awfc'],
      'Limited',
    ],
    [
      'mem-legends-print',
      'Invincibles 49 Unbeaten Framed Print',
      85,
      110,
      IMG.stadium,
      ['legends', 'photography', 'memorabilia'],
      null,
    ],
    [
      'mem-emirates-print',
      'Emirates Stadium Panoramic Print',
      45,
      60,
      IMG.stadium,
      ['photography', 'memorabilia'],
      null,
    ],
    [
      'mem-trophy-replica',
      'Premier League Trophy Replica 1:3',
      95,
      120,
      IMG.crowd,
      ['special-collection', 'champions', 'memorabilia'],
      'Champions',
    ],
  ];
  for (const [id, title, gbp, usd, image, cats, badge] of memorabilia) {
    add(
      {
        id,
        legacy: 'Accessories',
        title,
        description: `${title}. Supplied with a certificate of authenticity.`,
        gbp,
        usd,
        image,
        sizes: ONE,
        badge,
        returnable: false,
        memberEligible: false,
      },
      cats
    );
  }
  const gifts = [
    ['sp11', 'Arsenal Crest Football', 20, 26, IMG.action, ['toys', 'gifts']],
    ['gf-mug', 'Arsenal Crest Mug', 10, 14, IMG.stadium, ['home-car', 'gifts', 'best-sellers']],
    ['gf-stanley', 'Arsenal Stanley Quencher 40oz', 45, 55, IMG.stadium, ['home-car', 'gifts']],
    ['gf-pint', 'Arsenal Pint Glass', 10, 14, IMG.stadium, ['home-car', 'gifts']],
    [
      'gf-teddy',
      'Arsenal Gunnersaurus Soft Toy',
      18,
      24,
      IMG.ball,
      ['toys', 'gifts', 'kids-clothing'],
    ],
    ['gf-lego', 'Arsenal Emirates Stadium Building Set', 60, 80, IMG.stadium, ['toys', 'gifts']],
    ['gf-badge', 'Arsenal Cannon Pin Badge', 5, 7, IMG.crowd, ['souvenirs', 'gifts']],
    ['gf-flag', 'Arsenal Crest Flag 5x3', 15, 20, IMG.crowd, ['souvenirs', 'matchday']],
    ['gf-annual', 'The Official Arsenal Annual 2027', 10, 14, IMG.stadium, ['books', 'gifts']],
    ['gf-giftcard', 'Arsenal Direct Gift Card', 25, 30, IMG.crowd, ['gift-cards', 'gifts']],
  ];
  for (const [id, title, gbp, usd, image, cats] of gifts) {
    add(
      {
        id,
        legacy: 'Accessories',
        title,
        description: `${title.replace('Arsenal ', '')}, a gift for any Gooner.`,
        gbp,
        usd,
        image,
        sizes: ONE,
        memberEligible: id !== 'gf-giftcard',
      },
      cats
    );
  }
  const outlet = [
    [
      'out-2526-home',
      'Arsenal adidas 25/26 Home Shirt',
      50,
      60,
      85,
      100,
      'shirt:home',
      'mens',
      ADULT,
    ],
    [
      'out-2526-away',
      'Arsenal adidas 25/26 Away Shirt',
      42,
      50,
      85,
      100,
      'shirt:away',
      'mens',
      ADULT,
    ],
    [
      'out-2526-training',
      'Arsenal adidas 25/26 Training Top',
      35,
      45,
      60,
      75,
      IMG.training,
      'mens',
      ADULT,
    ],
    [
      'out-womens-jacket',
      'Arsenal Womens 25/26 Anthem Jacket',
      45,
      55,
      85,
      100,
      IMG.women,
      'womens',
      WOMENS,
    ],
  ];
  for (const [id, title, gbp, usd, wasGbp, wasUsd, image, profile, sizes] of outlet) {
    add(
      {
        id,
        legacy: 'Kits',
        title,
        description: `${title}. Last season’s favourite, now reduced.`,
        gbp,
        usd,
        wasGbp,
        wasUsd,
        image,
        sizes,
        profile,
        badge: 'Outlet',
        brand: 'adidas',
        chart: sizes === ADULT ? 'adult-shirt' : 'womens-shirt',
        memberEligible: false,
      },
      ['outlet']
    );
  }

  // Keep the first seed's ids alive (orders and wishlists may point at them).
  const legacyAliases = [
    ['sp01', 'kit-home-authentic-m'],
    ['sp02', 'kit-away-shirt-m'],
    ['sp03', 'kit-third-shirt-m'],
    ['sp04', 'tr-pro-top'],
    ['sp07', 'kit-home-minikit'],
    ['sp08', 'tr-training-shorts'],
    ['sp12', 'tr-gk-gloves'],
  ];
  for (const [legacyId, target] of legacyAliases) {
    const p = products.find((x) => x.id === target);
    p.id = legacyId;
    productCategories
      .filter((c) => c.product_id === target)
      .forEach((c) => (c.product_id = legacyId));
    printOptions.filter((c) => c.product_id === target).forEach((c) => (c.product_id = legacyId));
    productPatches.filter((c) => c.product_id === target).forEach((c) => (c.product_id = legacyId));
  }

  // ---- Stock: plenty, with a few low or sold-out sizes for the UI.
  const LOW = {
    'sp01:3XL': 0,
    'sp01:L': 3,
    'kit-home-shirt-m:XL': 0,
    'kit-home-shirt-m:3XL': 0,
    'kit-home-shirt-m:L': 4,
    'sp03:XS': 0,
    'kit-away-shirt-w:XS': 2,
    'rt-7172-away:S': 0,
    'sp09:S': 0,
    'sp09:M': 4,
    'mem-signed-shirt:One Size': 3,
  };
  const variants = products.flatMap((p) =>
    p.sizes.map((size, i) => ({
      product_id: p.id,
      size,
      sku: `${p.id}-${size}`.toUpperCase().replace(/[^A-Z0-9-]/g, ''),
      stock: LOW[`${p.id}:${size}`] ?? 40,
      position: i + 1,
    }))
  );

  // ---- Categories with generated ids
  const categories = TREE.map(([slug, title, parent], i) => ({
    id: `cat-${slug}`,
    parent_id: parent ? `cat-${parent}` : null,
    slug,
    title,
    image_url: null,
    position: i,
    show_in_menu: true,
  }));
  // 'essentials' is referenced by products but lives under Collections.
  categories.push({
    id: 'cat-essentials',
    parent_id: 'cat-arsenal-collections',
    slug: 'essentials',
    title: 'Essentials',
    image_url: null,
    position: TREE.length,
    show_in_menu: true,
  });
  const productCategoryRows = productCategories.map((c) => ({
    product_id: c.product_id,
    category_id: `cat-${c.category_slug}`,
    position: c.position,
  }));

  const patches = [
    { id: 'pl', name: 'Premier League', price_gbp: 10, price_usd: 12, position: 1 },
    { id: 'ucl', name: 'Champions League', price_gbp: 11, price_usd: 13, position: 2 },
    { id: 'wsl', name: 'WSL', price_gbp: 8, price_usd: 10, position: 3 },
    { id: 'uwcl', name: 'Womens Champions League', price_gbp: 11, price_usd: 13, position: 4 },
    { id: 'wcc', name: 'Womens Champions Cup', price_gbp: 8, price_usd: 10, position: 5 },
    {
      id: 'wcc-uwcl',
      name: 'Womens Champions Cup + WCL',
      price_gbp: 20,
      price_usd: 25,
      position: 6,
    },
    {
      id: 'wcc-wsl',
      name: 'Womens Champions Cup + WSL',
      price_gbp: 16,
      price_usd: 20,
      position: 7,
    },
  ];
  const specials = [{ id: 'champions-26', label: 'CHAMPIONS', number: '26', position: 1 }];

  const promotions = [
    {
      id: 'promo-away',
      title: '20% off selected lines',
      percent_off: 20,
      product_id: null,
      category_id: 'cat-away-kit',
      starts_at: null,
      ends_at: null,
      active: true,
    },
    {
      id: 'promo-third',
      title: '20% off selected lines',
      percent_off: 20,
      product_id: null,
      category_id: 'cat-third-kit',
      starts_at: null,
      ends_at: null,
      active: true,
    },
    {
      id: 'promo-winter',
      title: '20% off Winter Essentials',
      percent_off: 20,
      product_id: null,
      category_id: 'cat-cold-weather',
      starts_at: null,
      ends_at: null,
      active: true,
    },
    {
      id: 'promo-backpack',
      title: '20% off',
      percent_off: 20,
      product_id: 'ac-backpack',
      category_id: null,
      starts_at: null,
      ends_at: null,
      active: true,
    },
  ];

  const shippingRates = [
    ['UK', 'standard', 'Standard delivery', '3-5 working days', 4.95, 6.5, 75, 100, 1],
    ['UK', 'express', 'Express delivery', '1-2 working days', 7.95, 10.5, null, null, 2],
    ['UK', 'nominated', 'Nominated day', 'Choose your day at dispatch', 9.95, 13, null, null, 3],
    ['EU', 'standard', 'Standard delivery', '5-8 working days', 9.95, 12.5, 150, 190, 1],
    ['EU', 'express', 'Express delivery', '2-4 working days', 19.95, 25, null, null, 2],
    ['US', 'standard', 'Standard delivery', '5-10 working days', 9.95, 12, 120, 150, 1],
    ['US', 'express', 'Express delivery', '2-4 working days', 19.95, 25, null, null, 2],
    ['ROW', 'standard', 'Standard delivery', '7-14 working days', 14.95, 19.95, 180, 230, 1],
    ['ROW', 'express', 'Express delivery', '3-6 working days', 29.95, 39, null, null, 2],
  ].map(
    ([zone, method, label, eta, price_gbp, price_usd, free_over_gbp, free_over_usd, position]) => ({
      zone,
      method,
      label,
      eta,
      price_gbp,
      price_usd,
      free_over_gbp,
      free_over_usd,
      position,
    })
  );

  const giftCards = [
    {
      code: 'GOONERGIFT25',
      currency: 'GBP',
      initial_balance: 25,
      balance: 25,
      expires_at: null,
      active: true,
    },
    {
      code: 'GOONERGIFT500',
      currency: 'GBP',
      initial_balance: 500,
      balance: 500,
      expires_at: null,
      active: true,
    },
    {
      code: 'GOONERUSD50',
      currency: 'USD',
      initial_balance: 50,
      balance: 50,
      expires_at: null,
      active: true,
    },
  ];

  const REVIEWERS = [
    ['Kevin L.', 'GB'],
    ['Brian H.', 'GB'],
    ['Gerard S.', 'IE'],
    ['Jon J.', 'GB'],
    ['Mark C.', 'GB'],
    ['Priya K.', 'GB'],
    ['Sam T.', 'US'],
    ['Aisha B.', 'GB'],
    ['Lars N.', 'NO'],
    ['Chidi O.', 'NG'],
  ];
  const REVIEW_TEXT = [
    [5, 'Looks good. Feels good.', 'Looks good. Feels good. Is good.'],
    [
      5,
      'Excellent product',
      'The shirt was easy to order and arrived in good time. Very happy with it.',
    ],
    [5, 'New home shirt', 'Pretty good delivery to Ireland and the printing is spot on.'],
    [4, 'Great shirt, runs small', 'Lovely quality but I’d size up if you like a looser fit.'],
    [5, 'Perfect gift', 'Bought for my son’s birthday, he hasn’t taken it off since.'],
    [5, 'Brilliant printing', 'Name and number printed perfectly and it arrived within the week.'],
    [
      4,
      'Good quality',
      'Nice material and colours. Delivery took a few days longer than expected.',
    ],
  ];
  const reviewTargets = [
    'kit-home-shirt-m',
    'sp01',
    'kit-home-shirt-w',
    'kit-home-shirt-k',
    'sp02',
    'sp03',
    'tr-football',
    'sp10',
    'champions-home-shirt',
  ];
  const reviews = [];
  reviewTargets.forEach((pid, pi) => {
    const n = pi < 2 ? 7 : 3;
    for (let i = 0; i < n; i++) {
      const [rating, title, body] = REVIEW_TEXT[(pi + i) % REVIEW_TEXT.length];
      const [author, country] = REVIEWERS[(pi * 3 + i) % REVIEWERS.length];
      reviews.push({
        id: `rev-${pid}-${i + 1}`,
        product_id: pid,
        user_id: null,
        author_name: author,
        country,
        rating,
        title,
        body,
        verified: true,
        helpful_count: (i * 3 + pi) % 9,
        unhelpful_count: i % 3 === 2 ? 1 : 0,
        created_at: new Date(Date.UTC(2026, 8, 20) - (pi * 7 + i * 9) * 86400000).toISOString(),
      });
    }
  });
  const questions = [
    {
      id: 'q-home-fit',
      product_id: 'kit-home-shirt-m',
      user_id: null,
      author_name: 'Tom',
      question: 'Is this the same fit as last season’s shirt?',
      answer:
        'Yes, the 26/27 replica shirt has the same slim fit as 25/26. If you prefer a looser fit, go one size up.',
      answered_at: '2026-08-02T10:00:00Z',
      created_at: '2026-08-01T09:00:00Z',
    },
    {
      id: 'q-home-print',
      product_id: 'kit-home-shirt-m',
      user_id: null,
      author_name: 'Hannah',
      question: 'How long does printing add to delivery?',
      answer:
        'Printed shirts are dispatched within 2 working days, then standard delivery times apply.',
      answered_at: '2026-08-10T10:00:00Z',
      created_at: '2026-08-09T15:00:00Z',
    },
  ];

  const HERO_IMG = 'gradient';
  const homeModules = [
    {
      id: 'hero',
      kind: 'hero',
      title: '20% OFF (ALMOST) EVERYTHING',
      position: 1,
      active: true,
      payload: json({
        subtitle: '* Selected styles only. Exclusions apply.',
        cta: 'Shop all',
        href: '/store/c/sale',
        background: HERO_IMG,
      }),
    },
    {
      id: 'ticker',
      kind: 'ticker',
      title: null,
      position: 2,
      active: true,
      payload: json({
        items: [
          'Members get 10% off',
          'Buy direct and support your club',
          'FREE standard delivery on UK orders over £75',
          'Printed to order in 2 working days',
        ],
      }),
    },
    {
      id: 'tabs',
      kind: 'product_tabs',
      title: null,
      position: 3,
      active: true,
      payload: json({
        tabs: [
          { label: '20% off', source: 'sale' },
          { label: 'New in', source: 'new' },
        ],
      }),
    },
    {
      id: 'adidas',
      kind: 'collection_carousel',
      title: 'adidas Collections',
      position: 4,
      active: true,
      payload: json({
        items: [
          { title: 'Trainingwear - NEW', image: 'shirt:training-euro', href: '/store/c/training' },
          {
            title: 'Third Kit - 20% off selected lines',
            image: 'shirt:third',
            href: '/store/c/third-kit',
          },
          {
            title: 'Away Kit - 20% off selected lines',
            image: 'shirt:away',
            href: '/store/c/away-kit',
          },
          { title: 'Home Kit', image: 'shirt:home', href: '/store/c/home-kit' },
          { title: 'Travelwear', image: IMG.crowd, href: '/store/c/travel-wear' },
        ],
      }),
    },
    {
      id: 'categories',
      kind: 'category_carousel',
      title: 'Shop by Category',
      position: 5,
      active: true,
      payload: json({
        items: [
          { title: 'Stadium Tours', image: IMG.stadium, href: '/store/tours' },
          { title: 'Autumn/Winter', image: IMG.women, href: '/store/c/cold-weather' },
          { title: 'Kids', image: IMG.ball, href: '/store/c/kids-clothing' },
          {
            title: 'Champions 25/26',
            image: 'shirt:home:back:champions',
            href: '/store/c/champions',
          },
          { title: 'Pets', image: IMG.crowd, href: '/store/c/pet' },
          { title: 'Match Day Collection', image: IMG.action, href: '/store/c/matchday' },
          {
            title: 'Retro Classics Shirts',
            image: 'shirt:retro-9193',
            href: '/store/c/retro-shop',
          },
        ],
      }),
    },
    {
      id: 'players',
      kind: 'player_carousel',
      title: 'Shop by Player',
      position: 6,
      active: true,
      payload: json({
        teams: ['men', 'women'],
        limit: 12,
        men_product: 'kit-home-shirt-m',
        women_product: 'kit-home-shirt-w',
      }),
    },
    {
      id: 'bestsellers',
      kind: 'product_carousel',
      title: 'Best Sellers',
      position: 7,
      active: true,
      payload: json({ category: 'best-sellers' }),
    },
    { id: 'trust', kind: 'trust', title: null, position: 8, active: true, payload: json({}) },
  ];

  return {
    categories,
    sizeCharts,
    products,
    productCategories: productCategoryRows,
    variants,
    printOptions,
    patches,
    productPatches,
    specials,
    promotions,
    shippingRates,
    giftCards,
    reviews,
    questions,
    homeModules,
  };
}
