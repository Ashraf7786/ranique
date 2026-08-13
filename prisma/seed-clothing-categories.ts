/**
 * seed-clothing-categories.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Seeds the "Women's Clothing" parent category and all sub-categories
 * into the live database. Safe to run multiple times — uses upsert.
 *
 * Run: npx tsx prisma/seed-clothing-categories.ts
 */

import { prisma } from '../lib/prisma';

async function main() {
  console.log('\n🌸 Seeding Women\'s Clothing Categories...\n');

  // ── 1. Parent Category ──────────────────────────────────────────────────────
  const parent = await prisma.category.upsert({
    where: { slug: 'womens-clothing' },
    update: {
      name: "Women's Clothing",
      description: "Premium women's clothing — ethnic, western, casual & more",
    },
    create: {
      name: "Women's Clothing",
      slug: 'womens-clothing',
      description: "Premium women's clothing — ethnic, western, casual & more",
    },
  });

  console.log(`✅ Parent: ${parent.name} (slug: ${parent.slug})`);

  // ── 2. Sub-Categories ───────────────────────────────────────────────────────
  const subCategories = [
    // ── ETHNIC WEAR ──
    {
      name: 'Kurti',
      slug: 'kurti',
      description: 'Everyday kurtis in cotton, silk, and georgette. Casual to festive.',
    },
    {
      name: 'Kurti Set',
      slug: 'kurti-set',
      description: 'Matching kurti with dupatta or palazzo pants — complete ethnic sets.',
    },
    {
      name: 'Suit',
      slug: 'suit',
      description: 'Traditional salwar suits — Punjabi, Anarkali, and straight-cut styles.',
    },
    {
      name: 'Salwar Kameez',
      slug: 'salwar-kameez',
      description: 'Classic salwar kameez in every fabric, fit, and occasion.',
    },
    {
      name: 'Sharara',
      slug: 'sharara',
      description: 'Wide-legged Sharara sets for weddings, festivals, and parties.',
    },
    {
      name: 'Gharara',
      slug: 'gharara',
      description: 'Knee-pleated Gharara sets with embroidered kurta tops.',
    },
    {
      name: 'Lehenga',
      slug: 'lehenga',
      description: 'Bridal and festive lehengas with heavy embroidery and zari work.',
    },
    {
      name: 'Lehenga Choli',
      slug: 'lehenga-choli',
      description: 'Full lehenga choli sets including blouse, skirt, and dupatta.',
    },
    {
      name: 'Saree',
      slug: 'saree',
      description: 'Silk, cotton, chiffon, and banarasi sarees for all occasions.',
    },
    {
      name: 'Readymade Saree',
      slug: 'readymade-saree',
      description: 'Pre-stitched and pre-draped sarees — ready to wear in minutes.',
    },
    {
      name: 'Anarkali',
      slug: 'anarkali',
      description: 'Floor-length and knee-length Anarkali suits with flared silhouette.',
    },
    {
      name: 'Palazzo Set',
      slug: 'palazzo-set',
      description: 'Relaxed wide-leg palazzo paired with kurtas and tops.',
    },
    {
      name: 'Patiala Suit',
      slug: 'patiala-suit',
      description: 'Vibrant Patiala salwar suits with pleated bottoms.',
    },
    {
      name: 'Churidar Suit',
      slug: 'churidar-suit',
      description: 'Fitted churidar paired with long kurtas — elegant and sleek.',
    },
    {
      name: 'Dupatta',
      slug: 'dupatta',
      description: 'Standalone dupattas — embroidered, printed, and plain styles.',
    },
    // ── WESTERN WEAR ──
    {
      name: 'Top',
      slug: 'top',
      description: 'Casual and formal tops — crop, peplum, flowy, and fitted styles.',
    },
    {
      name: 'Dress',
      slug: 'dress',
      description: 'Midi, maxi, mini, and bodycon dresses for every occasion.',
    },
    {
      name: 'Co-ord Set',
      slug: 'coord-set',
      description: 'Matching two-piece co-ord sets — trendy and versatile.',
    },
    {
      name: 'Jumpsuit',
      slug: 'jumpsuit',
      description: 'One-piece jumpsuits and playsuits for a put-together look.',
    },
    {
      name: 'Jeans & Trousers',
      slug: 'jeans-trousers',
      description: 'Denim jeans, formal trousers, and relaxed pants.',
    },
    {
      name: 'Skirt',
      slug: 'skirt',
      description: 'Flared, pencil, mini, and maxi skirts for all body types.',
    },
    {
      name: 'Shorts',
      slug: 'shorts',
      description: 'Casual shorts and hot pants for everyday and leisure wear.',
    },
    {
      name: 'Blazer & Jacket',
      slug: 'blazer-jacket',
      description: 'Formal blazers, denim jackets, and shrugs for layering.',
    },
    // ── CASUAL & LOUNGE ──
    {
      name: 'Casual Wear',
      slug: 'casual-wear',
      description: 'Everyday casual clothing — relaxed, comfortable, and stylish.',
    },
    {
      name: 'Loungewear',
      slug: 'loungewear',
      description: 'Comfortable sets for home, sleep, and relaxed days.',
    },
    {
      name: 'Night Suit',
      slug: 'night-suit',
      description: 'Cotton and satin night suits and pyjama sets.',
    },
    {
      name: 'Track Suit',
      slug: 'track-suit',
      description: 'Sporty track suits and active-wear sets.',
    },
    // ── WINTER / SEASONAL ──
    {
      name: 'Sweater & Cardigan',
      slug: 'sweater-cardigan',
      description: 'Warm knitwear — pullovers, cardigans, and turtlenecks.',
    },
    {
      name: 'Winter Suit',
      slug: 'winter-suit',
      description: 'Woollen and warm ethnic suits for winter occasions.',
    },
    // ── BRIDAL / OCCASION ──
    {
      name: 'Bridal Wear',
      slug: 'bridal-wear',
      description: 'Bridal lehengas, sarees, and suits for the big day.',
    },
    {
      name: 'Party Wear',
      slug: 'party-wear',
      description: 'Glam party outfits — sequined, embroidered, and statement styles.',
    },
    {
      name: 'Festive Wear',
      slug: 'festive-wear',
      description: 'Outfits curated for Diwali, Eid, Navratri, and other festivals.',
    },
    {
      name: 'Wedding Guest',
      slug: 'wedding-guest',
      description: 'Elegant and appropriate outfits for attending weddings.',
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const cat of subCategories) {
    try {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          description: cat.description,
          parentId: parent.id,
        },
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          parentId: parent.id,
        },
      });
      console.log(`  ✅ ${cat.name}`);
      created++;
    } catch (err: any) {
      console.warn(`  ⚠️  Skipped ${cat.slug}: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n✨ Done! ${created} categories added/updated, ${skipped} skipped.`);
  console.log(`\n📦 Parent: "${parent.name}" (ID: ${parent.id})`);
  console.log('   All sub-categories are linked as children of this parent.\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
