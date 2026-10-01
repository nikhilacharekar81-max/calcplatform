import express, { Request, Response } from 'express';
import compression from 'compression';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { DatabaseSchema, Category, Subcategory, Calculator, SiteSettings } from './src/types/schema.ts';

dotenv.config();

const app = express();
app.use(compression());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultSettings: SiteSettings = {
  siteTitle: 'CalcPlatform - Global Calculator Platform',
  siteDescription: 'Production-ready global calculator directory and engine with clean, high-precision calculation tools.',
  siteKeywords: 'calculators, online tools, finance, math, health, conversion, physics, science, engineering',
  brandName: 'CalcPlatform',
  adminUsername: 'admin',
  adminPasswordHash: 'admin123',
  footerNotice: '© CalcPlatform. All calculations are provided for informational and educational purposes.',
  canonicalBaseUrl: 'https://calcplatform.org',
  contactEmail: 'admin@calcplatform.org',
};

const defaultPosts: any[] = [
  {
    id: "post_1790755772368",
    slug: "national-means-cum-merit-scholarship-scheme",
    title: "National Means-cum-Merit Scholarship Scheme (NMMSS)",
    excerpt: "Complete guide on National Means-cum-Merit Scholarship Scheme (NMMSS) for Class 8 students, eligibility, exam syllabus, and NSP application process.",
    content: "<h1>National Means-cum-Merit Scholarship Scheme (NMMSS)</h1><p>The <strong>National Means-cum-Merit Scholarship Scheme (NMMSS)</strong> is a Centrally Sponsored Scheme aimed at providing financial support to meritorious students from economically weaker sections to arrest their drop-out rate at Class 8 and encourage them to continue study at secondary stage.</p><p>Under this scheme, scholarships of <strong>₹12,000 per annum</strong> (₹1,000 per month) are awarded to selected students of Class 9 every year and their continuation/renewal in Classes 10, 11 and 12 for study in State Government, Government-aided and Local body schools.</p><h2>Key Highlights &amp; Eligibility Criteria</h2><ul><li><strong>Target Group:</strong> Students studying as regular students in Class 8 in Government, Local Body and Government-aided schools.</li><li><strong>Family Income Limit:</strong> Parental income from all sources should not be more than <strong>₹3,50,000 per annum</strong>.</li><li><strong>Minimum Marks:</strong> The student must have secured at least 55% marks or equivalent grade in Class 7 examination (5% relaxation for SC/ST students).</li><li><strong>Scholarship Amount:</strong> ₹12,000 per year (₹1,000 per month) paid directly via Direct Benefit Transfer (DBT).</li></ul><h2>Selection Examination Structure</h2><p>Selection of students for the award of scholarship under the scheme is made through an examination conducted by the State/UT Governments consisting of two tests:</p><ol><li><strong>Mental Ability Test (MAT):</strong> Consisting of 90 multiple-choice questions testing reasoning and critical thinking.</li><li><strong>Scholastic Aptitude Test (SAT):</strong> Consisting of 90 multiple-choice questions covering Science, Social Studies, and Mathematics taught in Classes 7 and 8.</li></ol><h2>How to Apply on National Scholarship Portal (NSP)</h2><p>Eligible students can apply online through the official <a href=\"https://scholarships.gov.in\" target=\"_blank\" rel=\"noopener noreferrer\">National Scholarship Portal (NSP)</a> following the One-Time Registration (OTR) procedure.</p>",
    featuredImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    category: "Education",
    tags: ["NMMSS", "Scholarship", "NSP", "Class 8"],
    author: {
      name: "CA Rajesh Sharma",
      role: "Senior Tax Consultant",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Practicing Chartered Accountant specializing in direct taxation."
    },
    status: "published",
    publishedAt: "2026-09-30T08:30:00.000Z",
    updatedAt: "2026-09-30T08:30:00.000Z",
    readTimeMinutes: 5,
    views: 24,
    isFeatured: true,
    seoTitle: "National Means-cum-Merit Scholarship Scheme (NMMSS) Guide",
    seoDescription: "Complete guide on NMMSS scholarship eligibility, exam pattern, NSP registration, and Renewal process.",
    seoKeywords: ["nmmss", "scholarship", "nsp portal", "means cum merit"],
    embeddedCalculators: []
  },
  {
    id: "post_1790755772367",
    slug: "pm-usp-central-sector-scheme-of-scholarship-for-college-and-university-students-csss",
    title: "PM-USP Central Sector Scheme of Scholarship for College and University Students (CSSS)",
    excerpt: "Financial assistance guide for college and university students under the PM-USP Central Sector Scheme of Scholarship (CSSS).",
    content: "<h1>PM-USP Central Sector Scheme of Scholarship for College and University Students (CSSS)</h1><p>Paying for college is not easy. Apart from tuition fees, students and their families may have to manage hostel expenses, books, travel, food, study materials and other day-to-day costs.</p><p>The <strong>PM-USP Central Sector Scheme of Scholarship for College and University Students (CSSS)</strong> is a Central Government scholarship designed to provide financial support to meritorious students pursuing higher education.</p><p>For students who meet the eligibility conditions, this scholarship can provide useful financial assistance during their college or university studies.</p><p>The important thing to remember is that this is a <strong>merit-based scholarship</strong>, and simply passing Class 12 does not automatically mean that a student will receive it. Students have to meet the scheme's eligibility requirements and apply through the <strong>National Scholarship Portal (NSP)</strong>.</p><p>For the <strong>2026–27 academic year</strong>, the scheme is listed on the National Scholarship Portal. NSP currently shows the renewal application window for PM-USP CSSS.</p><blockquote><p><strong>Important:</strong> Government scholarship rules, dates, eligibility conditions and application windows can change. Always check the latest information on the National Scholarship Portal and Ministry of Education before applying.</p></blockquote><h2>What is the PM-USP Central Sector Scheme of Scholarship?</h2><p>The PM-USP Central Sector Scheme of Scholarship for College and University Students is a scholarship scheme administered by the <strong>Department of Higher Education, Ministry of Education, Government of India</strong>.</p><p>The basic idea is simple: students who perform well academically and meet the prescribed family-income and other conditions may receive financial assistance for higher education.</p><p>The scholarship is intended for students pursuing <strong>regular degree courses</strong> in eligible colleges and institutions.</p><p>It is not meant to replace the entire cost of education. Instead, it provides financial support that can help reduce some of the pressure on students and their families.</p><p>The scholarship is applied for through the <strong>National Scholarship Portal (NSP)</strong> rather than by sending an application directly to the Ministry of Education.</p><h2>Is PM-USP CSSS active for 2026–27?</h2><p>Yes.</p><p>The National Scholarship Portal currently lists the <strong>PM-USP – Central Sector Scheme Of Scholarship For College And University Students (CSSS)</strong> under its merit-based schemes for <strong>Academic Year 2026–27</strong>.</p><p>The NSP currently displays:</p><ul><li><p>Scheme: PM-USP Central Sector Scheme of Scholarship for College and University Students</p></li><li><p>Academic year: <strong>2026–27</strong></p></li><li><p>Scheme type: <strong>Merit Based</strong></p></li><li><p>Portal opening: <strong>1 June 2026</strong></p></li><li><p>Current displayed renewal student-application deadline: <strong>30 September 2026</strong></p></li><li><p>Defective application verification: <strong>15 October 2026</strong></p></li><li><p>Institute verification: <strong>15 October 2026</strong></p></li><li><p>DNO/SNO/MNO verification: <strong>30 October 2026</strong></p></li></ul><p>These dates are the dates currently displayed by NSP and should be checked again before submitting an application because government portals can update schedules.</p><h1>How much scholarship does a student receive?</h1><p>According to the Ministry of Education's PM-USP CSSS FAQ, the scholarship rate is:</p><table><thead><tr><th>Level of study</th><th align=\"right\">Scholarship amount</th></tr></thead><tbody><tr><td>Graduation – first 3 years</td><td align=\"right\">₹12,000 per year</td></tr><tr><td>Post-Graduation</td><td align=\"right\">₹20,000 per year</td></tr><tr><td>Technical courses – 4th and 5th year, where applicable</td><td align=\"right\">₹20,000 per year</td></tr></tbody></table><p>For students pursuing <strong>B.Tech/BE</strong>, the Ministry's FAQ states that the scholarship is available for four years: ₹12,000 per year for the first three years and ₹20,000 in the fourth year.</p><p>The exact duration and amount applicable to an individual student depend on the course and the scheme conditions.</p><h3>What does ₹12,000 per year actually mean?</h3><p>It works out to an average of ₹1,000 per month if you simply divide the annual amount by 12.</p><p>However, students should not assume that the Government will necessarily transfer ₹1,000 every month.</p><p>The scholarship is an <strong>annual scholarship amount</strong>, and payment is made through the prescribed government payment process.</p><p>So, think of ₹12,000 as annual financial assistance rather than a guaranteed monthly allowance.</p><h1>Who can apply for PM-USP CSSS?</h1><p>The scheme has several eligibility conditions.</p><p>According to the Ministry of Education's published guidelines, students generally need to satisfy conditions relating to academic performance, course type, institution, family income and other scholarship benefits.</p><p>Some important conditions include:</p><h3>1. You must be pursuing an eligible regular course</h3><p>The guidelines specify that the student should be pursuing a <strong>regular degree course</strong>.</p><p>Students pursuing correspondence or distance-mode courses are not covered under this condition, and diploma courses are excluded from this scheme.</p><p>This distinction is important.</p><p>For example, a student should not assume that simply being enrolled in any higher-education programme automatically makes them eligible.</p><p>The course and institution need to satisfy the scheme requirements.</p><h3>2. Your institution must be recognised</h3><p>The scheme guidelines require students to study at eligible colleges or institutions recognised by the relevant regulatory authorities.</p><p>Before applying, students should therefore check whether their college and course information is correctly available in the National Scholarship Portal.</p><p>If the institution information shown in NSP is incorrect or missing, it is better to resolve the issue with the institution's scholarship/nodal officer rather than submitting an application with incorrect details.</p><h3>3. Family income matters</h3><p>The published PM-USP CSSS guidelines specify a <strong>gross parental/family income ceiling of ₹4.5 lakh per year</strong> for eligibility under the scheme.</p><p>This is an important condition that students should not overlook.</p><p>A student may have strong academic marks but still not qualify if the family's income is above the applicable limit.</p><p>For fresh applicants, the guidelines state that an income certificate is required.</p><h3>4. You generally cannot take another scholarship at the same time</h3><p>The PM-USP CSSS guidelines state that students should not be receiving another scholarship scheme, including applicable State-run scholarship schemes, fee-waiver or reimbursement benefits covered by the scheme's conditions.</p><p>This is one area where students should be particularly careful.</p><p>Do not assume that you can accept every scholarship for which you qualify.</p><p>Before applying, check the rules of both schemes and understand whether receiving another scholarship or fee reimbursement would make you ineligible for PM-USP CSSS.</p><h1>How are students selected?</h1><p>PM-USP CSSS is not simply a first-come-first-served scholarship.</p><p>It is a <strong>merit-based scheme</strong>.</p><p>The Ministry's guidelines provide for selection based on the prescribed merit process, with allocation across states/UTs and reservation according to the applicable Central Reservation Policy.</p><p>The guidelines mention reservation provisions including:</p><ul><li><p>15% for SC students</p></li><li><p>7.5% for ST students</p></li><li><p>27% for OBC students</p></li><li><p>5% horizontal reservation for students with benchmark disabilities</p></li></ul><p>These are subject to the scheme's applicable rules and overall conditions.</p><p>Therefore, getting good marks is important, but it does not mean every student with a particular percentage will automatically receive the scholarship.</p><h1>Do I have to apply every year?</h1><p>This is a very important question.</p><p>A student selected for PM-USP CSSS in the first year can continue to receive the scholarship through <strong>renewal</strong>, provided the student continues to satisfy the renewal conditions.</p><p>The Ministry's FAQ says the scholarship is renewable year by year, subject to the prescribed conditions.</p><p>So there are two different situations:</p><p><strong>Fresh application:</strong><br>You are applying for the scholarship for the first time.</p><p><strong>Renewal application:</strong><br>You have already been selected and are applying to continue the scholarship in the next eligible year.</p><p>Do not confuse the two.</p><h1>What are the renewal conditions?</h1><p>Renewal is not automatic.</p><p>The Ministry's published FAQ states that students must:</p><ul><li><p>Secure at least <strong>50% marks</strong> in the annual examination.</p></li><li><p>Maintain at least <strong>75% attendance</strong>.</p></li><li><p>Continue to satisfy the applicable scholarship conditions.</p></li><li><p>Not receive another scholarship in a manner that makes them ineligible.</p></li></ul><p>The guidelines also state that complaints involving indiscipline or criminal behaviour, including ragging, can result in forfeiture of the scholarship.</p><p>This means a student should not think:</p><blockquote><p>\"I received the scholarship once, so I will definitely receive it every year.\"</p></blockquote><p>You need to continue meeting the renewal requirements.</p><h1>What happens if I forget to apply for renewal?</h1><p>Missing a renewal application does not necessarily mean the opportunity is permanently lost.</p><p>The PM-USP CSSS guidelines state that students who missed applying for renewal online on NSP may be allowed to apply for renewal in a subsequent year if they fulfil the renewal eligibility conditions.</p><p>However, students should <strong>not deliberately wait</strong>.</p><p>The safer approach is to apply within the applicable NSP window every year.</p><p>Government portals have deadlines, and verification by institutions and authorities also takes time.</p><h1>How do I apply for PM-USP CSSS?</h1><p>The application is made online through the <strong>National Scholarship Portal</strong>.</p><p>The basic process is:</p><h3>Step 1: Complete One Time Registration</h3><p>NSP currently requires a <strong>One Time Registration (OTR)</strong> for scholarship applications.</p><p>The OTR is a unique number associated with the student's scholarship applications during their academic career.</p><h3>Step 2: Log in to NSP</h3><p>Use your OTR details to access the scholarship application system.</p><h3>Step 3: Find PM-USP CSSS</h3><p>Select the PM-USP Central Sector Scheme of Scholarship for College and University Students.</p><h3>Step 4: Enter your information carefully</h3><p>You may need to provide information relating to:</p><ul><li><p>Personal details</p></li><li><p>Academic details</p></li><li><p>College/institution</p></li><li><p>Course</p></li><li><p>Family income</p></li><li><p>Bank account</p></li><li><p>Aadhaar-related information</p></li><li><p>Other required documents</p></li></ul><h3>Step 5: Check everything before submitting</h3><p>A small mistake in your bank account, academic details, college information or other important information can create problems during verification.</p><p>Do not rush through the application just because the form is online.</p><h3>Step 6: Submit before the deadline</h3><p>Always check the current deadline displayed on NSP rather than relying on an old article, social-media post or YouTube video.</p><h1>Why is OTR important?</h1><p>The National Scholarship Portal says that OTR is mandatory for applying for scholarships from the applicable academic years.</p><p>NSP describes OTR as a unique 14-digit number issued based on Aadhaar/Aadhaar Enrolment ID and applicable throughout the student's academic career.</p><p>This means students should keep their OTR details safe.</p><p>Do not create unnecessary duplicate registrations.</p><h1>What documents may be required?</h1><p>The exact documents can depend on the application type and information requested by NSP.</p><p>Students should keep commonly required information and documents ready, such as:</p><ul><li><p>Aadhaar-related details</p></li><li><p>Academic marksheets</p></li><li><p>Family income certificate, where required</p></li><li><p>Bank account details</p></li><li><p>College/institution details</p></li><li><p>Course and admission details</p></li><li><p>Other documents requested by NSP</p></li></ul><p>For fresh applicants, the PM-USP guidelines specifically state that an income certificate is required.</p><p>Always follow the document list shown in the current NSP application rather than relying only on a third-party checklist.</p><h1>How is the scholarship paid?</h1><p>The scholarship is disbursed through <strong>Direct Benefit Transfer (DBT)</strong>.</p><p>The Ministry's FAQ explains that the scholarship is transferred directly to the beneficiary's bank account through the government payment system, and the Aadhaar-seeded bank account is used for the payment process.</p><p>This is why students should pay attention to their bank details.</p><p>If the application contains an incorrect or inactive bank account, or if there is an issue with Aadhaar seeding, payment can be affected.</p><h1>How can I check my scholarship payment?</h1><p>The Ministry's FAQ says students can track payment through the <strong>Public Financial Management System (PFMS)</strong> using the payment-status facility.</p><p>Students can also check their scholarship application status through NSP using their login credentials.</p><p>If the payment shows as successful but the money has not appeared in the expected account, check which bank account was Aadhaar-seeded and used for the transaction.</p><h1>What if I change my college?</h1><p>Changing college does not necessarily mean that the scholarship must immediately end.</p><p>The PM-USP CSSS guidelines state that a student changing their college or institute may continue/renew the scholarship if the course and institution meet the applicable requirements, including having a valid AISHE Code.</p><p>This is particularly useful for students who change institutions during their studies.</p><p>However, the new college should satisfy the scheme's conditions.</p><p>If you change college, do not simply assume that the scholarship record will automatically update. Check the NSP information and speak to the appropriate scholarship/nodal officer if anything needs correction.</p><h1>What is the maximum duration of the scholarship?</h1><p>The Ministry's FAQ states that a student can receive the scholarship for a <strong>total duration not exceeding five years</strong>, subject to the applicable course and renewal conditions.</p><p>The actual period depends on the student's course.</p><p>For example, B.Tech/BE students have a specific four-year scholarship structure described in the Ministry's FAQ.</p><p>Therefore, students should not assume that every undergraduate course automatically receives five years of scholarship.</p><h1>A simple example</h1><p>Suppose a student qualifies for the PM-USP CSSS and receives ₹12,000 per year during the eligible first three years of graduation.</p><p>The calculation would be:</p><p><strong>Year 1:</strong> ₹12,000<br><strong>Year 2:</strong> ₹12,000<br><strong>Year 3:</strong> ₹12,000</p><p>Total over three years:</p><p><strong>₹36,000</strong></p><p>If the student later becomes eligible for the ₹20,000 rate applicable to their course and year of study, the amount can be different.</p><p>This example is only to explain how the annual scholarship amounts work. The actual amount received depends on the student's course, year and continued eligibility.</p><h1>Can this scholarship pay my entire college fees?</h1><p>No.</p><p>Students should not think of PM-USP CSSS as a full replacement for college fees.</p><p>The scholarship is financial assistance.</p><p>For example, if your annual college expenses are ₹1,00,000 and your scholarship is ₹12,000, you still have to arrange the remaining amount through your family resources, education loan, other eligible support or other permitted sources.</p><p>This is why it is better to treat the scholarship as <strong>help with education expenses</strong>, rather than assuming that the scholarship will cover the complete cost of studying.</p><h1>What should parents and students check before applying?</h1><p>Before submitting an application, take a few minutes to check the basics.</p><h3>Check 1: Family income</h3><p>Make sure the income information and certificate meet the scheme requirements.</p><h3>Check 2: College</h3><p>Confirm that your college/institution is eligible and correctly listed.</p><h3>Check 3: Course</h3><p>Make sure your course is an eligible regular degree course.</p><h3>Check 4: Other scholarships</h3><p>Check whether you are already receiving another scholarship, fee waiver or reimbursement that could affect your eligibility.</p><h3>Check 5: Bank account</h3><p>Make sure your bank details are correct and that the account can receive DBT.</p><h3>Check 6: Aadhaar</h3><p>Check the Aadhaar-related requirements and bank seeding information applicable to your application.</p><h3>Check 7: Marks and attendance</h3><p>Renewal students should keep an eye on the minimum academic and attendance requirements.</p><h3>Check 8: Deadline</h3><p>Do not wait until the final day.</p><p>A technical problem, document problem or verification issue can take time to resolve.</p><h1>Common mistakes students should avoid</h1><p>Many scholarship problems are not caused by complicated rules. They happen because small details are ignored.</p><h3>Mistake 1: Using an old deadline</h3><p>Scholarship dates change.</p><p>A website published last year may show a deadline that no longer applies.</p><h3>Mistake 2: Entering incorrect bank details</h3><p>Even a small mistake in the account number or other banking information can create payment problems.</p><h3>Mistake 3: Assuming selection is automatic</h3><p>Good marks alone do not guarantee the scholarship.</p><p>The student must satisfy all applicable conditions and go through the prescribed application and verification process.</p><h3>Mistake 4: Forgetting renewal</h3><p>Existing beneficiaries must follow the renewal process.</p><p>Do not assume that last year's approval automatically continues.</p><h3>Mistake 5: Ignoring attendance</h3><p>For renewal, the Ministry's guidelines specify at least 75% attendance.</p><h3>Mistake 6: Applying for multiple scholarships without checking the rules</h3><p>Receiving another scholarship or fee benefit can affect eligibility.</p><p>Check the rules before accepting another benefit.</p><h3>Mistake 7: Waiting for the last day</h3><p>If your application has an error, you may need your college or another authority to correct or verify information.</p><p>Starting early gives you more time to deal with problems.</p><h1>What if my application is rejected?</h1><p>Do not immediately assume that the rejection means you can never receive the scholarship.</p><p>First, check the reason shown in the application or verification status.</p><p>Possible problems can relate to:</p><ul><li><p>Eligibility</p></li><li><p>Academic information</p></li><li><p>Income information</p></li><li><p>Bank details</p></li><li><p>Aadhaar-related information</p></li><li><p>Institution verification</p></li><li><p>Missing or incorrect information</p></li><li><p>Other scheme conditions</p></li></ul><p>If the issue involves your college or institution, contact the appropriate scholarship/nodal officer.</p><p>For technical or portal-related issues, use the official NSP support and grievance mechanisms.</p><p>Do not pay an unknown person who promises to \"approve\" your scholarship.</p><h1>Is there a fee to apply?</h1><p>The scholarship itself is a government benefit, and students should be cautious about people demanding large amounts of money to submit or \"guarantee\" a scholarship.</p><p>NSP currently states that scholarship-related services are also available through Common Service Centres (CSCs), with a displayed total charge of <strong>₹30 including applicable taxes</strong> for the listed CSC activity.</p><p>If somebody asks you for a large amount claiming that they can guarantee selection, be careful.</p><p>No private person can legitimately guarantee that a student will be selected merely because money is paid to them.</p><h1>PM-USP CSSS: Quick summary</h1><table><thead><tr><th>Detail</th><th>Information</th></tr></thead><tbody><tr><td>Scheme</td><td>PM-USP Central Sector Scheme of Scholarship for College and University Students</td></tr><tr><td>Ministry</td><td>Ministry of Education</td></tr><tr><td>Department</td><td>Department of Higher Education</td></tr><tr><td>Type</td><td>Merit-based scholarship</td></tr><tr><td>Portal</td><td>National Scholarship Portal</td></tr><tr><td>Academic year covered here</td><td>2026–27</td></tr><tr><td>Family income ceiling in published guidelines</td><td>₹4.5 lakh per year</td></tr><tr><td>Graduation scholarship</td><td>₹12,000 per year for first 3 years</td></tr><tr><td>Post-Graduation scholarship</td><td>₹20,000 per year</td></tr><tr><td>Technical-course later years</td><td>₹20,000 per year where applicable</td></tr><tr><td>Minimum renewal marks</td><td>50%</td></tr><tr><td>Minimum attendance for renewal</td><td>75%</td></tr><tr><td>Maximum duration</td><td>Up to 5 years, subject to course and scheme conditions</td></tr><tr><td>Payment method</td><td>Direct Benefit Transfer (DBT)</td></tr><tr><td>Fresh/renewal application</td><td>Through NSP</td></tr></tbody></table><p>The amounts and conditions above come from the Ministry of Education's published scheme guidelines/FAQ, while the 2026–27 application dates come from the current NSP listing.</p><h1>Frequently Asked Questions</h1><h2>Is PM-USP CSSS a Central Government scholarship?</h2><p>Yes. It is a Central Government scholarship administered through the Department of Higher Education, Ministry of Education.</p><h2>Is PM-USP CSSS active in 2026–27?</h2><p>Yes. The National Scholarship Portal currently lists the scheme for Academic Year 2026–27.</p><h2>What is the family income limit?</h2><p>The published PM-USP CSSS guidelines specify gross parental/family income of up to <strong>₹4.5 lakh per year</strong>.</p><h2>How much money does the scholarship provide?</h2><p>The Ministry's FAQ states ₹12,000 per year for the first three years of graduation and ₹20,000 per year at the post-graduation level, with specific provisions for technical courses.</p><h2>Do I have to apply again every year?</h2><p>Renewal is required for continuing beneficiaries. Renewal is subject to the applicable academic, attendance and other conditions.</p><h2>What marks are required for renewal?</h2><p>The published guidelines specify at least <strong>50% marks</strong> in the annual examination for renewal.</p><h2>How much attendance is required?</h2><p>The renewal condition specifies at least <strong>75% attendance</strong>.</p><h2>Can I receive another scholarship along with PM-USP CSSS?</h2><p>You should not assume that you can. The scheme has restrictions relating to other scholarships and fee benefits. Check the current eligibility conditions before accepting another scholarship.</p><h2>How is the scholarship paid?</h2><p>The scholarship is paid through Direct Benefit Transfer (DBT) to the beneficiary's bank account through the prescribed government payment system.</p><h2>Can I check my scholarship payment online?</h2><p>Yes. The Ministry's FAQ states that students can track payment through PFMS and check their application status through NSP.</p><h2>What is OTR?</h2><p>OTR means <strong>One Time Registration</strong>. NSP currently requires OTR for scholarship applications and describes it as a unique registration number for the student's academic career.</p><h2>What happens if I change my college?</h2><p>The scheme guidelines allow continuation/renewal after changing college when the course and new institution satisfy the applicable requirements.</p><h2>Can distance-learning students apply?</h2><p>The published guidelines specify regular degree courses and exclude correspondence/distance-mode study under the eligibility conditions.</p><h2>Can diploma students apply?</h2><p>The published guidelines specify degree courses and exclude diploma courses.</p><h2>Is selection guaranteed if I have high marks?</h2><p>No. High marks are important for a merit-based scheme, but students must also satisfy the other eligibility requirements and go through the prescribed selection and verification process.</p><h2>What should I do if my application has a problem?</h2><p>First identify the reason shown in NSP. If it concerns your college or institution, contact the appropriate scholarship/nodal officer. For portal-related problems, use the official NSP support or grievance mechanism.</p><h1>Important 2026–27 dates</h1><p>According to the current National Scholarship Portal listing for PM-USP CSSS renewal applications:</p><ul><li><p><strong>Portal opening:</strong> 1 June 2026</p></li><li><p><strong>Student application deadline:</strong> 30 September 2026</p></li><li><p><strong>Defective application verification:</strong> 15 October 2026</p></li><li><p><strong>Institute verification:</strong> 15 October 2026</p></li><li><p><strong>DNO/SNO/MNO verification:</strong> 30 October 2026</p></li></ul><p>These are the dates currently displayed by NSP and may be revised by the authorities. Check the official portal before relying on them.</p><h1>Final word for students and parents</h1><p>A government scholarship can make college expenses a little easier, but the most important thing is to understand the rules before applying.</p><p>For PM-USP CSSS, do not look only at the scholarship amount.</p><p>Check the complete picture:</p><p><strong>marks + family income + course + college + attendance + other scholarships + bank details + application deadline.</strong></p><p>If all of these are handled correctly, you reduce the chances of avoidable problems during application or renewal.</p><p>And remember one simple rule: <strong>do not rely on an old YouTube video, social-media post or third-party article for the final deadline.</strong></p><p>The National Scholarship Portal is the place to check the latest application status and dates for the current academic year.</p><h3>Official sources</h3><p><strong>National Scholarship Portal (NSP):</strong> <a href=\"https://scholarships.gov.in/?utm_source=chatgpt.com\">scholarships.gov.in</a></p><p><strong>Ministry of Education – PM-USP CSSS guidelines:</strong> <a href=\"https://www.education.gov.in/sites/upload_files/mhrd/files/upload_document/PM_USP_CSSS_guidelines_updated.pdf?utm_source=chatgpt.com\">Ministry of Education scheme guidelines</a></p><p><strong>Ministry of Education – PM-USP CSSS FAQ:</strong> <a href=\"https://www.education.gov.in/sites/upload_files/mhrd/files/upload_document/FAQs_PM_USP_CSSS_scheme_AY_2025_26.pdf?utm_source=chatgpt.com\">Ministry of Education PM-USP CSSS FAQ</a></p><p><strong>Disclaimer:</strong> This article is intended for general information and educational purposes. Government scholarship eligibility, dates, amounts, documentation requirements and other conditions can change. The information shown here is based on the official sources available at the time of writing. Always verify the latest information on the National Scholarship Portal and Ministry of Education before applying.</p>",
    featuredImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    category: "Education",
    tags: ["Scholarship", "PM-USP", "NSP", "FY 2026-27"],
    author: {
      name: "CA Rajesh Sharma",
      role: "Senior Tax Consultant",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Practicing Chartered Accountant specializing in direct taxation."
    },
    status: "published",
    publishedAt: "2026-09-30T08:09:32.367Z",
    updatedAt: "2026-09-30T08:35:54.757Z",
    readTimeMinutes: 5,
    views: 12,
    isFeatured: true,
    seoTitle: "PM-USP Central Sector Scheme of Scholarship for College and University Students (CSSS)",
    seoDescription: "Complete guide on PM-USP CSSS scholarship eligibility, amounts, renewal guidelines, and NSP application process for 2026–27.",
    seoKeywords: ["pm-usp", "csss", "nsp scholarship", "higher education scholarship"],
    embeddedCalculators: []
  }
];

