import fs from "fs";
import path from "path";

const faqsPath = path.join(process.cwd(), "src", "data", "hotelFaqs.json");
const convsPath = path.join(process.cwd(), "src", "data", "trainingConversations.json");

function validateData() {
  console.log("=========================================");
  console.log("VALIDATING HOTEL KNOWLEDGE & TRAINING DATA");
  console.log("=========================================");

  const faqsRaw = fs.readFileSync(faqsPath, "utf-8");
  const faqsData = JSON.parse(faqsRaw);

  let totalFaqs = 0;
  const faqIds = new Set();
  const duplicateFaqIds = [];

  for (const cat of faqsData) {
    for (const faq of cat.faqs) {
      totalFaqs++;
      if (faqIds.has(faq.id)) {
        duplicateFaqIds.push(faq.id);
      }
      faqIds.add(faq.id);
    }
  }

  const missingFaqIds = [];
  for (let i = 1; i <= 50; i++) {
    if (!faqIds.has(i)) missingFaqIds.push(i);
  }

  console.log(`Total FAQ Records Found: ${totalFaqs} (Expected: 50)`);
  console.log(`Duplicate FAQ IDs: ${duplicateFaqIds.length > 0 ? duplicateFaqIds.join(", ") : "None"}`);
  console.log(`Missing FAQ IDs: ${missingFaqIds.length > 0 ? missingFaqIds.join(", ") : "None"}`);

  const convsRaw = fs.readFileSync(convsPath, "utf-8");
  const convsData = JSON.parse(convsRaw);

  let totalConvs = convsData.length;
  const convIds = new Set();
  const duplicateConvIds = [];
  let invalidRoleCount = 0;

  for (const conv of convsData) {
    if (convIds.has(conv.id)) {
      duplicateConvIds.push(conv.id);
    }
    convIds.add(conv.id);

    for (const turn of conv.turns) {
      if (turn.role !== "guest" && turn.role !== "assistant") {
        invalidRoleCount++;
      }
    }
  }

  const missingConvIds = [];
  for (let i = 1; i <= 10; i++) {
    if (!convIds.has(i)) missingConvIds.push(i);
  }

  console.log(`Total Training Conversations Found: ${totalConvs} (Expected: 10)`);
  console.log(`Duplicate Conversation IDs: ${duplicateConvIds.length > 0 ? duplicateConvIds.join(", ") : "None"}`);
  console.log(`Missing Conversation IDs: ${missingConvIds.length > 0 ? missingConvIds.join(", ") : "None"}`);
  console.log(`Invalid Turn Roles Found: ${invalidRoleCount}`);

  if (
    totalFaqs === 50 &&
    missingFaqIds.length === 0 &&
    duplicateFaqIds.length === 0 &&
    totalConvs === 10 &&
    missingConvIds.length === 0 &&
    duplicateConvIds.length === 0 &&
    invalidRoleCount === 0
  ) {
    console.log("STATUS: ALL DATASETS VALIDATED 100% SUCCESSFULLY!");
  } else {
    console.log("STATUS: VALIDATION FAILED — PLEASE FIX DATA ERRORS!");
    process.exit(1);
  }
}

validateData();
