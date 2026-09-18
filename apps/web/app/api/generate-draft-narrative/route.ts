import { NextRequest, NextResponse } from 'next/server';
import {
  ApplicationDraftState,
  GeneratedQuestionAnswer,
  DEFAULT_OFFICIAL_QUESTIONS_KA122,
  DEFAULT_OFFICIAL_QUESTIONS_KA121,
} from '../../../lib/application-draft-schema';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { draft, schoolProfile, questionId } = body as {
      draft: ApplicationDraftState;
      schoolProfile?: any;
      questionId?: string;
    };

    if (!draft) {
      return NextResponse.json(
        { error: 'Başvuru taslak verisi bulunamadı.' },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const project = process.env.VERTEX_AI_PROJECT || 'doc-to-meow';
    const location = process.env.VERTEX_AI_LOCATION || 'us-central1';
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Cloud Gemini API anahtarı (.env.local) bulunamadı.' },
        { status: 500 },
      );
    }

    const isKa121 = draft.formType === 'KA121';
    const questionsToProcess: GeneratedQuestionAnswer[] = isKa121
      ? DEFAULT_OFFICIAL_QUESTIONS_KA121
      : DEFAULT_OFFICIAL_QUESTIONS_KA122;

    const filteredQuestions = questionId
      ? questionsToProcess.filter((q) => q.id === questionId)
      : questionsToProcess;

    if (filteredQuestions.length === 0) {
      return NextResponse.json(
        { error: 'İşlenecek geçerli soru bulunamadı.' },
        { status: 400 },
      );
    }

    // Context aggregation for the prompt
    const schoolName =
      draft.context.applicantName || schoolProfile?.schoolName || 'Mesleki ve Teknik Anadolu Lisesi';
    const city = draft.context.applicantCity || schoolProfile?.city || 'Türkiye';
    const oid = draft.context.applicantOid || schoolProfile?.oid || 'E10000000';
    const projectTitle = draft.context.projectTitle || `${schoolName} Erasmus+ VET Mobility Project`;
    const projectAcronym = draft.context.projectAcronym || 'VET-MOBILITY';
    const targetCountries = (draft.activityDetails.targetCountries || ['Germany']).join(', ');
    const participants = draft.activityDetails.totalParticipants || 6;
    const durationDays = draft.activityDetails.standardDurationDays || 14;
    const hostName = draft.activityDetails.hostName || 'European Vocational Training & Internship Center';
    const mainVetField = draft.orgProfile?.vetProgramTypes?.join(', ') || 'Vocational Education & Technical Training';
    const needsSummary =
      draft.needs && draft.needs.length > 0
        ? draft.needs.map((n) => `- Need: ${n.title} (Evidence & Rationale: ${n.evidence}, Target Group: ${n.targetGroup})`).join('\n')
        : '- Need: Modern industrial automation and practical European workplace competences.';
    const objectivesSummary =
      draft.objectives && draft.objectives.length > 0
        ? draft.objectives.map((o) => `- Objective: ${o.title} (Indicator: ${o.targetIndicator}, Measurement: ${o.measurementTool})`).join('\n')
        : '- Objective: Enhance practical vocational skills and achieve international Europass Mobility certification.';
    const qualityPlan = draft.qualityTeam || ({} as any);

    // Helper: Clean and parse JSON safely
    const cleanAndParseJson = (raw: string): Array<{ id: string; answer: string }> => {
      let s = raw.trim();
      if (s.startsWith('```json')) {
        s = s.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      } else if (s.startsWith('```')) {
        s = s.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      s = s.trim();

      const stripMarkdownStyles = (text: string): string => {
        if (!text) return '';
        return text
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/__(.*?)__/g, '$1')
          .replace(/^#{1,6}\s+/gm, '')
          .trim();
      };

      // 1. Direct parse
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          return parsed.map((p) => ({ ...p, answer: stripMarkdownStyles(p.answer) }));
        }
        if (parsed && typeof parsed === 'object' && parsed.id && parsed.answer) {
          return [{ id: parsed.id, answer: stripMarkdownStyles(parsed.answer) }];
        }
      } catch (e1) {
        // 2. Fix unescaped control characters (newlines/tabs inside strings)
        try {
          const sanitized = s.replace(/[\u0000-\u001F]+/g, (match) => {
            if (match === '\n') return '\\n';
            if (match === '\r') return '\\r';
            if (match === '\t') return '\\t';
            return '';
          });
          const parsed = JSON.parse(sanitized);
          if (Array.isArray(parsed)) {
            return parsed.map((p) => ({ ...p, answer: stripMarkdownStyles(p.answer) }));
          }
        } catch (e2) {
          // 3. Fallback: regex extraction of { id, answer } pairs
          const extracted: Array<{ id: string; answer: string }> = [];
          const objRegex = /\{\s*"id"\s*:\s*"([^"]+)"\s*,\s*"answer"\s*:\s*"([\s\S]*?)(?="\s*\}\s*(?:,|$|\]))/g;
          let m;
          while ((m = objRegex.exec(s)) !== null) {
            extracted.push({
              id: m[1],
              answer: stripMarkdownStyles(m[2].replace(/\\n/g, '\n').replace(/\\"/g, '"')),
            });
          }
          if (extracted.length > 0) return extracted;
          throw e1;
        }
      }
      return [];
    };

    // Helper to call Vertex AI for a specific batch of questions (max 3 at a time to prevent token overflow)
    const callVertexForBatch = async (batchQuestions: GeneratedQuestionAnswer[]): Promise<Array<{ id: string; answer: string }>> => {
      const questionsPayload = batchQuestions.map((q) => ({
        id: q.id,
        code: q.code,
        questionEn: q.questionEn || q.question,
        evaluatorCriteria: q.evaluatorCriteria || 'European Commission Quality Assessment Standards',
      }));

      const promptSystem = `You are a Senior European Commission Erasmus+ Expert Evaluator and Lead VET Project Drafter.
Your task is to write high-scoring, evaluator-grade narrative answers for an Erasmus+ VET (${draft.formType}) Application Form based on the applicant organisation's real data.

MANDATORY RULES & STANDARDS:
1. OUTPUT LANGUAGE: ALL ANSWERS MUST BE STRICTLY WRITTEN IN FORMAL, PROFESSIONAL, AND PERSUASIVE ENGLISH. Do NOT write in Turkish or any other language.
2. CRITICAL PLAIN-TEXT RULE: DO NOT use markdown bolding (e.g. **word**), italics (*word*), or markdown headers. The text will be pasted directly into plain-text input fields on the official European Commission portal. Write purely in clean, standard plain-text paragraphs without any asterisks or formatting symbols.
3. ADHERENCE TO OFFICIAL EU EVALUATION CRITERIA (European Commission "Guide for Experts on Quality Assessment"):
   - Award Criterion 1: Relevance of the Project (Max 30 pts): Ground every answer in authentic institutional needs. Avoid generic boilerplate. Explicitly link the vocational profile of the school to EU priorities (Inclusion & Diversity, Green Transition, Digital Skills).
   - Award Criterion 2: Quality of Project Design & Implementation (Max 40 pts): 
     * Define learning outcomes in line with ECVET and EQF descriptors: Knowledge (theoretical), Skills (practical), and Responsibility/Autonomy (workplace behavior, problem solving).
     * Detail a transparent participant selection procedure with clear percentage weighting (e.g. 30% Academic performance, 30% Vocational motivation, 20% Language assessment, 20% Interview), a formal selection committee, an appeals procedure, and inclusion quotas for participants with fewer opportunities.
     * Articulate a structured 4-pillar preparatory phase: Pedagogical preparation (tasks & technical briefings), Linguistic preparation (Erasmus+ Online Language Support - OLS & specialized terminology), Intercultural orientation (norms & workplace culture), and Occupational Health and Safety (OHS / workshop safety regulations).
     * Detail hosting & workplace mentorship: in-company tutors, daily logbooks, bilateral learning agreements, regular check-ins, and safe accommodation.
   - Award Criterion 3: Quality of Follow-up Actions (Max 30 pts):
     * Formal validation and recognition through the Europass Mobility document and institutional certification.
     * Concrete institutional integration: transferring acquired European know-how directly into school workshop syllabi and peer training for teachers and non-mobile students.
     * Multi-tiered dissemination plan: internal school presentations (Erasmus Days), local business/chamber meetings, regional education directorate exhibitions, and online channels (EPALE, European Project Results Platform - EPRP).
     * Comprehensive risk management: 24/7 crisis hotline, comprehensive medical and third-party liability insurance, embassy/consular registration, and clear emergency response protocols.
3. CONCRETE DATA INTEGRATION: Integrate the school name (${schoolName}), city (${city}), OID (${oid}), project title (${projectTitle}), acronym (${projectAcronym}), host partner (${hostName}), destination (${targetCountries}), participant numbers (${participants} learners for ${durationDays} days), and vocational fields seamlessly into the text. Do NOT leave generic placeholders like "[Insert name]".
4. TONE & LENGTH: Write well-developed, coherent paragraphs (approximately 250-400 words per question) addressing the specific evaluator criteria.

INSTITUTIONAL AND MOBILITY PROJECT DATA:
- Applicant Organisation: ${schoolName} (${city}, Türkiye - OID: ${oid})
- Application Form Type: ${draft.formType} (${isKa121 ? 'Accredited VET Grant Allocation' : 'Short-term Project for Mobility of Learners and Staff in VET - KA122-VET'})
- Project Title: ${projectTitle} (${projectAcronym})
- Duration & Dates: ${draft.context.projectDurationMonths || 12} Months (Start: ${draft.context.projectStartDate || '2026-10-01'})
- Vocational Sectors / Programs: ${mainVetField}
- Destination Country & Hosting Partner: ${targetCountries} | ${hostName}
- Mobility Scale: ${participants} VET learners (${durationDays} days standard duration + ${draft.activityDetails.travelDaysPerPerson || 2} travel days)
- Accompanying Persons: ${draft.activityDetails.accompanyingRequired ? `${draft.activityDetails.accompanyingCount} teacher(s) (Reason: ${draft.activityDetails.accompanyingReason})` : 'None required'}
- Travel & Sustainability: ${draft.activityDetails.mainTravelMode} (${draft.activityDetails.greenTravelParticipantsCount} participant(s) using Green Travel)
- Identified Needs & Rationale:
${needsSummary}
- SMART Objectives & Targets:
${objectivesSummary}
- Operational Quality & Team Plans:
  * Selection: ${qualityPlan.selectionCriteriaSummary || 'Transparent weighted criteria (Academic, motivation, language, interview) with fewer-opportunities quota'}
  * Preparation: ${qualityPlan.preparationPlanSummary || '20h vocational language coaching, OLS, intercultural orientation, and OHS safety induction'}
  * Inclusion: ${qualityPlan.inclusionApproach || 'Equal opportunity, dedicated economic and social barrier mitigation'}
  * Green & Digital: ${qualityPlan.greenPractices || 'Paperless documentation, low-emission travel, and EU digital platforms (OLS, Europass)'}
  * Mentorship & Monitoring: ${qualityPlan.monitoringMentorshipPlan || 'Weekly designated in-company mentor assessments and accompanying teacher supervision'}
  * Safety & Crisis: ${qualityPlan.emergencyCrisisProtocol || '24/7 emergency response contact, full health/travel insurance, consular registration'}
  * Dissemination: ${qualityPlan.internalDissemination || 'Erasmus Days workshops, local chamber of commerce seminars, EPALE publication'}
  * Curriculum Transfer: ${qualityPlan.institutionalIntegrationPlan || 'Workshop syllabus update and peer-to-peer knowledge sharing'}

OFFICIAL QUESTIONS TO ANSWER IN THIS BATCH:
${JSON.stringify(questionsPayload, null, 2)}

OUTPUT FORMAT:
Return strictly a valid JSON array of objects with id and answer:
[
  {
    "id": "question-id",
    "answer": "Detailed, formal, evaluator-grade English answer addressing all sub-criteria..."
  }
]`;

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
              parts: [{ text: promptSystem }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!vertexResponse.ok) {
        const errBody = await vertexResponse.text();
        console.error('Vertex AI error response:', vertexResponse.status, errBody);
        throw new Error(`Vertex AI API hatası (${vertexResponse.status}): ${errBody.slice(0, 150)}`);
      }

      const vertexData = await vertexResponse.json();
      const candidateText = vertexData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!candidateText) {
        throw new Error('Yapay zeka modelinden boş yanıt döndü.');
      }

      return cleanAndParseJson(candidateText);
    };

    // Process questions in batches of maximum 3 concurrently using Promise.all for fast completion
    const batchSize = 3;
    const batches: GeneratedQuestionAnswer[][] = [];
    for (let i = 0; i < filteredQuestions.length; i += batchSize) {
      batches.push(filteredQuestions.slice(i, i + batchSize));
    }

    const batchResultsArray = await Promise.all(
      batches.map(async (batch, idx) => {
        try {
          return await callVertexForBatch(batch);
        } catch (batchErr: any) {
          console.error(`Batch generation error for chunk ${idx}:`, batchErr);
          // If batch fails, fallback to individual questions in this batch
          const fallbackResults: Array<{ id: string; answer: string }> = [];
          for (const singleQ of batch) {
            try {
              const singleResult = await callVertexForBatch([singleQ]);
              fallbackResults.push(...singleResult);
            } catch (singleErr) {
              console.error(`Single question fallback error for ${singleQ.id}:`, singleErr);
            }
          }
          return fallbackResults;
        }
      }),
    );

    const allParsedResults = batchResultsArray.flat();

    if (allParsedResults.length === 0) {
      return NextResponse.json(
        { error: 'Yapay zeka yanıtı geçerli JSON formatına dönüştürülemedi.' },
        { status: 500 },
      );
    }

    // Merge answers into questions structure
    const updatedAnswers: GeneratedQuestionAnswer[] = questionsToProcess.map((item) => {
      const match = allParsedResults.find((p) => p.id === item.id);
      if (match && match.answer) {
        return {
          ...item,
          answer: match.answer.trim(),
          lastGeneratedAt: new Date().toISOString(),
        };
      }
      // If generating single question, preserve existing from draft if available
      const existing = draft.generatedAnswers?.find((ea) => ea.id === item.id);
      return existing || item;
    });

    return NextResponse.json({
      success: true,
      answers: updatedAnswers,
    });
  } catch (error: any) {
    console.error('Error generating draft narrative:', error);
    return NextResponse.json(
      { error: error?.message || 'Bilinmeyen bir sunucu hatası oluştu.' },
      { status: 500 },
    );
  }
}