function getInitialDb(): DatabaseSchema {
  return {
    categories: [],
    subcategories: [],
    calculators: [],
    posts: defaultPosts,
    settings: defaultSettings,
  };
}

let memoryDb: DatabaseSchema | null = null;

// Database helper with safe atomic writing & retry logic
function readDb(): DatabaseSchema {
  if (memoryDb) {
    if (!memoryDb.posts || memoryDb.posts.length === 0) {
      memoryDb.posts = defaultPosts;
    }
    return memoryDb;
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialDb();
    writeDb(initial, 'initial_file_creation');
    memoryDb = initial;
    return initial;
  }

  let attempts = 0;
  while (attempts < 5) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      if (!raw || raw.trim().length === 0) {
        throw new Error('Database file is empty during read');
      }
      const parsed = JSON.parse(raw);
      const parsedPosts = Array.isArray(parsed.posts) && parsed.posts.length > 0 ? parsed.posts : defaultPosts;
      memoryDb = {
        categories: Array.isArray(parsed.categories) ? parsed.categories : [],
        subcategories: Array.isArray(parsed.subcategories) ? parsed.subcategories : [],
        calculators: Array.isArray(parsed.calculators) ? parsed.calculators : [],
        posts: parsedPosts,
        blogCategories: Array.isArray(parsed.blogCategories) ? parsed.blogCategories : [],
        blogSubcategories: Array.isArray(parsed.blogSubcategories) ? parsed.blogSubcategories : [],
        settings: { ...defaultSettings, ...(parsed.settings || {}) },
      };
      return memoryDb;
    } catch (err) {
      attempts++;
      if (attempts >= 5) {
        console.error(`[CRITICAL DATABASE ERROR] Failed to read ${DB_FILE} after 5 attempts:`, err);
        throw new Error(`Database read failure: Unable to safely parse ${DB_FILE}`);
      }
      const start = Date.now();
      while (Date.now() - start < 5) {}
    }
  }

  throw new Error('Database read error');
}

