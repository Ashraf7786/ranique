import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    city: "Mumbai, Maharashtra",
    rating: 5,
    product: "Rose Glow Lip Serum",
    content: "Yaar ye lip serum toh kamaal ka hai! 😍 Maine pehle socha tha ki itna costly kyun hai, but trust me — bilkul paisa vasool! Lips itne soft ho gaye hain, aur glow bhi aata hai. Meri saheliyaan bhi order kar rahi hain ab!",
  },
  {
    name: "Sunita Devi",
    city: "Jaipur, Rajasthan",
    rating: 5,
    product: "Gold Crystal Bangles",
    content: "बहुत ही सुंदर चूड़ियाँ हैं! शादी में पहनकर गई तो सबने पूछा कहाँ से लिया। सोने जैसी चमक है और बहुत हल्की भी हैं। पैकेजिंग भी बहुत अच्छी थी, बिल्कुल gift जैसी। Ranique se bahut khush hoon! ⭐⭐⭐⭐⭐",
  },
  {
    name: "Roshni Patel",
    city: "Surat, Gujarat",
    rating: 5,
    product: "Velvet Crossbody Purse",
    content: "Omg this purse is EVERYTHING! College ke liye perfect size hai aur velvet material toh ekdum premium feel deta hai. Delivery bhi 2 din mein aa gayi — I was shocked! Definitely mera favourite online store ban gaya hai Ranique. 💜",
  },
  {
    name: "Meenakshi Iyer",
    city: "Chennai, Tamil Nadu",
    rating: 5,
    product: "Pearl Drop Earrings",
    content: "इतनी सुंदर बालियाँ! मैंने अपनी बेटी की सगाई के लिए खरीदी थीं। सबने तारीफ की। Quality देखकर लगा hi नहीं कि इतने कम दाम में मिली हैं। बिल्कुल असली मोतियों जैसी लगती हैं। Next order already kar diya hai! 🙏",
  },
  {
    name: "Anjali Verma",
    city: "Lucknow, UP",
    rating: 5,
    product: "Illuminating Highlighter",
    content: "Bhai kya highlighter hai yaar! 😭✨ Skin pe lagao toh literally glow karna shuru ho jaati ho. Office mein meri colleague ne pucha 'kya tum facials karwa ke aati ho?' — maine sirf ye highlighter lagaya tha lol. Ranique is QUEEN!",
  },
  {
    name: "Kavita Rajput",
    city: "Bhopal, MP",
    rating: 5,
    product: "Embroidered Tote Bag",
    content: "बैग देखकर दिल खुश हो गया! 😊 कढ़ाई का काम इतना बारीक है — लगता है किसी कारीगर ने हाथ से बनाया हो। Size भी बड़ा है, office का सारा सामान आ जाता है। दाम भी वाजिब हैं। पक्का फिर से मँगाऊँगी!",
  },
  {
    name: "Divya Nair",
    city: "Kochi, Kerala",
    rating: 5,
    product: "Rose Gold Headband",
    content: "Yeh headband toh meri bestie ban gayi hai 😂 Har outfit ke saath match ho jaata hai. College, parties, everywhere I wear it. Quality ekdum top-notch hai aur itne affordable price mein? Ranique you are amazing! Will always shop from here. 🌹",
  },
  {
    name: "Fatima Siddiqui",
    city: "Hyderabad, Telangana",
    rating: 5,
    product: "Premium Fragrance Mist",
    content: "Mashallah kya fragrance hai! 🌸 Subah lagao toh shaam tak rehta hai. Itni meheki rehti hoon ki log poochte hain 'kaunsa perfume hai?' — bada wala flaunt moment hota hai. Packaging gift dene ke liye perfect hai. 5 stars se bhi zyada dena chahti hoon!",
  },
];

async function main() {
  console.log("Seeding testimonials...");
  let count = 0;
  for (const t of TESTIMONIALS) {
    await prisma.testimonial.create({
      data: {
        name: t.name,
        city: t.city,
        rating: t.rating,
        product: t.product,
        content: t.content,
        status: "PUBLISHED",
      },
    });
    count++;
  }
  console.log(`Successfully seeded ${count} testimonials!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
