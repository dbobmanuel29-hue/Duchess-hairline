/**
 * Central image registry.
 *
 * Replace these URLs with the client's approved Duchess Hairline photography
 * when real product and brand images are available.
 */

const stock = (id: number, w: number, h: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const media = {
  hero: stock(36825447, 800, 1200),
  heroWide: stock(9579282, 1200, 800),
  editorialPortrait: stock(36720012, 800, 1200),
  editorialAlt: stock(31779379, 800, 1200),
  aboutWide: stock(1498362, 1200, 800),

  // Remote fallbacks keep the deployed MVP free of missing local assets.
  storeInterior: stock(1498362, 1200, 800),
  studioPortrait: stock(36720012, 800, 1200),
  textureCloseup: stock(30444644, 900, 1200),
  shopDisplay: stock(9579282, 1200, 800),

  product: {
    boneStraight: stock(10621984, 700, 900),
    closure: stock(16756757, 700, 900),
    frontal: stock(37030834, 700, 900),
    curly: stock(14597563, 700, 900),
    bodyWave: stock(7219205, 700, 900),
    waterWave: stock(30444644, 700, 900),
    bob: stock(11557841, 700, 900),
    frontalSignature: stock(29965665, 700, 900),
    bobElegant: stock(17135759, 700, 900),
    curlyClosure: stock(13221803, 700, 900),
    boneStraightFrontal: stock(13221796, 700, 900),
    curlyNatural: stock(13221797, 700, 900),
    bodyWaveClosure: stock(31704057, 700, 900),
    waterWaveFrontal: stock(18450572, 700, 900),
    bobShort: stock(14969759, 700, 900),
    boneStraightClosure: stock(12246486, 700, 900),
  },
} as const;
