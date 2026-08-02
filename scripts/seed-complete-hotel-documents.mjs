import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { processDocumentBuffer } from "../src/lib/knowledge/documentProcessor.js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwuzlenqmwoppofjwxy.supabase.co";
const serviceKey = process.env.SUPABASE_SECRET_KEY || "";
const client = createClient(url, serviceKey);

const DOC_1_DINING_TEXT = `AURA BOUTIQUE HOTEL & VILLA — GUEST INFORMATION & DINING GUIDE 2026

DOCUMENT SECTION 1: RECEPTION & CHECK-IN POLICIES
Welcome to Aura Boutique Hotel & Villa. Standard check-in time is 3:00 PM and check-out time is 11:00 AM. Reception operates 24 hours daily. Early check-in or late check-out is subject to room availability upon request.

DOCUMENT SECTION 2: GOURMET DINING & RESTAURANT MENU
Our beachfront Ocean Terrace restaurant is open daily for Breakfast (7:00 AM – 10:30 AM), Lunch (12:30 PM – 3:30 PM), and Dinner (7:00 PM – 10:30 PM). 
Sunset Seafood Platter — LKR 6,750. Includes fresh grilled lobster, jumbo prawns, calamari, butter rice, and garlic dip. Serving capacity: Designed for 2 guests.
Grilled Yellowfin Tuna Steak — LKR 4,200. Served with wilted greens, lemon butter sauce, and roasted sweet potatoes.
Traditional Sri Lankan Rice & Curry Feast — LKR 3,800. Choice of chicken, black pork, or fresh lagoon prawn curry accompanied by 5 seasonal vegetable curries and papadum.

DOCUMENT SECTION 3: TRANSPORTATION & AIRPORT TRANSFERS
Private Highway Airport Transfers to/from Bandaranaike International Airport (CMB):
- Private Luxury Car (Up to 3 passengers): LKR 16,500 per way.
- Private VIP Passenger Van (Capacity: Up to 7 passengers): LKR 22,000 per way. All highway tolls and complimentary chilled bottled water included.`;

const DOC_2_WELLNESS_TEXT = `AURA BOUTIQUE HOTEL & VILLA — EXPERIENCES & WELLNESS GUIDE 2026

DOCUMENT SECTION 1: SERENITY SPA & WELLNESS RITUALS
Our beachfront Serenity Spa offers holistic Ayurvedic treatments and luxury wellness therapies daily from 9:00 AM to 8:00 PM.
Serenity Coconut & Sandalwood Ritual — LKR 9,800. Duration: 90 minutes. Includes warm coconut oil massage, sandalwood body polish, herbal steam bath, and fresh king coconut refreshment. Maximum capacity: 2 guests simultaneously in private couple suite.
Deep Tissue Ocean Breeze Massage — LKR 8,500. Duration: 60 minutes. Focuses on muscle tension relief using botanical essential oils.

DOCUMENT SECTION 2: WEEKLY EVENING EXPERIENCES & ENTERTAINMENT
Stargazer Cinema Under the Stars — Every Wednesday at 8:00 PM on the Beach Lawn. Complimentary for in-house guests. Free popcorn and herbal tea provided.
Blue Horizon Acoustic Duo — Every Friday at 6:15 PM on the Sunset Terrace. Live acoustic lounge music overlooking the Indian Ocean. Complimentary entrance for guests.`;

const DOC_3_ADVENTURE_TEXT = `AURA BOUTIQUE HOTEL & VILLA — FAMILY & ADVENTURE GUIDE 2026

DOCUMENT SECTION 1: ADVENTURE & EXCURSIONS
Moonrise Mangrove Safari — LKR 5,500 per person. Duration: 2.5 hours. Capacity: Up to 5 guests per boat. Includes naturalist guide, lantern lighting, bottled water, and binoculars. Features cinnamon island demonstration, water monitor sightings, and sunset birdwatching. Note: Departure times are arranged individually upon booking.
Surfing & Water Sports — Private lessons start at LKR 6,000 per hour including board rental and certified instructor.

DOCUMENT SECTION 2: DAY-OUTING & FAMILY PACKAGES
Aura Signature Dayout Package — LKR 4,500 per adult. Duration: 7 hours (10:00 AM to 5:00 PM). Includes welcome drink, pool access from 10:00 AM to 5:00 PM, 3-course lunch, evening tea with snacks, and changing room access. Children aged 5-10: 50% discount (LKR 2,250). Children under 5: Free.`;

async function seedCompleteDocuments() {
  console.log("=========================================");
  console.log("SEEDING ENHANCED ATTRIBUTE DOCUMENTS INTO SUPABASE");
  console.log("=========================================");

  const { data: prop } = await client.from("properties").select("id").eq("slug", "aura-boutique-hotel").single();
  const propertyId = prop.id;

  const docsToUpload = [
    {
      title: "Aura Boutique Hotel & Villa – Guest Information & Dining Guide 2026",
      filename: "dining_guide_2026.txt",
      category: "menu",
      text: DOC_1_DINING_TEXT,
    },
    {
      title: "Aura Boutique Hotel & Villa - Experiences & Wellness Guide 2026",
      filename: "wellness_guide_2026.txt",
      category: "spa",
      text: DOC_2_WELLNESS_TEXT,
    },
    {
      title: "Aura Boutique Hotel & Villa - Family & Adventure Guide 2026",
      filename: "adventure_guide_2026.txt",
      category: "general",
      text: DOC_3_ADVENTURE_TEXT,
    },
  ];

  for (const doc of docsToUpload) {
    const docId = crypto.randomUUID();
    const storagePath = `${propertyId}/${docId}/${doc.filename}`;
    const buffer = Buffer.from(doc.text, "utf-8");

    // Process chunking
    const procResult = await processDocumentBuffer(buffer, "text/plain", doc.filename);

    console.log(`Uploading Doc: "${doc.title}" (${procResult.chunks.length} chunks)...`);

    // Clean old documents with same title
    const { data: oldDocs } = await client.from("knowledge_documents").select("id").eq("property_id", propertyId).eq("title", doc.title);
    if (oldDocs && oldDocs.length > 0) {
      for (const od of oldDocs) {
        await client.from("knowledge_chunks").delete().eq("document_id", od.id);
        await client.from("knowledge_documents").delete().eq("id", od.id);
      }
    }

    // Insert metadata
    await client.from("knowledge_documents").insert({
      id: docId,
      property_id: propertyId,
      title: doc.title,
      document_type: "txt",
      document_category: doc.category,
      storage_path: storagePath,
      mime_type: "text/plain",
      file_size: buffer.length,
      processing_status: "ready",
      active: true,
      original_filename: doc.filename,
      extracted_character_count: procResult.extractedCharacterCount,
      processed_at: new Date().toISOString(),
    });

    // Insert chunks
    const chunksToInsert = procResult.chunks.map((c) => ({
      document_id: docId,
      property_id: propertyId,
      chunk_index: c.chunkIndex,
      content: c.content,
      chunk_hash: c.chunkHash,
      document_category: doc.category,
    }));

    await client.from("knowledge_chunks").insert(chunksToInsert);
    console.log(` -> Successfully seeded "${doc.title}" with ${chunksToInsert.length} active ready chunks!`);
  }

  console.log("\n=========================================");
  console.log("ENHANCED ATTRIBUTE SEEDING COMPLETE!");
  console.log("=========================================");
}

seedCompleteDocuments();