function writeDb(data: DatabaseSchema, source: string = 'unknown'): boolean {
  // SAFETY GUARD FOR POSTS: Prevent accidental wipe of posts array
  if (memoryDb && memoryDb.posts && memoryDb.posts.length > 0 && (!data.posts || data.posts.length === 0) && source !== 'delete_blog_post' && source !== 'admin_bulk_delete_blog_post') {
    console.warn(`[POSTS SAFETY GUARD] Preserving ${memoryDb.posts.length} blog posts from accidental wipe during source '${source}'`);
    data.posts = memoryDb.posts;
  }
  if (!data.posts || data.posts.length === 0) {
    data.posts = defaultPosts;
  }

  memoryDb = data;
  try {
    let prevCalcCount = 0;
    let prevCalcIds: string[] = [];

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        if (raw && raw.trim().length > 0) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.calculators)) {
            prevCalcCount = parsed.calculators.length;
            prevCalcIds = parsed.calculators.map((c: any) => c.id);
          }
        }
      } catch (e) {
        // Ignore parse error on previous disk copy
      }
    }

    const nextCalcCount = data.calculators ? data.calculators.length : 0;
    const nextCalcIds = data.calculators ? data.calculators.map((c: any) => c.id) : [];

    // SAFETY GUARD (PHASE 4): Block accidental empty writes that wipe existing calculators
    const allowedZeroCalcSources = [
      'explicit_delete_all_confirmed',
      'explicit_delete_category',
      'explicit_delete_subcategory',
      'explicit_delete_calculator',
    ];

    if (prevCalcCount > 0 && nextCalcCount === 0 && !allowedZeroCalcSources.includes(source)) {
      const stack = new Error().stack;
      console.error(`[BLOCKED CALCULATOR DB WRITE] Attempted to wipe all ${prevCalcCount} calculators from disk! Source: ${source}`);
      console.error('Stack trace:', stack);
      throw new Error(`Database Safety Guard Blocked Write: Attempted to replace ${prevCalcCount} calculators with 0 calculators from source '${source}'.`);
    }

    const targetCalcSummaries = (data.calculators || []).map((c: any) => {
      const enabled = (c.modules || []).filter((m: any) => m.isEnabled).length;
      const disabled = (c.modules || []).filter((m: any) => !m.isEnabled).length;
      return `${c.id}(${c.name}): ${enabled} ON / ${disabled} OFF (total ${c.modules ? c.modules.length : 0})`;
    });

    console.log(`[DB_WRITE] Timestamp: ${new Date().toISOString()} | Source: ${source} | Count BEFORE: ${prevCalcCount} | Count AFTER: ${nextCalcCount} | Modules: [${targetCalcSummaries.join('; ')}]`);

    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err: any) {
    console.error(`[ERROR IN writeDb (${source})]:`, err.message || err);
    throw err;
  }
}

