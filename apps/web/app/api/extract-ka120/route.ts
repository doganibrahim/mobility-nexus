import { NextRequest, NextResponse } from 'next/server';
import { Ka120ExtractedData } from '../../../lib/application-draft-schema';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Pdf, fileName } = body as {
      base64Pdf?: string;
      fileName?: string;
    };

    if (!base64Pdf) {
      return NextResponse.json(
        { success: false, error: 'Yüklenecek PDF verisi bulunamadı.' },
        { status: 400 },
      );
    }

    // Strip data url prefix if present (e.g. data:application/pdf;base64,...)
    const cleanBase64 = base64Pdf.replace(/^data:application\/pdf;base64,/, '');

    // Check file size (approximate decoded size: length * 0.75)
    // 8 MB = 8 * 1024 * 1024 = 8,388,608 bytes
    const approximateByteSize = (cleanBase64.length * 3) / 4;
    const MAX_BYTES = 8 * 1024 * 1024;
    if (approximateByteSize > MAX_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: "Yüklenen PDF dosyasının boyutu izin verilen 8 MB sınırını aşıyor.",
        },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const project = process.env.VERTEX_AI_PROJECT || 'doc-to-meow';
    const location = process.env.VERTEX_AI_LOCATION || 'us-central1';
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Cloud Gemini API anahtarı (.env.local) yapılandırılmamış.',
        },
        { status: 500 },
      );
    }

    const systemPrompt = `You are an expert European Commission Erasmus+ Application Auditor and Document Parser.
Your task is to analyze an uploaded PDF document and extract relevant Erasmus+ Accreditation (KA120 / KA120-VET / KA120-SCH / KA120-ADU) data.

FIRST: VALIDATE THE DOCUMENT
- Check if this document is an official Erasmus+ KA120 Accreditation application form, Erasmus Plan, or approved Erasmus+ accreditation document.
- If the document is NOT an Erasmus+ KA120 accreditation form (e.g., an unrelated CV, an invoice, a brochure, an unrelated grant form, or general random PDF), set:
  "isRecognizedKa120": false,
  "unrecognizedReason": "Yüklenen belge Erasmus+ KA120 VET akreditasyon formu olarak tanınamadı. Lütfen onaylanmış resmi Erasmus+ KA120 akreditasyon belgenizi yükleyiniz."
  and leave other fields empty.

SECOND: IF IT IS RECOGNIZED AS KA120
- Set "isRecognizedKa120": true, "unrecognizedReason": ""
- Extract the following fields from the PDF as accurately and completely as possible:
  1. applicantName: Official legal name of the applicant organisation (Kuruluş Resmi Adı).
  2. applicantOid: Organisation ID (OID, e.g. E10... or similar).
  3. applicantCity: City of the applicant organisation.
  4. accreditationCode: Accreditation application code or project reference (e.g. 2021-1-TR01-KA120-VET-... or form reference).
  5. projectTitle: Project title or Erasmus Plan title if specified.
  6. projectAcronym: Project acronym if specified.
  7. mainActivityType: One of 'VET_SCHOOL' | 'VET_PROVIDER' | 'COMPANY' | 'OTHER' based on organisation type.
  8. yearsOfVetExperience: Number of years of experience in this vocational role (integer).
  9. learnerProfileSummary: Learner age groups and profile summary (e.g. '15-18 yaş mesleki eğitim öğrencileri').
  10. totalVetLearnersCount: Total number of learners in the field (integer).
  11. teachingStaffCount: Number of teaching staff (integer).
  12. nonTeachingStaffCount: Number of non-teaching staff (integer).
  13. needs: Array of up to 3 needs mentioned in Background / Needs & Challenges:
      [ { "title": "...", "evidence": "...", "targetGroup": "..." } ]
  14. objectives: Array of objectives mentioned in Erasmus Plan Objectives:
      [ { "title": "...", "targetIndicator": "...", "measurementTool": "..." } ]
  15. qualityTeam:
      - inclusionApproach: Concrete measures for inclusion and diversity (Quality Standards Part I - Inclusion).
      - greenPractices: Concrete measures for environmental sustainability and green practices (Part I - Environmental sustainability).
      - digitalToolsUsage: Digital education and online platform usage (Part I - Digital education).
      - democraticParticipation: Active participation in the Erasmus network and democratic life (Part I - Active participation).
      - selectionCriteriaSummary: Participant selection criteria (Quality Standards Part III).
      - preparationPlanSummary: Pedagogical, linguistic and cultural preparation plan (Part III).
      - monitoringMentorshipPlan: Coordination, mentoring and monitoring (Part II & III).
      - institutionalIntegrationPlan: Integrating outcomes into regular school work / curriculum (Part II).
      - internalDissemination: Sharing results within the organisation (Part IV).
      - externalDissemination: Sharing results with other organisations and the public (Part IV).
      - euVisibilityMeasures: Publicly acknowledging European Union funding and logos (Part IV).
      - legalRepresentativeName: Legal representative name.
      - legalRepresentativeRole: Legal representative role (e.g. Okul Müdürü).
      - legalRepresentativeEmail: Legal representative email.
      - coordinatorName: Erasmus coordinator / contact person name.
      - coordinatorRole: Coordinator role.
      - coordinatorEmail: Coordinator email.
      - priorityTopics: Array of up to 3 relevant priority topic strings (e.g. ["Mesleki Eğitimde Dijital Beceriler ve Endüstri 4.0", "Yeşil Beceriler ve Sürdürülebilir Kalkınma"]).

OUTPUT FORMAT:
Respond strictly with valid JSON conforming to this structure:
{
  "isRecognizedKa120": true,
  "unrecognizedReason": "",
  "applicantName": "",
  "applicantOid": "",
  "applicantCity": "",
  "accreditationCode": "",
  "projectTitle": "",
  "projectAcronym": "",
  "mainActivityType": "VET_SCHOOL",
  "yearsOfVetExperience": 10,
  "learnerProfileSummary": "",
  "totalVetLearnersCount": 0,
  "teachingStaffCount": 0,
  "nonTeachingStaffCount": 0,
  "needs": [],
  "objectives": [],
  "qualityTeam": {
    "inclusionApproach": "",
    "greenPractices": "",
    "digitalToolsUsage": "",
    "democraticParticipation": "",
    "selectionCriteriaSummary": "",
    "preparationPlanSummary": "",
    "monitoringMentorshipPlan": "",
    "institutionalIntegrationPlan": "",
    "internalDissemination": "",
    "externalDissemination": "",
    "euVisibilityMeasures": "",
    "legalRepresentativeName": "",
    "legalRepresentativeRole": "",
    "legalRepresentativeEmail": "",
    "coordinatorName": "",
    "coordinatorRole": "",
    "coordinatorEmail": "",
    "priorityTopics": []
  }
}`;

    const vertexUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${project}/locations/${location}/publishers/google/models/${model}:generateContent?key=${apiKey}`;

    const vertexResponse = await fetch(vertexUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'application/pdf',
                  data: cleanBase64,
                },
              },
              {
                text: systemPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!vertexResponse.ok) {
      const errBody = await vertexResponse.text();
      console.error('Vertex AI error response during KA120 extraction:', vertexResponse.status, errBody);
      let userFriendlyMsg = `Yapay zeka analiz servisi hatası (${vertexResponse.status})`;
      if (errBody.includes('INVALID_ARGUMENT') || errBody.includes('no pages') || errBody.includes('corrupted')) {
        userFriendlyMsg = 'Yüklenen dosya geçerli veya okunabilir bir PDF belgesi değil. Lütfen orijinal resmi KA120 PDF dosyanızı yükleyiniz.';
      }
      return NextResponse.json(
        {
          success: false,
          error: userFriendlyMsg,
        },
        { status: 422 },
      );
    }

    const vertexData = await vertexResponse.json();
    const rawText = vertexData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(
        { success: false, error: 'Yapay zeka belgeden geçerli bir yanıt üretemedi.' },
        { status: 500 },
      );
    }

    // Clean markdown code blocks if present
    let jsonText = rawText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    jsonText = jsonText.trim();

    let parsedData: Ka120ExtractedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseErr) {
      console.error('Failed to parse AI JSON response:', jsonText, parseErr);
      return NextResponse.json(
        {
          success: false,
          error: 'Yapay zeka yanıtı geçerli bir JSON verisine dönüştürülemedi.',
        },
        { status: 500 },
      );
    }

    if (!parsedData.isRecognizedKa120) {
      return NextResponse.json(
        {
          success: false,
          error:
            parsedData.unrecognizedReason ||
            'KA120 VET formu tanınamadı. Lütfen onaylanmış resmi Erasmus+ KA120 VET akreditasyon başvuru belgenizi yükleyiniz.',
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Unexpected error in /api/extract-ka120:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'KA120 belgesi işlenirken beklenmeyen bir sunucu hatası oluştu.',
      },
      { status: 500 },
    );
  }
}
