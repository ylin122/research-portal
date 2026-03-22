require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

(async () => {
  // Rename company
  await sb.from('companies').update({ name: 'Imagine Learning' }).eq('id', 'weldnorth_seed');
  console.log('Renamed to Imagine Learning');

  const fields = {
    overview: `• Private K-12 digital curriculum and edtech company — provides adaptive learning software, digital courseware, and supplemental instruction for K-12 schools across literacy, math, and language development
• Originally founded as Imagine Learning in 2004 in Provo, UT; focused on English language learner (ELL) software
• Acquired by Weld North Education in 2020; Weld North subsequently sold Imagine Learning to Bain Capital in Jun 2023 for a reported ~$1.4-1.7B
• Currently owned by Bain Capital (since Jun 2023)
• CEO Jonathan Grayer (former CEO of Kaplan)
• ~2,500+ employees; headquartered in Scottsdale, AZ
• Serves ~15M+ students across 7,500+ school districts in all 50 states
• Product portfolio built through aggressive M&A: core Imagine Learning (ELL and literacy), Imagine Math (adaptive math), LearnZillion/Illustrative Mathematics (open-source math curriculum), and Traverse (science curriculum)
• Recognized as one of the largest K-12 edtech companies in the US by student reach
• Revenue estimated at $500-700M; predominantly SaaS subscription from school district contracts`,

    products: `• Revenue model: SaaS subscription — annual or multi-year contracts with school districts priced per-student or per-school. High renewal rates driven by ESSA evidence requirements and academic year planning cycles. Federal Title I, Title III, and ESSER funds are major funding sources
• Imagine Language & Literacy: Adaptive literacy program for PreK-8 — originally designed for English language learners (ELLs) but expanded to all students. Uses adaptive technology to personalize instruction in reading, writing, listening, and speaking. ESSA Tier 1 evidence rating in multiple categories
• Imagine Math (formerly Think Through Math): Adaptive math instruction and practice for grades 3-12. Combines software-based lessons with live, certified math teachers available for virtual tutoring. One of the few adaptive math products with embedded live teacher support
• Imagine Math Facts: Gamified math fluency practice — basic fact automaticity for elementary students
• Illustrative Mathematics (IM) / LearnZillion: High-quality, open-source math curriculum (K-12) that Imagine Learning distributes and supports. IM is one of the top-rated math curricula by EdReports. The acquisition of LearnZillion (which had exclusive digital rights to IM curriculum) was strategically important
• Twig Science / Twig Education: NGSS-aligned science curriculum for K-8. Acquired to expand beyond literacy and math into science
• Imagine Espanol: Spanish language arts program — serves dual-language and bilingual education programs
• Customers buy because: Schools need evidence-based, adaptive digital programs that demonstrably improve student outcomes in literacy and math. Federal funding (Title I, Title III, ESSER) requires evidence-based interventions — Imagine Learning's ESSA evidence ratings make it eligible for these funds. ELL population growth across the US drives demand for the literacy products specifically`,

    customers: `• Core customer profile: US K-12 school districts — public school systems purchasing supplemental and core digital curriculum
• ~15M+ students served across 7,500+ school districts in all 50 states — massive installed base
• Key segments: English language learners (ELL — the original core market), Title I schools (low-income student populations), intervention programs (students below grade level), and increasingly core curriculum adoption (IM math)
• Strongest in elementary and middle school (PreK-8) though expanding into high school
• Geography: 100% US K-12 education; some international presence but minimal
• Buying drivers: ESSA evidence requirements (schools must use evidence-based programs to access federal funds), growing ELL populations (fastest-growing student demographic in US K-12), post-COVID learning loss remediation, and the shift from print textbooks to digital adaptive curriculum
• Federal funding is critical — Title I ($18B+ annually), Title III (ELL-specific), and ESSER/COVID relief funds have been major purchase drivers`,

    industry: `• K-12 digital curriculum and supplemental instruction market estimated at ~$8-12B in 2025, growing at ~10-14% CAGR
• Adaptive learning software specifically is ~$3-5B and growing faster at ~15-20% CAGR
• Imagine Learning at ~$500-700M revenue is among the top 5 K-12 edtech companies in the US by student reach
• Tailwind — ESSA evidence requirements: Federal education law requires evidence-based programs for federal funding eligibility. Imagine Learning has strong ESSA ratings across multiple products, creating a competitive moat. Time horizon: Permanent (embedded in law)
• Tailwind — ELL population growth: English language learner enrollment is growing 2-3% annually — the fastest-growing student demographic. Imagine Learning's ELL heritage positions it well. Time horizon: 10+ years
• Tailwind — Post-COVID learning loss: Students lost 1-2 years of learning during the pandemic. Intervention and remediation spending remains elevated. Time horizon: 3-5 years
• Tailwind — Core curriculum digital shift: IM/Illustrative Mathematics adoption is growing as districts replace print math textbooks with digital curriculum. Time horizon: 5-10 years
• Headwind — ESSER cliff: COVID relief funds (ESSER) expired in Sep 2024. Districts that used ESSER to purchase Imagine Learning now face budget pressure to sustain subscriptions from regular budgets. Time horizon: 1-3 years of adjustment
• Headwind — Competition from free/state content: Some states provide free digital curriculum and assessments, reducing the addressable market. Time horizon: Ongoing
• Market growth (5yr): K-12 edtech grew at ~12-16% CAGR, boosted by COVID. Post-ESSER normalization is ~8-12% CAGR (estimates)`,

    competitive: `• Curriculum Associates (i-Ready): Most direct competitor — i-Ready combines diagnostic assessment with adaptive instruction in reading and math. Dominant in K-8 assessment-driven instruction. Competes head-to-head with Imagine Math and Imagine Literacy
• Renaissance Learning (Star + Freckle): Star Assessments for benchmarking + Freckle for adaptive practice. Different model (assessment-first vs. Imagine's instruction-first) but overlapping budgets
• Lexia Learning (Cambium/Veritas): Reading intervention software — competes directly with Imagine Language & Literacy for ELL and literacy intervention dollars. Strong evidence base
• DreamBox Learning (Discovery Education): Adaptive math — competes with Imagine Math. Acquired by Discovery Education in 2022
• McGraw Hill, HMH, Savvas: Large publishers with digital curriculum. More focused on core textbook replacement; Imagine Learning stronger in supplemental and adaptive intervention
• Amplify: Digital-first K-12 curriculum — strong in science (Amplify Science) and growing in ELA/reading
• Competitive advantage: ESSA Tier 1 evidence ratings across multiple products (literacy, math) — this is the key competitive moat because federal funding eligibility depends on evidence ratings. ELL heritage gives Imagine Learning unique credibility in the fastest-growing student demographic. The IM/Illustrative Mathematics curriculum is one of the highest-rated by EdReports, giving Imagine a core curriculum play alongside supplemental products. Adaptive technology with live teacher support (Imagine Math) is differentiated
• Best at: ELL and literacy intervention (founding expertise), adaptive math with live teachers, ESSA evidence ratings, and district-level scale
• Worst at: Assessment (Renaissance and Curriculum Associates are stronger), core ELA curriculum (HMH and Amplify are ahead), and brand clarity (multiple product names from acquisitions create confusion)
• Biggest threat (3yr): ESSER cliff causing district budget pressure and non-renewals. Curriculum Associates (i-Ready) consolidating the assessment + instruction market. Also, AI-native adaptive learning startups could leapfrog current technology
• Largest opportunity (3yr): IM/Illustrative Mathematics becoming a top-3 adopted core math curriculum nationally — this would transform Imagine Learning from a supplemental player to a core curriculum platform. The ELL market tailwind is structural and long-term`,

    transactions: `• Jun 2023: Bain Capital acquired Imagine Learning from Weld North Education for a reported ~$1.4-1.7B. Bain's thesis centers on the growing K-12 digital curriculum market, ESSA evidence moat, and platform consolidation
• 2022: Acquired Twig Education (science curriculum) — expanded beyond literacy and math into NGSS-aligned science
• 2021: Acquired LearnZillion (which held exclusive digital distribution rights for Illustrative Mathematics curriculum) — the most strategically important acquisition. Gave Imagine Learning a top-rated core math curriculum
• 2020: Weld North Education acquired Imagine Learning and began the roll-up strategy
• 2019: Imagine Learning merged with Think Through Math (renamed Imagine Math) — combined the literacy and math product lines
• Key context: Bain Capital at ~3 years of ownership — early in the hold period. The integration of multiple acquired products into a cohesive platform is the near-term execution challenge. The ESSER cliff creates a renewal risk that Bain needs to manage through the 2025-2026 budget transition`,
  };

  for (const [key, text] of Object.entries(fields)) {
    const { error } = await sb.from('company_fields').upsert({
      company_id: 'weldnorth_seed', field_key: key, text, date: '2026-03-21T00:00:00Z'
    }, { onConflict: 'company_id,field_key' });
    if (error) console.error(`Field ${key} error:`, error);
    else console.log(`  ${key} updated`);
  }

  // Replace notes
  await sb.from('company_notes').delete().eq('company_id', 'weldnorth_seed');
  const notes = [
    { id: 'il1', text: "Bain Capital acquiring Imagine Learning from Weld North for ~$1.4-1.7B is a bet on the structural growth of K-12 adaptive learning. The ESSA evidence moat is real — schools cannot use federal funds on products without evidence ratings, and building Tier 1 evidence takes years of randomized controlled trials. This creates a genuine barrier to entry. The near-term risk is the ESSER cliff — districts that funded Imagine Learning with COVID relief money must now find room in regular budgets. Watch renewal rates in 2025-2026 as the leading indicator.", date: '2026-03-21T00:00:00Z' },
    { id: 'il2', text: "The Illustrative Mathematics acquisition (via LearnZillion) is the most strategically important move. IM is one of the top-rated math curricula by EdReports and is being adopted as core curriculum by districts nationally. This transforms Imagine Learning from a supplemental/intervention vendor (nice-to-have) into a core curriculum platform (must-have). Core curriculum contracts are larger, longer-term, and more deeply embedded than supplemental subscriptions. If IM adoption accelerates, it fundamentally changes the revenue quality and growth trajectory.", date: '2026-03-21T00:00:00Z' },
    { id: 'il3', text: "The product portfolio is the integration challenge. Imagine Learning has assembled multiple products (Literacy, Math, IM, Twig Science, Espanol) through serial M&A. Each has different technology stacks, user experiences, and go-to-market motions. Bain needs to integrate these into a cohesive platform with unified analytics, single sign-on, and cross-product data sharing. If they succeed, the platform becomes stickier and the cross-sell opportunity is powerful. If they fail, it remains a collection of point products competing independently.", date: '2026-03-21T00:00:00Z' }
  ];
  for (const note of notes) {
    await sb.from('company_notes').upsert({ id: note.id, company_id: 'weldnorth_seed', text: note.text, date: note.date }, { onConflict: 'id' });
  }

  console.log('\nDone — Imagine Learning fully updated.');
})();