// Initialize on startup
readDb();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isDev = process.env.NODE_ENV !== 'production';

  app.use(express.json({ limit: '10mb' }));

  // Instant Health Check endpoints for Cloud Run & container orchestrators
  app.get('/healthz', (_req: Request, res: Response) => {
    return res.status(200).send('OK');
  });
  app.get('/api/health', (_req: Request, res: Response) => {
    return res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Helper for slug generation & conflict resolution
  function cleanSlug(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Persistent Auth Sessions
  const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

  function loadSessions(): Set<string> {
    try {
      if (fs.existsSync(SESSIONS_FILE)) {
        const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const s = new Set<string>(list);
          s.add('admin-demo-token-active');
          return s;
        }
      }
    } catch (err) {
      console.error('Error reading sessions file:', err);
    }
    return new Set<string>(['admin-demo-token-active']);
  }

  function saveSessions(sessions: Set<string>): void {
    try {
      const dir = path.dirname(SESSIONS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(Array.from(sessions)), 'utf-8');
    } catch (err) {
      console.error('Error saving sessions file:', err);
    }
  }

  const activeSessions = loadSessions();

  function requireAdmin(req: Request, res: Response, next: () => void) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || (req.query.token as string);
    if (!token || !activeSessions.has(token)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session' });
    }
    next();
  }

  // ==========================================
  // AUTH API
  // ==========================================
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    const db = readDb();
    if (
      username === db.settings.adminUsername &&
      password === db.settings.adminPasswordHash
    ) {
      const token = `adm_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      activeSessions.add(token);
      saveSessions(activeSessions);
      return res.json({
        success: true,
        token,
        user: { username: db.settings.adminUsername, role: 'admin' },
      });
    }
    return res.status(401).json({ success: false, error: 'Invalid username or password' });
  });

  app.get('/api/auth/check', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || (req.query.token as string);
    if (token && activeSessions.has(token)) {
      const db = readDb();
      return res.json({ authenticated: true, username: db.settings.adminUsername });
    }
    return res.json({ authenticated: false });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || (req.query.token as string);
    if (token) {
      activeSessions.delete(token);
      saveSessions(activeSessions);
    }
    return res.json({ success: true });
  });

  // ==========================================
  // STATS API
  // ==========================================
  app.get('/api/stats', (_req: Request, res: Response) => {
    const db = readDb();
    const activeCatIds = new Set(db.categories.filter((c) => c.isActive).map((c) => c.id));
    const activeSubIds = new Set(
      db.subcategories.filter((s) => s.isActive && activeCatIds.has(s.categoryId)).map((s) => s.id)
    );

    const stats = {
      totalCategories: db.categories.length,
      activeCategories: db.categories.filter((c) => c.isActive).length,
      totalSubcategories: db.subcategories.length,
      activeSubcategories: db.subcategories.filter((s) => s.isActive && activeCatIds.has(s.categoryId)).length,
      totalCalculators: db.calculators.length,
      activeCalculators: db.calculators.filter(
        (calc) => calc.isActive && activeCatIds.has(calc.categoryId) && activeSubIds.has(calc.subcategoryId)
      ).length,
    };
    return res.json(stats);
  });

function getJsonLd(route: any, settings: any) {
  if (route.type === 'calculator') {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": route.calculator?.name || "Calculator",
      "operatingSystem": "All",
      "applicationCategory": "FinanceApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      }
    };
  }
  if (route.type === 'blog') {
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": settings.siteTitle,
      "url": settings.canonicalBaseUrl
    };
  }
  return null;
}

function getArticleFromFiles(slug: string) {
  const filePath = path.join(__dirname, 'content', 'articles', `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContents);
  return {
    ...data,
    content: marked.parse(content),
    seoTitle: data.seoTitle || data.title,
    seoDescription: data.seoDescription || data.excerpt,
    slug,
    type: 'blog'
  };
}

  // ==========================================
  // PUBLIC ROUTE & CATEGORY HELPERS
  // ==========================================
  function getPublicCategoriesData(db: DatabaseSchema) {
    const activeCategories = db.categories
      .filter((c) => c.isActive)
      .sort((a, b) => a.order - b.order);

    return activeCategories.map((cat) => {
      const activeSubs = db.subcategories.filter((s) => s.categoryId === cat.id && s.isActive);
      const activeSubIds = new Set(activeSubs.map((s) => s.id));
      const activeCalcs = db.calculators.filter(
        (c) => c.categoryId === cat.id && c.isActive && activeSubIds.has(c.subcategoryId)
      );

      return {
        ...cat,
        subcategoriesCount: activeSubs.length,
        calculatorsCount: activeCalcs.length,
        subcategories: activeSubs.sort((a, b) => a.order - b.order),
      };
    });
  }

  function cleanPathSlug(s: string): string {
    return (s || '')
      .toLowerCase()
      .replace(/\.html?$/i, '')
      .replace(/[_\s+]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function resolveRouteData(rawUrlPath: string, db: DatabaseSchema, queryParams?: Record<string, any>) {
    if (!rawUrlPath) return { type: 'home' };

    // Strip query string and hash, normalize slashes and casing
    const pathWithoutQuery = rawUrlPath.split('?')[0].split('#')[0];
    let decoded = pathWithoutQuery;
    try {
      decoded = decodeURIComponent(pathWithoutQuery);
    } catch {
      decoded = pathWithoutQuery;
    }

    // Strip trailing .html if present
    decoded = decoded.replace(/\.html?$/i, '');

    const cleanPath = decoded.trim().toLowerCase().replace(/^\/+|\/+$/g, '');

    // Extract any query param calculator target
    const explicitCalcParam = queryParams?.calculator || queryParams?.calc || queryParams?.slug || queryParams?.id;
    if (explicitCalcParam && typeof explicitCalcParam === 'string') {
      const targetParam = explicitCalcParam.toLowerCase();
      const calcFound = db.calculators.find(
        (c) =>
          c.isActive &&
          (c.slug.toLowerCase() === targetParam ||
            c.id.toLowerCase() === targetParam ||
            cleanPathSlug(c.slug) === cleanPathSlug(targetParam))
      );
      if (calcFound) {
        const cat = db.categories.find((c) => c.id === calcFound.categoryId && c.isActive) || db.categories[0];
        const sub = db.subcategories.find((s) => s.id === calcFound.subcategoryId && s.isActive) || db.subcategories[0];
        return {
          type: 'calculator',
          category: cat,
          subcategory: sub,
          calculator: calcFound,
          relatedCalculators: db.calculators.filter((c) => c.subcategoryId === sub?.id && c.id !== calcFound.id && c.isActive).slice(0, 6),
        };
      }
    }

    if (!cleanPath) {
      return { type: 'home' };
    }

    let parts = cleanPath.split('/').filter(Boolean);

    if (parts.length > 0 && parts[0] === 'blog') {
      if (parts.length > 1) {
        const article = getArticleFromFiles(parts[1]) || (db.posts || []).find((p) => p.slug === parts[1]);
        if (article) return { type: 'blog', post: article };
      }
      return { type: 'blog' };
    }

    // Strip generic path prefixes if present, e.g. /category/tax, /calculators/income-tax-calculator
    const genericPrefixes = ['category', 'categories', 'subcategory', 'subcategories', 'calculator', 'calculators', 'calc', 'calcs', 'tools', 'tool', 'app', 'apps'];
    let prefixIntent: 'category' | 'subcategory' | 'calculator' | null = null;
    if (parts.length > 1 && genericPrefixes.includes(parts[0])) {
      const p0 = parts[0];
      if (p0.startsWith('categor')) prefixIntent = 'category';
      else if (p0.startsWith('subcategor')) prefixIntent = 'subcategory';
      else if (p0.startsWith('calc') || p0.startsWith('tool')) prefixIntent = 'calculator';
      parts = parts.slice(1);
    }

    // Strip common sub-actions or tab suffixes if present, e.g. /income-tax-calculator/how-to, /income-tax-calculator/embed
    const subActionSuffixes = ['how-to', 'faqs', 'examples', 'assumptions', 'formula', 'audit', 'embed', 'results', 'calculate'];
    if (parts.length > 1 && subActionSuffixes.includes(parts[parts.length - 1])) {
      parts = parts.slice(0, parts.length - 1);
    }

    // Helper for category slug matching (e.g. "income-tax-tax" can also match "income-tax", "tax", "taxes")
    const matchCategory = (slug: string) => {
      const s = cleanPathSlug(slug);
      return db.categories.find((c) => {
        if (!c.isActive) return false;
        const cSlug = cleanPathSlug(c.slug);
        const cId = c.id.toLowerCase();
        return (
          cSlug === s ||
          cId === s ||
          cSlug.replace(/-tax$/, '') === s ||
          s.replace(/-tax$/, '') === cSlug ||
          (s === 'tax' || s === 'taxes' || s === 'income-tax') && (cSlug.includes('tax') || c.name.toLowerCase().includes('tax'))
        );
      });
    };

    // Helper for subcategory slug matching
    const matchSubcategory = (slug: string, catId?: string) => {
      const s = cleanPathSlug(slug);
      return db.subcategories.find((sub) => {
        if (!sub.isActive) return false;
        if (catId && sub.categoryId !== catId) return false;
        const subSlug = cleanPathSlug(sub.slug);
        const subId = sub.id.toLowerCase();
        return (
          subSlug === s ||
          subId === s ||
          subSlug.replace(/-tax$/, '') === s ||
          s.replace(/-tax$/, '') === subSlug ||
          ((s === 'income-tax' || s === 'tax') && subSlug.includes('income-tax'))
        );
      });
    };

    // Helper for calculator matching by exact slug, id, alphanumeric equivalence, or common tax aliases
    const matchCalculator = (slug: string) => {
      const s = cleanPathSlug(slug);
      const alphaS = s.replace(/[^a-z0-9]/g, '');
      return db.calculators.find((c) => {
        if (!c.isActive) return false;
        const cSlug = cleanPathSlug(c.slug);
        const cId = c.id.toLowerCase();
        const alphaCSlug = cSlug.replace(/[^a-z0-9]/g, '');
        return (
          cSlug === s ||
          cId === s ||
          alphaCSlug === alphaS ||
          cSlug === s.replace(/^calc[-_]/, '') ||
          cSlug === s + '-calculator' ||
          (cSlug.includes('income-tax') && (
            s === 'income-tax' ||
            s === 'incometax' ||
            s === 'income-tax-calc' ||
            s === 'incometaxcalculator' ||
            s === 'tax-calculator' ||
            s === 'taxes-calculator' ||
            s === 'tax-calc' ||
            s === 'tax' ||
            s === 'taxes'
          ))
        );
      });
    };

    // 1. Exact 3-Part Match: /:catSlug/:subSlug/:calcSlug
    if (parts.length >= 3) {
      const [catSlug, subSlug, calcSlug] = parts;
      const category = matchCategory(catSlug);
      const subcategory = category ? matchSubcategory(subSlug, category.id) : null;
      let calculator = subcategory
        ? db.calculators.find(
            (c) =>
              c.isActive &&
              c.subcategoryId === subcategory.id &&
              (cleanPathSlug(c.slug) === cleanPathSlug(calcSlug) || c.id.toLowerCase() === calcSlug.toLowerCase())
          )
        : null;

      if (!calculator) {
        calculator = matchCalculator(calcSlug);
      }

      if (calculator) {
        const finalCategory =
          category ||
          db.categories.find((c) => c.id === calculator?.categoryId && c.isActive) ||
          db.categories[0];
        const finalSubcategory =
          subcategory ||
          db.subcategories.find((s) => s.id === calculator?.subcategoryId && s.isActive) ||
          db.subcategories[0];

        calculator.viewsCount = (calculator.viewsCount || 0) + 1;
        const relatedCalculators = db.calculators
          .filter((c) => c.subcategoryId === finalSubcategory.id && c.id !== calculator?.id && c.isActive)
          .slice(0, 6);

        return {
          type: 'calculator',
          category: finalCategory,
          subcategory: finalSubcategory,
          calculator,
          relatedCalculators,
        };
      }
    }

    // 2. 2-Part Match: /:catSlug/:subSlug OR /:subSlug/:calcSlug OR /:catSlug/:calcSlug
    if (parts.length === 2) {
      const [p0, p1] = parts;

      // If user came with category prefix intent or p1 is a subcategory
      if (prefixIntent === 'category') {
        const cat = matchCategory(p0) || matchCategory(p1);
        if (cat) {
          const subcategories = db.subcategories.filter((s) => s.categoryId === cat.id && s.isActive).sort((a, b) => a.order - b.order);
          const activeSubIds = new Set(subcategories.map((s) => s.id));
          const calculators = db.calculators.filter((c) => c.categoryId === cat.id && c.isActive && activeSubIds.has(c.subcategoryId)).sort((a, b) => a.order - b.order);
          return { type: 'category', category: cat, subcategories, calculators };
        }
      }

      // Check if p0 is a category and p1 is a calculator OR subcategory
      const category = matchCategory(p0);
      if (category) {
        // Direct calculator match under this category
        const directCalc = db.calculators.find(
          (c) =>
            c.isActive &&
            c.categoryId === category.id &&
            (cleanPathSlug(c.slug) === cleanPathSlug(p1) ||
              c.id.toLowerCase() === p1.toLowerCase() ||
              cleanPathSlug(c.slug) === `${cleanPathSlug(p1)}-calculator`)
        );
        if (directCalc) {
          const sub =
            db.subcategories.find((s) => s.id === directCalc.subcategoryId && s.isActive) ||
            db.subcategories[0];
          directCalc.viewsCount = (directCalc.viewsCount || 0) + 1;
          return {
            type: 'calculator',
            category,
            subcategory: sub,
            calculator: directCalc,
            relatedCalculators: db.calculators
              .filter((c) => c.subcategoryId === sub?.id && c.id !== directCalc.id && c.isActive)
              .slice(0, 6),
          };
        }

        const subcategory = matchSubcategory(p1, category.id);
        if (subcategory) {
          // If subcategory has a primary matching calculator with slug matching subcategory
          const matchingCalc = db.calculators.find(
            (c) =>
              c.isActive &&
              c.subcategoryId === subcategory.id &&
              (cleanPathSlug(c.slug) === cleanPathSlug(p1) ||
                cleanPathSlug(c.slug) === `${cleanPathSlug(p1)}-calculator`)
          );
          if (matchingCalc) {
            matchingCalc.viewsCount = (matchingCalc.viewsCount || 0) + 1;
            return {
              type: 'calculator',
              category,
              subcategory,
              calculator: matchingCalc,
              relatedCalculators: db.calculators
                .filter((c) => c.subcategoryId === subcategory.id && c.id !== matchingCalc.id && c.isActive)
                .slice(0, 6),
            };
          }

          const calculators = db.calculators
            .filter((c) => c.subcategoryId === subcategory.id && c.isActive)
            .sort((a, b) => a.order - b.order);

          const siblingSubcategories = db.subcategories
            .filter((s) => s.categoryId === category.id && s.isActive)
            .sort((a, b) => a.order - b.order);

          return {
            type: 'subcategory',
            category,
            subcategory,
            calculators,
            siblingSubcategories,
          };
        }
      }

      // Check if p1 or p0 is a calculator
      const calcMatch = matchCalculator(p1) || matchCalculator(p0);
      if (calcMatch) {
        const cat =
          db.categories.find((c) => c.id === calcMatch.categoryId && c.isActive) || db.categories[0];
        const sub =
          db.subcategories.find((s) => s.id === calcMatch.subcategoryId && s.isActive) ||
          db.subcategories[0];
        calcMatch.viewsCount = (calcMatch.viewsCount || 0) + 1;
        const relatedCalculators = db.calculators
          .filter((c) => c.subcategoryId === sub.id && c.id !== calcMatch.id && c.isActive)
          .slice(0, 6);

        return {
          type: 'calculator',
          category: cat,
          subcategory: sub,
          calculator: calcMatch,
          relatedCalculators,
        };
      }

      // Check if p1 is a subcategory across any category
      const subcategory = matchSubcategory(p1);
      if (subcategory) {
        const cat = db.categories.find((c) => c.id === subcategory.categoryId && c.isActive);
        if (cat) {
          const calculators = db.calculators
            .filter((c) => c.subcategoryId === subcategory.id && c.isActive)
            .sort((a, b) => a.order - b.order);

          const siblingSubcategories = db.subcategories
            .filter((s) => s.categoryId === cat.id && s.isActive)
            .sort((a, b) => a.order - b.order);

          return {
            type: 'subcategory',
            category: cat,
            subcategory,
            calculators,
            siblingSubcategories,
          };
        }
      }
    }

    // 3. 1-Part Match: /:slug
    if (parts.length === 1) {
      const p0 = parts[0];

      // If user explicitly visited /category/...
      if (prefixIntent === 'category') {
        const category = matchCategory(p0);
        if (category) {
          const subcategories = db.subcategories
            .filter((s) => s.categoryId === category.id && s.isActive)
            .sort((a, b) => a.order - b.order);
          const activeSubIds = new Set(subcategories.map((s) => s.id));
          const calculators = db.calculators
            .filter((c) => c.categoryId === category.id && c.isActive && activeSubIds.has(c.subcategoryId))
            .sort((a, b) => a.order - b.order);
          return { type: 'category', category, subcategories, calculators };
        }
      }

      // Check if it's a calculator slug first (e.g. /income-tax-calculator, /tax-calculator, /incometax)
      const calcMatch = matchCalculator(p0);
      if (calcMatch) {
        const cat =
          db.categories.find((c) => c.id === calcMatch.categoryId && c.isActive) || db.categories[0];
        const sub =
          db.subcategories.find((s) => s.id === calcMatch.subcategoryId && s.isActive) ||
          db.subcategories[0];
        calcMatch.viewsCount = (calcMatch.viewsCount || 0) + 1;
        const relatedCalculators = db.calculators
          .filter((c) => c.subcategoryId === sub.id && c.id !== calcMatch.id && c.isActive)
          .slice(0, 6);

        return {
          type: 'calculator',
          category: cat,
          subcategory: sub,
          calculator: calcMatch,
          relatedCalculators,
        };
      }

      // Check if it's a category slug
      const category = matchCategory(p0);
      if (category && (p0 === cleanPathSlug(category.slug) || p0 === category.id.toLowerCase() || p0.includes('tax'))) {
        const subcategories = db.subcategories
          .filter((s) => s.categoryId === category.id && s.isActive)
          .sort((a, b) => a.order - b.order);

        const activeSubIds = new Set(subcategories.map((s) => s.id));
        const calculators = db.calculators
          .filter((c) => c.categoryId === category.id && c.isActive && activeSubIds.has(c.subcategoryId))
          .sort((a, b) => a.order - b.order);

        return {
          type: 'category',
          category,
          subcategories,
          calculators,
        };
      }

      // Check if it's a subcategory slug directly, e.g. /salary-tax or /income-tax
      const subcategory = matchSubcategory(p0);
      if (subcategory) {
        const cat = db.categories.find((c) => c.id === subcategory.categoryId && c.isActive);
        if (cat) {
          const calculators = db.calculators
            .filter((c) => c.subcategoryId === subcategory.id && c.isActive)
            .sort((a, b) => a.order - b.order);

          const siblingSubcategories = db.subcategories
            .filter((s) => s.categoryId === cat.id && s.isActive)
            .sort((a, b) => a.order - b.order);

          return {
            type: 'subcategory',
            category: cat,
            subcategory,
            calculators,
            siblingSubcategories,
          };
        }
      }

      // Category fallback
      if (category) {
        const subcategories = db.subcategories
          .filter((s) => s.categoryId === category.id && s.isActive)
          .sort((a, b) => a.order - b.order);

        const activeSubIds = new Set(subcategories.map((s) => s.id));
        const calculators = db.calculators
          .filter((c) => c.categoryId === category.id && c.isActive && activeSubIds.has(c.subcategoryId))
          .sort((a, b) => a.order - b.order);

        return {
          type: 'category',
          category,
          subcategories,
          calculators,
        };
      }
    }

    // Safe fallback: If there is an active calculator with income-tax or if only one calculator exists
    if (cleanPath.includes('tax') || cleanPath.includes('calc')) {
      const fallbackCalc = db.calculators.find((c) => c.isActive && c.slug.includes('tax')) || db.calculators.find((c) => c.isActive);
      if (fallbackCalc) {
        const cat = db.categories.find((c) => c.id === fallbackCalc.categoryId && c.isActive) || db.categories[0];
        const sub = db.subcategories.find((s) => s.id === fallbackCalc.subcategoryId && s.isActive) || db.subcategories[0];
        return {
          type: 'calculator',
          category: cat,
          subcategory: sub,
          calculator: fallbackCalc,
          relatedCalculators: db.calculators.filter((c) => c.subcategoryId === sub?.id && c.id !== fallbackCalc.id && c.isActive).slice(0, 6),
        };
      }
    }

    return null;
  }

  // ==========================================
  // PUBLIC API
  // ==========================================
  app.get('/api/public/categories', (_req: Request, res: Response) => {
    const db = readDb();
    return res.json(getPublicCategoriesData(db));
  });

  app.get('/api/public/subcategories', (req: Request, res: Response) => {
    const db = readDb();
    const { categorySlug, categoryId } = req.query;
    const activeCatMap = new Map(db.categories.filter((c) => c.isActive).map((c) => [c.id, c]));

    let subs = db.subcategories.filter((s) => s.isActive && activeCatMap.has(s.categoryId));

    if (categoryId) {
      subs = subs.filter((s) => s.categoryId === categoryId);
    } else if (categorySlug) {
      const cat = db.categories.find((c) => c.slug === categorySlug && c.isActive);
      if (cat) {
        subs = subs.filter((s) => s.categoryId === cat.id);
      } else {
        subs = [];
      }
    }

    const result = subs.sort((a, b) => a.order - b.order).map((s) => {
      const calcsCount = db.calculators.filter(
        (c) => c.subcategoryId === s.id && c.isActive && activeCatMap.has(c.categoryId)
      ).length;
      return {
        ...s,
        category: activeCatMap.get(s.categoryId),
        calculatorsCount: calcsCount,
      };
    });

    return res.json(result);
  });

  app.get('/api/public/calculators', (req: Request, res: Response) => {
    const db = readDb();
    const { categorySlug, subcategorySlug, search, featured, limit } = req.query;

    const activeCatMap = new Map(db.categories.filter((c) => c.isActive).map((c) => [c.id, c]));
    const activeSubMap = new Map(
      db.subcategories.filter((s) => s.isActive && activeCatMap.has(s.categoryId)).map((s) => [s.id, s])
    );

    let calcs = db.calculators.filter(
      (c) => c.isActive && activeCatMap.has(c.categoryId) && activeSubMap.has(c.subcategoryId)
    );

    if (categorySlug) {
      const cat = db.categories.find((c) => c.slug === categorySlug && c.isActive);
      if (cat) {
        calcs = calcs.filter((c) => c.categoryId === cat.id);
      } else {
        calcs = [];
      }
    }

    if (subcategorySlug) {
      const sub = db.subcategories.find((s) => s.slug === subcategorySlug && s.isActive);
      if (sub) {
        calcs = calcs.filter((c) => c.subcategoryId === sub.id);
      } else {
        calcs = [];
      }
    }

    if (featured === 'true') {
      calcs = calcs.filter((c) => c.isFeatured);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      calcs = calcs.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          (c.seoKeywords && c.seoKeywords.toLowerCase().includes(q)) ||
          activeCatMap.get(c.categoryId)?.name.toLowerCase().includes(q) ||
          activeSubMap.get(c.subcategoryId)?.name.toLowerCase().includes(q)
      );
    }

    calcs.sort((a, b) => a.order - b.order);

    if (limit) {
      calcs = calcs.slice(0, parseInt(limit as string, 10));
    }

    const result = calcs.map((calc) => ({
      ...calc,
      category: activeCatMap.get(calc.categoryId),
      subcategory: activeSubMap.get(calc.subcategoryId),
    }));

    return res.json(result);
  });

  // ==========================================
  // PUBLIC BLOG API ENDPOINTS
  // ==========================================
  app.get('/api/public/blogs', (req: Request, res: Response) => {
    const db = readDb();
    const { category, tag, search, featured, limit } = req.query;
    let posts = (db.posts || []).filter((p) => p.status === 'published');

    if (category) {
      posts = posts.filter((p) => p.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (tag) {
      const qTag = (tag as string).toLowerCase();
      posts = posts.filter((p) => (p.tags || []).some((t) => t.toLowerCase() === qTag));
    }
    if (search) {
      const q = (search as string).toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }
    if (featured === 'true') {
      posts = posts.filter((p) => p.isFeatured);
    }

    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (limit) {
      posts = posts.slice(0, parseInt(limit as string, 10));
    }

    return res.json(posts);
  });

  app.get('/api/public/blog-categories', (_req: Request, res: Response) => {
    const db = readDb();
    const categories = db.blogCategories || [];
    const posts = (db.posts || []).filter((p) => p.status === 'published');

    const result = categories.map((cat) => ({
      ...cat,
      postCount: posts.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length,
    }));

    return res.json(result);
  });

  app.get('/api/public/blogs/:slug', (req: Request, res: Response) => {
    const db = readDb();
    const targetParam = (req.params.slug || '').trim().toLowerCase();
    const cleanTarget = cleanSlug(targetParam);

    const posts = db.posts || [];
    let postIndex = posts.findIndex(
      (p) =>
        p.slug.toLowerCase() === targetParam ||
        p.id.toLowerCase() === targetParam ||
        cleanSlug(p.slug) === cleanTarget
    );

    // Fallback: If exact match fails, check partial slug match
    if (postIndex === -1 && cleanTarget.length > 3) {
      postIndex = posts.findIndex(
        (p) => cleanSlug(p.slug).includes(cleanTarget) || cleanTarget.includes(cleanSlug(p.slug))
      );
    }

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    db.posts![postIndex].views = (db.posts![postIndex].views || 0) + 1;
    writeDb(db, 'increment_blog_views');

    const post = db.posts![postIndex];
    const related = posts
      .filter((p) => p.id !== post.id && (p.category === post.category || p.status === 'published'))
      .slice(0, 3);

    return res.json({ post, related });
  });

  // Dynamic Route Resolver for SEO-friendly URLs:
  // /:catSlug
  // /:catSlug/:subSlug
  // /:catSlug/:subSlug/:calcSlug
  app.get('/api/public/resolve', (req: Request, res: Response) => {
    const rawPath = (req.query.path as string || '');
    const db = readDb();
    const result = resolveRouteData(rawPath, db, req.query);
    if (!result) {
      return res.status(404).json({ error: 'Route not found or inactive' });
    }
    return res.json(result);
  });

  // ==========================================
  // DYNAMIC SITEMAP & ROBOTS.TXT
  // ==========================================
  app.get(['/sitemap.xml', '/api/public/sitemap.xml'], (_req: Request, res: Response) => {
    const db = readDb();
    const baseUrl = (db.settings.canonicalBaseUrl || 'https://calcplatform.org').replace(/\/$/, '');
    const activeCatMap = new Map(db.categories.filter((c) => c.isActive).map((c) => [c.id, c]));
    const activeSubMap = new Map(
      db.subcategories.filter((s) => s.isActive && activeCatMap.has(s.categoryId)).map((s) => [s.id, s])
    );

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Homepage
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Active Categories
    for (const cat of activeCatMap.values()) {
      xml += `  <url>\n    <loc>${baseUrl}/${cat.slug}</loc>\n    <lastmod>${cat.updatedAt || new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    // Active Subcategories
    for (const sub of activeSubMap.values()) {
      const parentCat = activeCatMap.get(sub.categoryId);
      if (parentCat) {
        xml += `  <url>\n    <loc>${baseUrl}/${parentCat.slug}/${sub.slug}</loc>\n    <lastmod>${sub.updatedAt || new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }
    }

    // Active Calculators
    const activeCalcs = db.calculators.filter(
      (c) => c.isActive && activeCatMap.has(c.categoryId) && activeSubMap.has(c.subcategoryId)
    );

    for (const calc of activeCalcs) {
      const parentCat = activeCatMap.get(calc.categoryId);
      const parentSub = activeSubMap.get(calc.subcategoryId);
      if (parentCat && parentSub) {
        xml += `  <url>\n    <loc>${baseUrl}/${parentCat.slug}/${parentSub.slug}/${calc.slug}</loc>\n    <lastmod>${calc.updatedAt || new Date().toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      }
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    return res.send(xml);
  });

  app.get('/robots.txt', (_req: Request, res: Response) => {
    const db = readDb();
    const baseUrl = (db.settings.canonicalBaseUrl || 'https://calcplatform.org').replace(/\/$/, '');
    const txt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
    res.header('Content-Type', 'text/plain');
    return res.send(txt);
  });

  // ==========================================
  // ADMIN CATEGORIES API
  // ==========================================
  app.get('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { search, status } = req.query;
    let list = [...db.categories];

    if (status === 'active') list = list.filter((c) => c.isActive);
    if (status === 'inactive') list = list.filter((c) => !c.isActive);
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
    }

    list.sort((a, b) => a.order - b.order);

    const withCounts = list.map((cat) => {
      const subs = db.subcategories.filter((s) => s.categoryId === cat.id);
      const calcs = db.calculators.filter((c) => c.categoryId === cat.id);
      return {
        ...cat,
        subcategoriesCount: subs.length,
        calculatorsCount: calcs.length,
      };
    });

    return res.json(withCounts);
  });

  app.post('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { name, slug, description, seoTitle, seoDescription, seoKeywords, icon, order, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    let finalSlug = cleanSlug(slug || name);
    if (!finalSlug) {
      return res.status(400).json({ error: 'Invalid category slug' });
    }

    // Ensure uniqueness of category slug
    if (db.categories.some((c) => c.slug === finalSlug)) {
      return res.status(400).json({ error: `Category slug "${finalSlug}" is already taken.` });
    }

    const newCategory: Category = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || '',
      seoTitle: seoTitle?.trim() || name.trim(),
      seoDescription: seoDescription?.trim() || description?.trim() || '',
      seoKeywords: seoKeywords?.trim() || '',
      icon: icon || 'Folder',
      order: typeof order === 'number' ? order : db.categories.length + 1,
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.categories.push(newCategory);
    writeDb(db);

    return res.status(201).json(newCategory);
  });

  app.put('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const catIndex = db.categories.findIndex((c) => c.id === id);
    if (catIndex === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const { name, slug, description, seoTitle, seoDescription, seoKeywords, icon, order, isActive } = req.body;

    if (name && !name.trim()) {
      return res.status(400).json({ error: 'Category name cannot be empty' });
    }

    let finalSlug = slug ? cleanSlug(slug) : db.categories[catIndex].slug;
    if (finalSlug !== db.categories[catIndex].slug && db.categories.some((c) => c.slug === finalSlug && c.id !== id)) {
      return res.status(400).json({ error: `Category slug "${finalSlug}" is already taken.` });
    }

    const updated: Category = {
      ...db.categories[catIndex],
      name: name?.trim() || db.categories[catIndex].name,
      slug: finalSlug,
      description: description !== undefined ? description.trim() : db.categories[catIndex].description,
      seoTitle: seoTitle !== undefined ? seoTitle.trim() : db.categories[catIndex].seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription.trim() : db.categories[catIndex].seoDescription,
      seoKeywords: seoKeywords !== undefined ? seoKeywords.trim() : db.categories[catIndex].seoKeywords,
      icon: icon || db.categories[catIndex].icon,
      order: typeof order === 'number' ? order : db.categories[catIndex].order,
      isActive: isActive !== undefined ? Boolean(isActive) : db.categories[catIndex].isActive,
      updatedAt: new Date().toISOString(),
    };

    db.categories[catIndex] = updated;
    writeDb(db);

    return res.json(updated);
  });

  app.patch('/api/admin/categories/:id/toggle', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const cat = db.categories.find((c) => c.id === id);
    if (!cat) {
      return res.status(404).json({ error: 'Category not found' });
    }

    cat.isActive = !cat.isActive;
    cat.updatedAt = new Date().toISOString();
    writeDb(db);

    return res.json({ success: true, isActive: cat.isActive });
  });

  app.delete('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const db = readDb();
      const { id } = req.params;
      const { force } = req.query;

      const subCount = db.subcategories.filter((s) => s.categoryId === id).length;
      const calcCount = db.calculators.filter((c) => c.categoryId === id).length;

      if ((subCount > 0 || calcCount > 0) && force !== 'true') {
        return res.status(409).json({
          error: `Cannot delete category: contains ${subCount} subcategories and ${calcCount} calculators. Confirm deletion with force=true to cascade delete.`,
          requiresConfirmation: true,
          subCount,
          calcCount,
        });
      }

      // Cascade delete subcategories and calculators under this category
      db.categories = db.categories.filter((c) => c.id !== id);
      db.subcategories = db.subcategories.filter((s) => s.categoryId !== id);
      db.calculators = db.calculators.filter((c) => c.categoryId !== id);

      writeDb(db, 'explicit_delete_category');
      return res.json({ success: true, message: 'Category deleted safely' });
    } catch (err: any) {
      console.error('Error deleting category:', err);
      return res.status(500).json({ error: err.message || 'Failed to delete category' });
    }
  });

  app.post('/api/admin/categories/reorder', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds array required' });
    }

    orderedIds.forEach((id: string, index: number) => {
      const cat = db.categories.find((c) => c.id === id);
      if (cat) cat.order = index + 1;
    });

    writeDb(db);
    return res.json({ success: true });
  });

  // ==========================================
  // ADMIN SUBCATEGORIES API
  // ==========================================
  app.get('/api/admin/subcategories', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { categoryId, search, status } = req.query;
    let list = [...db.subcategories];

    if (categoryId) list = list.filter((s) => s.categoryId === categoryId);
    if (status === 'active') list = list.filter((s) => s.isActive);
    if (status === 'inactive') list = list.filter((s) => !s.isActive);
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q));
    }

    list.sort((a, b) => a.order - b.order);

    const catMap = new Map(db.categories.map((c) => [c.id, c]));
    const withDetails = list.map((sub) => {
      const calcs = db.calculators.filter((c) => c.subcategoryId === sub.id);
      return {
        ...sub,
        category: catMap.get(sub.categoryId),
        calculatorsCount: calcs.length,
      };
    });

    return res.json(withDetails);
  });

  app.post('/api/admin/subcategories', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { categoryId, name, slug, description, seoTitle, seoDescription, seoKeywords, order, isActive } = req.body;

    if (!categoryId) {
      return res.status(400).json({ error: 'Parent Category is required' });
    }
    const parentCat = db.categories.find((c) => c.id === categoryId);
    if (!parentCat) {
      return res.status(400).json({ error: 'Specified parent category does not exist' });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Subcategory name is required' });
    }

    let finalSlug = cleanSlug(slug || name);
    if (!finalSlug) {
      return res.status(400).json({ error: 'Invalid subcategory slug' });
    }

    // Slug must be unique within the same parent category
    if (db.subcategories.some((s) => s.categoryId === categoryId && s.slug === finalSlug)) {
      return res.status(400).json({ error: `Subcategory slug "${finalSlug}" is already taken under this category.` });
    }

    const newSub: Subcategory = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      categoryId,
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || '',
      seoTitle: seoTitle?.trim() || name.trim(),
      seoDescription: seoDescription?.trim() || description?.trim() || '',
      seoKeywords: seoKeywords?.trim() || '',
      order: typeof order === 'number' ? order : db.subcategories.filter((s) => s.categoryId === categoryId).length + 1,
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.subcategories.push(newSub);
    writeDb(db);

    return res.status(201).json(newSub);
  });

  app.put('/api/admin/subcategories/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const subIndex = db.subcategories.findIndex((s) => s.id === id);
    if (subIndex === -1) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    const { categoryId, name, slug, description, seoTitle, seoDescription, seoKeywords, order, isActive } = req.body;

    const targetCategoryId = categoryId || db.subcategories[subIndex].categoryId;
    const parentCat = db.categories.find((c) => c.id === targetCategoryId);
    if (!parentCat) {
      return res.status(400).json({ error: 'Target parent category does not exist' });
    }

    let finalSlug = slug ? cleanSlug(slug) : db.subcategories[subIndex].slug;
    if (
      db.subcategories.some(
        (s) => s.categoryId === targetCategoryId && s.slug === finalSlug && s.id !== id
      )
    ) {
      return res.status(400).json({ error: `Subcategory slug "${finalSlug}" is already taken in this category.` });
    }

    const updated: Subcategory = {
      ...db.subcategories[subIndex],
      categoryId: targetCategoryId,
      name: name?.trim() || db.subcategories[subIndex].name,
      slug: finalSlug,
      description: description !== undefined ? description.trim() : db.subcategories[subIndex].description,
      seoTitle: seoTitle !== undefined ? seoTitle.trim() : db.subcategories[subIndex].seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription.trim() : db.subcategories[subIndex].seoDescription,
      seoKeywords: seoKeywords !== undefined ? seoKeywords.trim() : db.subcategories[subIndex].seoKeywords,
      order: typeof order === 'number' ? order : db.subcategories[subIndex].order,
      isActive: isActive !== undefined ? Boolean(isActive) : db.subcategories[subIndex].isActive,
      updatedAt: new Date().toISOString(),
    };

    // If categoryId changed, update calculators belonging to this subcategory
    if (targetCategoryId !== db.subcategories[subIndex].categoryId) {
      db.calculators.forEach((calc) => {
        if (calc.subcategoryId === id) {
          calc.categoryId = targetCategoryId;
        }
      });
    }

    db.subcategories[subIndex] = updated;
    writeDb(db);

    return res.json(updated);
  });

  app.patch('/api/admin/subcategories/:id/toggle', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const sub = db.subcategories.find((s) => s.id === id);
    if (!sub) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    sub.isActive = !sub.isActive;
    sub.updatedAt = new Date().toISOString();
    writeDb(db);

    return res.json({ success: true, isActive: sub.isActive });
  });

  app.delete('/api/admin/subcategories/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const db = readDb();
      const { id } = req.params;
      const { force } = req.query;

      const calcCount = db.calculators.filter((c) => c.subcategoryId === id).length;
      if (calcCount > 0 && force !== 'true') {
        return res.status(409).json({
          error: `Cannot delete subcategory: contains ${calcCount} calculators. Confirm deletion with force=true.`,
          requiresConfirmation: true,
          calcCount,
        });
      }

      db.subcategories = db.subcategories.filter((s) => s.id !== id);
      db.calculators = db.calculators.filter((c) => c.subcategoryId !== id);
      writeDb(db, 'explicit_delete_subcategory');

      return res.json({ success: true });
    } catch (err: any) {
      console.error('Error deleting subcategory:', err);
      return res.status(500).json({ error: err.message || 'Failed to delete subcategory' });
    }
  });

  app.post('/api/admin/subcategories/reorder', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds array required' });
    }

    orderedIds.forEach((id: string, index: number) => {
      const sub = db.subcategories.find((s) => s.id === id);
      if (sub) sub.order = index + 1;
    });

    writeDb(db);
    return res.json({ success: true });
  });

  // ==========================================
  // ADMIN CALCULATORS API
  // ==========================================
  app.get('/api/admin/calculators', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { categoryId, subcategoryId, status, search } = req.query;
    let list = [...db.calculators];

    if (categoryId) list = list.filter((c) => c.categoryId === categoryId);
    if (subcategoryId) list = list.filter((c) => c.subcategoryId === subcategoryId);
    if (status === 'active') list = list.filter((c) => c.isActive);
    if (status === 'inactive') list = list.filter((c) => !c.isActive);
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
    }

    list.sort((a, b) => a.order - b.order);

    const catMap = new Map(db.categories.map((c) => [c.id, c]));
    const subMap = new Map(db.subcategories.map((s) => [s.id, s]));

    const withParents = list.map((calc) => ({
      ...calc,
      category: catMap.get(calc.categoryId),
      subcategory: subMap.get(calc.subcategoryId),
    }));

    return res.json(withParents);
  });

  function isValidModuleConfig(m: any): boolean {
    return (
      m &&
      typeof m === 'object' &&
      typeof m.id === 'string' &&
      typeof m.moduleId === 'string' &&
      typeof m.name === 'string' &&
      (m.isEnabled === true || m.isEnabled === false) &&
      typeof m.order === 'number'
    );
  }

  app.post('/api/admin/modules/apply-all', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { modules } = req.body;
    if (!Array.isArray(modules) || modules.some((m) => !isValidModuleConfig(m))) {
      return res.status(400).json({ error: 'Invalid modules configuration: each module must have a valid boolean isEnabled property.' });
    }
    db.calculators.forEach((c) => {
      c.modules = modules;
      c.updatedAt = new Date().toISOString();
    });
    writeDb(db, 'admin_apply_modules_to_all');
    return res.json({ success: true, count: db.calculators.length });
  });

  app.get('/api/admin/calculators/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const calc = db.calculators.find((c) => c.id === id);
    if (!calc) {
      return res.status(404).json({ error: 'Calculator not found' });
    }
    return res.json(calc);
  });

  app.post('/api/admin/calculators', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const {
      name,
      slug,
      shortDescription,
      categoryId,
      subcategoryId,
      engineType,
      fields,
      outputs,
      presets,
      modules,
      contentSections,
      faqs,
      examples,
      chartConfig,
      content,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      noIndex,
      order,
      isActive,
      isFeatured,
      isPopular,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Calculator name is required' });
    }
    if (modules !== undefined) {
      if (!Array.isArray(modules) || modules.some((m) => !isValidModuleConfig(m))) {
        return res.status(400).json({ error: 'Invalid modules configuration: each module must have a valid boolean isEnabled property.' });
      }
    }
    if (!categoryId) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (!subcategoryId) {
      return res.status(400).json({ error: 'Subcategory is required' });
    }

    const parentCat = db.categories.find((c) => c.id === categoryId);
    const parentSub = db.subcategories.find((s) => s.id === subcategoryId && s.categoryId === categoryId);
    if (!parentCat || !parentSub) {
      return res.status(400).json({ error: 'Invalid category or subcategory selection' });
    }

    let finalSlug = cleanSlug(slug || name);
    if (!finalSlug) {
      return res.status(400).json({ error: 'Invalid calculator slug' });
    }

    // Slug uniqueness within the subcategory
    if (db.calculators.some((c) => c.subcategoryId === subcategoryId && c.slug === finalSlug)) {
      return res.status(400).json({ error: `Calculator slug "${finalSlug}" is already taken under this subcategory.` });
    }

    const newCalc: Calculator = {
      id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      slug: finalSlug,
      shortDescription: shortDescription?.trim() || '',
      categoryId,
      subcategoryId,
      engineType: engineType || 'custom_formula',
      fields: Array.isArray(fields) ? fields : [],
      outputs: Array.isArray(outputs) ? outputs : [],
      presets: Array.isArray(presets) ? presets : [],
      modules: Array.isArray(modules) ? modules : undefined,
      contentSections: Array.isArray(contentSections) ? contentSections : [],
      faqs: Array.isArray(faqs) ? faqs : [],
      examples: Array.isArray(examples) ? examples : [],
      chartConfig: chartConfig || { enabled: false, chartType: 'donut', title: 'Breakdown', segments: [] },
      content: content || { formulaExplanation: '', usageInstructions: '', faqs: [] },
      seoTitle: seoTitle?.trim() || `${name.trim()} - Free Online Calculator`,
      seoDescription: seoDescription?.trim() || shortDescription?.trim() || '',
      seoKeywords: seoKeywords?.trim() || '',
      canonicalUrl: canonicalUrl?.trim() || undefined,
      ogTitle: ogTitle?.trim() || undefined,
      ogDescription: ogDescription?.trim() || undefined,
      ogImage: ogImage?.trim() || undefined,
      noIndex: Boolean(noIndex),
      order: typeof order === 'number' ? order : db.calculators.filter((c) => c.subcategoryId === subcategoryId).length + 1,
      isActive: isActive !== false,
      isFeatured: Boolean(isFeatured),
      isPopular: Boolean(isPopular),
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.calculators.push(newCalc);
    writeDb(db, 'admin_create_calculator');

    return res.status(201).json(newCalc);
  });

  app.put('/api/admin/calculators/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const calcIndex = db.calculators.findIndex((c) => c.id === id);
    if (calcIndex === -1) {
      return res.status(404).json({ error: 'Calculator not found' });
    }

    const {
      name,
      slug,
      shortDescription,
      categoryId,
      subcategoryId,
      engineType,
      fields,
      outputs,
      presets,
      modules,
      contentSections,
      faqs,
      examples,
      chartConfig,
      content,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      noIndex,
      order,
      isActive,
      isFeatured,
      isPopular,
    } = req.body;

    if (modules !== undefined) {
      if (!Array.isArray(modules) || modules.some((m) => !isValidModuleConfig(m))) {
        return res.status(400).json({ error: 'Invalid modules configuration: each module must have a valid boolean isEnabled property.' });
      }
    }

    const targetCatId = categoryId || db.calculators[calcIndex].categoryId;
    const targetSubId = subcategoryId || db.calculators[calcIndex].subcategoryId;

    let finalSlug = slug ? cleanSlug(slug) : db.calculators[calcIndex].slug;
    if (
      db.calculators.some(
        (c) => c.subcategoryId === targetSubId && c.slug === finalSlug && c.id !== id
      )
    ) {
      return res.status(400).json({ error: `Calculator slug "${finalSlug}" is already taken in this subcategory.` });
    }

    const updated: Calculator = {
      ...db.calculators[calcIndex],
      name: name?.trim() || db.calculators[calcIndex].name,
      slug: finalSlug,
      shortDescription: shortDescription !== undefined ? shortDescription.trim() : db.calculators[calcIndex].shortDescription,
      categoryId: targetCatId,
      subcategoryId: targetSubId,
      engineType: engineType !== undefined ? engineType : db.calculators[calcIndex].engineType,
      fields: Array.isArray(fields) ? fields : db.calculators[calcIndex].fields,
      outputs: Array.isArray(outputs) ? outputs : db.calculators[calcIndex].outputs,
      presets: Array.isArray(presets) ? presets : db.calculators[calcIndex].presets,
      modules: Array.isArray(modules) ? modules : db.calculators[calcIndex].modules,
      contentSections: Array.isArray(contentSections) ? contentSections : db.calculators[calcIndex].contentSections,
      faqs: Array.isArray(faqs) ? faqs : db.calculators[calcIndex].faqs,
      examples: Array.isArray(examples) ? examples : db.calculators[calcIndex].examples,
      chartConfig: chartConfig !== undefined ? chartConfig : db.calculators[calcIndex].chartConfig,
      content: content !== undefined ? content : db.calculators[calcIndex].content,
      seoTitle: seoTitle !== undefined ? seoTitle.trim() : db.calculators[calcIndex].seoTitle,
      seoDescription: seoDescription !== undefined ? seoDescription.trim() : db.calculators[calcIndex].seoDescription,
      seoKeywords: seoKeywords !== undefined ? seoKeywords.trim() : db.calculators[calcIndex].seoKeywords,
      canonicalUrl: canonicalUrl !== undefined ? canonicalUrl.trim() : db.calculators[calcIndex].canonicalUrl,
      ogTitle: ogTitle !== undefined ? ogTitle.trim() : db.calculators[calcIndex].ogTitle,
      ogDescription: ogDescription !== undefined ? ogDescription.trim() : db.calculators[calcIndex].ogDescription,
      ogImage: ogImage !== undefined ? ogImage.trim() : db.calculators[calcIndex].ogImage,
      noIndex: noIndex !== undefined ? Boolean(noIndex) : db.calculators[calcIndex].noIndex,
      order: typeof order === 'number' ? order : db.calculators[calcIndex].order,
      isActive: isActive !== undefined ? Boolean(isActive) : db.calculators[calcIndex].isActive,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : db.calculators[calcIndex].isFeatured,
      isPopular: isPopular !== undefined ? Boolean(isPopular) : db.calculators[calcIndex].isPopular,
      updatedAt: new Date().toISOString(),
    };

    db.calculators[calcIndex] = updated;
    writeDb(db, 'admin_update_calculator');

    return res.json(updated);
  });

  app.patch('/api/admin/calculators/:id/toggle', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const calc = db.calculators.find((c) => c.id === id);
    if (!calc) {
      return res.status(404).json({ error: 'Calculator not found' });
    }

    calc.isActive = !calc.isActive;
    calc.updatedAt = new Date().toISOString();
    writeDb(db);

    return res.json({ success: true, isActive: calc.isActive });
  });

  app.post('/api/admin/calculators/:id/duplicate', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const source = db.calculators.find((c) => c.id === id);
    if (!source) {
      return res.status(404).json({ error: 'Calculator not found' });
    }

    let copySlug = `${source.slug}-copy`;
    let count = 1;
    while (db.calculators.some((c) => c.subcategoryId === source.subcategoryId && c.slug === copySlug)) {
      count++;
      copySlug = `${source.slug}-copy-${count}`;
    }

    const cloned: Calculator = {
      ...JSON.parse(JSON.stringify(source)),
      id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: `${source.name} (Copy)`,
      slug: copySlug,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.calculators.push(cloned);
    writeDb(db);

    return res.status(201).json(cloned);
  });

  app.delete('/api/admin/calculators/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const db = readDb();
      const { id } = req.params;
      db.calculators = db.calculators.filter((c) => c.id !== id);
      writeDb(db, 'explicit_delete_calculator');
      return res.json({ success: true });
    } catch (err: any) {
      console.error('Error deleting calculator:', err);
      return res.status(500).json({ error: err.message || 'Failed to delete calculator' });
    }
  });

  app.post('/api/admin/calculators/reorder', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds array required' });
    }

    orderedIds.forEach((id: string, index: number) => {
      const calc = db.calculators.find((c) => c.id === id);
      if (calc) calc.order = index + 1;
    });

    writeDb(db);
    return res.json({ success: true });
  });

  // ==========================================
  // ADMIN BLOG API ENDPOINTS
  // ==========================================
  app.get('/api/admin/blogs', requireAdmin, (_req: Request, res: Response) => {
    const db = readDb();
    return res.json(db.posts || []);
  });

  app.post('/api/admin/blogs', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const body = req.body;
    if (!body.title) {
      return res.status(400).json({ error: 'Post title is required' });
    }

    const newPost = {
      id: `post_${Date.now()}`,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: body.title,
      excerpt: body.excerpt || '',
      content: body.content || '',
      featuredImage: body.featuredImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      category: body.category || 'Tax Planning',
      tags: Array.isArray(body.tags) ? body.tags : [],
      author: body.author || {
        name: 'CA Rajesh Sharma',
        role: 'Senior Tax Consultant',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      status: body.status || 'published',
      publishedAt: body.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTimeMinutes: body.readTimeMinutes || 5,
      views: 0,
      isFeatured: Boolean(body.isFeatured),
      seoTitle: body.seoTitle || body.title,
      seoDescription: body.seoDescription || body.excerpt,
      seoKeywords: body.seoKeywords || [],
      embeddedCalculators: body.embeddedCalculators || []
    };

    if (!db.posts) db.posts = [];
    db.posts.unshift(newPost);
    try {
        writeDb(db, 'create_blog_post');
    } catch (err: any) {
        console.error('Error writing blog post:', err);
        return res.status(500).json({ error: 'Database write error' });
    }

    return res.json(newPost);
  });

  app.put('/api/admin/blogs/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const id = req.params.id;
    const body = req.body;
    const index = (db.posts || []).findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    db.posts![index] = {
      ...db.posts![index],
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    try {
        writeDb(db, 'update_blog_post');
    } catch (err: any) {
        console.error('Error updating blog post:', err);
        return res.status(500).json({ error: 'Database write error' });
    }
    return res.json(db.posts![index]);
  });

  app.delete('/api/admin/blogs/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const id = req.params.id;
    const initialCount = (db.posts || []).length;
    db.posts = (db.posts || []).filter((p) => p.id !== id);

    if (db.posts.length === initialCount) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    writeDb(db, 'delete_blog_post');
    return res.json({ success: true });
  });

  app.patch('/api/admin/blogs/:id/toggle', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const id = req.params.id;
    if (!db.posts) db.posts = [];
    const index = db.posts.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const currentStatus = db.posts[index].status || 'draft';
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';

    db.posts[index] = {
      ...db.posts[index],
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    writeDb(db, 'toggle_blog_post_status');
    return res.json({ success: true, status: newStatus, post: db.posts[index] });
  });

  app.post('/api/admin/blogs/bulk-status', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { ids, status } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids must be an array' });
    }
    const targetStatus = status === 'published' ? 'published' : 'draft';

    if (!db.posts) db.posts = [];
    db.posts = db.posts.map((p) => {
      if (ids.includes(p.id)) {
        return {
          ...p,
          status: targetStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    writeDb(db, 'admin_bulk_status_blogs');
    return res.json({ success: true, count: ids.length, status: targetStatus });
  });

  app.post('/api/admin/blogs/bulk-delete', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids must be an array' });
    }

    if (!db.posts) db.posts = [];
    const initialCount = db.posts.length;
    db.posts = db.posts.filter((p) => !ids.includes(p.id));
    const deletedCount = initialCount - db.posts.length;

    writeDb(db, 'admin_bulk_delete_blogs');
    return res.json({ success: true, count: deletedCount });
  });

  // ==========================================
  // ADMIN BLOG CATEGORIES & SUBCATEGORIES API
  // ==========================================
  app.get('/api/admin/blog-categories', requireAdmin, (_req: Request, res: Response) => {
    const db = readDb();
    const categories = db.blogCategories || [];
    const subcategories = db.blogSubcategories || [];
    const posts = db.posts || [];

    const result = categories.map((cat) => {
      const catSubs = subcategories.filter((s) => s.blogCategoryId === cat.id);
      const catPosts = posts.filter(
        (p) => p.blogCategoryId === cat.id || p.category?.toLowerCase() === cat.name.toLowerCase()
      );
      return {
        ...cat,
        subcategoriesCount: catSubs.length,
        postCount: catPosts.length,
      };
    }).sort((a, b) => (a.order || 0) - (b.order || 0));

    return res.json(result);
  });

  app.post('/api/admin/blog-categories', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { name, slug, description, order, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Blog category name is required' });
    }

    let finalSlug = cleanSlug(slug || name);
    if (!finalSlug) {
      return res.status(400).json({ error: 'Invalid blog category slug' });
    }

    if (!db.blogCategories) db.blogCategories = [];
    if (db.blogCategories.some((c) => c.slug === finalSlug)) {
      return res.status(400).json({ error: `Blog category slug "${finalSlug}" is already taken.` });
    }

    const newCategory = {
      id: `bcat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || '',
      order: typeof order === 'number' ? order : db.blogCategories.length + 1,
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.blogCategories.push(newCategory);
    writeDb(db, 'admin_create_blog_category');

    return res.status(201).json(newCategory);
  });

  app.put('/api/admin/blog-categories/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    if (!db.blogCategories) db.blogCategories = [];
    const index = db.blogCategories.findIndex((c) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Blog category not found' });
    }

    const { name, slug, description, order, isActive } = req.body;

    let finalSlug = slug ? cleanSlug(slug) : db.blogCategories[index].slug;
    if (
      finalSlug !== db.blogCategories[index].slug &&
      db.blogCategories.some((c) => c.slug === finalSlug && c.id !== id)
    ) {
      return res.status(400).json({ error: `Blog category slug "${finalSlug}" is already taken.` });
    }

    const updated = {
      ...db.blogCategories[index],
      name: name?.trim() || db.blogCategories[index].name,
      slug: finalSlug,
      description: description !== undefined ? description.trim() : db.blogCategories[index].description,
      order: typeof order === 'number' ? order : db.blogCategories[index].order,
      isActive: isActive !== undefined ? Boolean(isActive) : db.blogCategories[index].isActive,
      updatedAt: new Date().toISOString(),
    };

    db.blogCategories[index] = updated;
    writeDb(db, 'admin_update_blog_category');

    return res.json(updated);
  });

  app.delete('/api/admin/blog-categories/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    if (!db.blogCategories) db.blogCategories = [];
    const initialCount = db.blogCategories.length;
    db.blogCategories = db.blogCategories.filter((c) => c.id !== id);

    if (db.blogCategories.length === initialCount) {
      return res.status(404).json({ error: 'Blog category not found' });
    }

    // Clean up or unassign associated blog subcategories
    if (db.blogSubcategories) {
      db.blogSubcategories = db.blogSubcategories.filter((s) => s.blogCategoryId !== id);
    }

    writeDb(db, 'admin_delete_blog_category');
    return res.json({ success: true });
  });

  app.post('/api/admin/blog-categories/bulk-status', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { ids, isActive } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids must be an array' });
    }
    if (!db.blogCategories) db.blogCategories = [];
    db.blogCategories = db.blogCategories.map((c) => {
      if (ids.includes(c.id)) {
        return { ...c, isActive: Boolean(isActive), updatedAt: new Date().toISOString() };
      }
      return c;
    });
    writeDb(db, 'admin_bulk_status_blog_category');
    return res.json({ success: true });
  });

  app.post('/api/admin/blog-categories/bulk-delete', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids must be an array' });
    }
    if (!db.blogCategories) db.blogCategories = [];
    db.blogCategories = db.blogCategories.filter((c) => !ids.includes(c.id));
    if (db.blogSubcategories) {
      db.blogSubcategories = db.blogSubcategories.filter((s) => !ids.includes(s.blogCategoryId));
    }
    writeDb(db, 'admin_bulk_delete_blog_category');
    return res.json({ success: true });
  });

  app.get('/api/admin/blog-subcategories', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { blogCategoryId } = req.query;
    let subcategories = db.blogSubcategories || [];
    const posts = db.posts || [];
    const categories = db.blogCategories || [];

    if (blogCategoryId && typeof blogCategoryId === 'string') {
      subcategories = subcategories.filter((s) => s.blogCategoryId === blogCategoryId);
    }

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    const result = subcategories.map((sub) => {
      const subPosts = posts.filter((p) => p.blogSubcategoryId === sub.id);
      return {
        ...sub,
        categoryName: categoryMap.get(sub.blogCategoryId) || 'Uncategorized',
        postCount: subPosts.length,
      };
    }).sort((a, b) => (a.order || 0) - (b.order || 0));

    return res.json(result);
  });

  app.post('/api/admin/blog-subcategories', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { blogCategoryId, name, slug, description, order, isActive } = req.body;

    if (!blogCategoryId) {
      return res.status(400).json({ error: 'Parent blog category is required' });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Blog subcategory name is required' });
    }

    let finalSlug = cleanSlug(slug || name);
    if (!finalSlug) {
      return res.status(400).json({ error: 'Invalid blog subcategory slug' });
    }

    if (!db.blogSubcategories) db.blogSubcategories = [];
    if (
      db.blogSubcategories.some(
        (s) => s.blogCategoryId === blogCategoryId && s.slug === finalSlug
      )
    ) {
      return res.status(400).json({ error: `Blog subcategory slug "${finalSlug}" is already taken in this category.` });
    }

    const newSubcategory = {
      id: `bsub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      blogCategoryId,
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || '',
      order: typeof order === 'number' ? order : db.blogSubcategories.length + 1,
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.blogSubcategories.push(newSubcategory);
    writeDb(db, 'admin_create_blog_subcategory');

    return res.status(201).json(newSubcategory);
  });

  app.put('/api/admin/blog-subcategories/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    if (!db.blogSubcategories) db.blogSubcategories = [];
    const index = db.blogSubcategories.findIndex((s) => s.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Blog subcategory not found' });
    }

    const { blogCategoryId, name, slug, description, order, isActive } = req.body;
    const targetCatId = blogCategoryId || db.blogSubcategories[index].blogCategoryId;

    let finalSlug = slug ? cleanSlug(slug) : db.blogSubcategories[index].slug;
    if (
      db.blogSubcategories.some(
        (s) => s.blogCategoryId === targetCatId && s.slug === finalSlug && s.id !== id
      )
    ) {
      return res.status(400).json({ error: `Blog subcategory slug "${finalSlug}" is already taken in this category.` });
    }

    const updated = {
      ...db.blogSubcategories[index],
      blogCategoryId: targetCatId,
      name: name?.trim() || db.blogSubcategories[index].name,
      slug: finalSlug,
      description: description !== undefined ? description.trim() : db.blogSubcategories[index].description,
      order: typeof order === 'number' ? order : db.blogSubcategories[index].order,
      isActive: isActive !== undefined ? Boolean(isActive) : db.blogSubcategories[index].isActive,
      updatedAt: new Date().toISOString(),
    };

    db.blogSubcategories[index] = updated;
    writeDb(db, 'admin_update_blog_subcategory');

    return res.json(updated);
  });

  app.delete('/api/admin/blog-subcategories/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    if (!db.blogSubcategories) db.blogSubcategories = [];
    const initialCount = db.blogSubcategories.length;
    db.blogSubcategories = db.blogSubcategories.filter((s) => s.id !== id);

    if (db.blogSubcategories.length === initialCount) {
      return res.status(404).json({ error: 'Blog subcategory not found' });
    }

    writeDb(db, 'admin_delete_blog_subcategory');
    return res.json({ success: true });
  });

  app.post('/api/admin/blog-subcategories/bulk-status', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { ids, isActive } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids must be an array' });
    }
    if (!db.blogSubcategories) db.blogSubcategories = [];
    db.blogSubcategories = db.blogSubcategories.map((s) => {
      if (ids.includes(s.id)) {
        return { ...s, isActive: Boolean(isActive), updatedAt: new Date().toISOString() };
      }
      return s;
    });
    writeDb(db, 'admin_bulk_status_blog_subcategory');
    return res.json({ success: true });
  });

  app.post('/api/admin/blog-subcategories/bulk-delete', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids must be an array' });
    }
    if (!db.blogSubcategories) db.blogSubcategories = [];
    db.blogSubcategories = db.blogSubcategories.filter((s) => !ids.includes(s.id));
    writeDb(db, 'admin_bulk_delete_blog_subcategory');
    return res.json({ success: true });
  });

  // ==========================================
  // ADMIN SETTINGS & BACKUP / RESTORE API
  // ==========================================
  app.get('/api/admin/settings', requireAdmin, (_req: Request, res: Response) => {
    const db = readDb();
    const { adminPasswordHash, ...safeSettings } = db.settings;
    return res.json({ ...safeSettings, hasPassword: Boolean(adminPasswordHash) });
  });

  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const {
      siteTitle,
      siteDescription,
      siteKeywords,
      brandName,
      adminUsername,
      newPassword,
      footerNotice,
      canonicalBaseUrl,
      contactEmail,
    } = req.body;

    if (siteTitle) db.settings.siteTitle = siteTitle.trim();
    if (siteDescription) db.settings.siteDescription = siteDescription.trim();
    if (siteKeywords) db.settings.siteKeywords = siteKeywords.trim();
    if (brandName) db.settings.brandName = brandName.trim();
    if (adminUsername) db.settings.adminUsername = adminUsername.trim();
    if (newPassword && newPassword.trim()) {
      db.settings.adminPasswordHash = newPassword.trim();
    }
    if (footerNotice !== undefined) db.settings.footerNotice = footerNotice.trim();
    if (canonicalBaseUrl !== undefined) db.settings.canonicalBaseUrl = canonicalBaseUrl.trim();
    if (contactEmail !== undefined) db.settings.contactEmail = contactEmail.trim();

    writeDb(db);

    const { adminPasswordHash, ...safeSettings } = db.settings;
    return res.json({ success: true, settings: safeSettings });
  });

  app.get('/api/admin/backup', requireAdmin, (_req: Request, res: Response) => {
    const db = readDb();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=calcplatform-backup-${new Date().toISOString().split('T')[0]}.json`);
    return res.json(db);
  });

  app.post('/api/admin/restore', requireAdmin, (req: Request, res: Response) => {
    const payload = req.body;
    if (!payload || !Array.isArray(payload.categories) || !Array.isArray(payload.subcategories) || !Array.isArray(payload.calculators)) {
      return res.status(400).json({ error: 'Invalid backup file format' });
    }

    const restoredDb: DatabaseSchema = {
      categories: payload.categories,
      subcategories: payload.subcategories,
      calculators: payload.calculators,
      settings: { ...defaultSettings, ...(payload.settings || {}) },
    };

    writeDb(restoredDb);
    return res.json({ success: true, message: 'Database restored successfully' });
  });

  app.get('/sitemap.xml', (req: Request, res: Response) => {
    const db = readDb();
    const baseUrl = db.settings.canonicalBaseUrl || 'https://calcplatform.org';
    
    const urls = [
      { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
      { loc: `${baseUrl}/blog`, changefreq: 'daily', priority: '0.8' },
    ];

    // Add blog posts
    (db.posts || []).filter(p => p.status === 'published').forEach(p => {
      urls.push({ loc: `${baseUrl}/blog/${p.slug}`, changefreq: 'weekly', priority: '0.7' });
    });

    // Add calculators
    (db.calculators || []).filter(c => c.isActive).forEach(c => {
      urls.push({ loc: `${baseUrl}/${c.slug}`, changefreq: 'weekly', priority: '0.9' });
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(u => `
  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // ==========================================
  // VITE / STATIC SERVING WITH SSR INITIAL DATA
  // ==========================================
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (isDev || !hasDist) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      // Skip API routes, Vite internals, and static file assets
      if (
        url.startsWith('/api') ||
        url.startsWith('/@') ||
        url.startsWith('/src') ||
        /\.(js|jsx|ts|tsx|css|json|png|jpe?g|gif|svg|ico|webp|woff2?|ttf|eot|map)$/i.test(url.split('?')[0])
      ) {
        return next();
      }

      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);

        const db = readDb();
        const initialRoute = resolveRouteData(url.split('?')[0], db);

        // Strict 404 handling
        if (!initialRoute || initialRoute.type === undefined) {
          return res.status(404).send('Page not found');
        }

        const categories = getPublicCategoriesData(db);
        const { adminPasswordHash, ...safeSettings } = db.settings;

        // Extract metadata
        const title = initialRoute.calculator?.seoTitle || initialRoute.post?.seoTitle || db.settings.siteTitle;
        const description = initialRoute.calculator?.seoDescription || initialRoute.post?.seoDescription || db.settings.siteDescription;

        // SSR Render: Inject rendered HTML if blog post
        let renderedContent = '';
        if (initialRoute.type === 'blog' && initialRoute.post?.content) {
            renderedContent = `<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 blog-content">${initialRoute.post.content}</div>`;
        }
        
        const jsonLd = getJsonLd(initialRoute, db.settings);
        const ssrScript = `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <script id="__SSR_DATA__">
      window.__INITIAL_ROUTE_DATA__ = ${JSON.stringify(initialRoute)};
      window.__INITIAL_CATEGORIES__ = ${JSON.stringify(categories)};
      window.__SITE_SETTINGS__ = ${JSON.stringify(safeSettings)};
    </script>
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
`;
        const html = template
            .replace('</head>', `${ssrScript}</head>`)
            .replace('<div id="root"></div>', `<div id="root">${renderedContent}</div>`);
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (err: any) {
        vite.ssrFixStacktrace(err);
        return next(err);
      }
    });
  } else {
    app.use(express.static(distPath, { index: false }));
    app.get('*', (req: Request, res: Response, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
        const db = readDb();
        const initialRoute = resolveRouteData(url.split('?')[0], db);

        // Strict 404 handling
        if (!initialRoute || initialRoute.type === undefined) {
          return res.status(404).send('Page not found');
        }

        const categories = getPublicCategoriesData(db);
        const { adminPasswordHash, ...safeSettings } = db.settings;

        // Extract metadata
        const title = initialRoute.calculator?.seoTitle || initialRoute.post?.seoTitle || db.settings.siteTitle;
        const description = initialRoute.calculator?.seoDescription || initialRoute.post?.seoDescription || db.settings.siteDescription;

        // SSR Render: Inject rendered HTML if blog post
        let renderedContent = '';
        if (initialRoute.type === 'blog' && initialRoute.post?.content) {
            renderedContent = `<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 blog-content">${initialRoute.post.content}</div>`;
        }
        
        const jsonLd = getJsonLd(initialRoute, db.settings);
        const ssrScript = `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <script id="__SSR_DATA__">
      window.__INITIAL_ROUTE_DATA__ = ${JSON.stringify(initialRoute)};
      window.__INITIAL_CATEGORIES__ = ${JSON.stringify(categories)};
      window.__SITE_SETTINGS__ = ${JSON.stringify(safeSettings)};
    </script>
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
`;
        const html = template
            .replace('</head>', `${ssrScript}</head>`)
            .replace('<div id="root"></div>', `<div id="root">${renderedContent}</div>`);
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});

// Guard against unhandled errors crashing the process
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception caught by global safety handler:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});

