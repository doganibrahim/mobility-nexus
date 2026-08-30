import os

file_path = r'c:\dev\mobility-nexus\apps\web\app\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if "import { useAppStore }" not in content:
    content = content.replace("import { ParticipantType, MobilityGoal, HostType } from '@mobility-nexus/types';",
                              "import { ParticipantType, MobilityGoal, HostType } from '@mobility-nexus/types';\nimport { useAppStore } from '../lib/store';")

# 2. Replace the massive state block
# The start is around "// 1. School Profile State"
# The end is around "const [transversalOutcome, setTransversalOutcome] = useState('');"

start_marker = "  // 1. School Profile State"
end_marker = "  const [transversalOutcome, setTransversalOutcome] = useState('');"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker) + len(end_marker)

replacement_state = """  // --- ZUSTAND STORE INTEGRATION ---
  const store = useAppStore();

  // 1. School Profile State
  const { schoolName, city, accredited, oid, erasmusPlan, institutionNeed } = store.schoolProfile;
  const setSchoolName = (v: string) => store.setSchoolProfile({ schoolName: v });
  const setCity = (v: string) => store.setSchoolProfile({ city: v });
  const setAccredited = (v: any) => store.setSchoolProfile({ accredited: v });
  const setOid = (v: string) => store.setSchoolProfile({ oid: v });
  const setErasmusPlan = (v: string) => store.setSchoolProfile({ erasmusPlan: v });
  const setInstitutionNeed = (v: string) => store.setSchoolProfile({ institutionNeed: v });

  // 2. Participant Profile State
  const { participantType, mobilityGoal, participantName, language, country, duration } = store.participantProfile;
  const setParticipantType = (v: any) => store.setParticipantProfile({ participantType: v });
  const setMobilityGoal = (v: any) => store.setParticipantProfile({ mobilityGoal: v });
  const setParticipantName = (v: string) => store.setParticipantProfile({ participantName: v });
  const setLanguage = (v: number) => store.setParticipantProfile({ language: v });
  const setCountry = (v: string) => store.setParticipantProfile({ country: v });
  const setDuration = (v: string) => store.setParticipantProfile({ duration: v });

  // 3. ESCO - ISCED State
  const { vetField, iscedCode, iscedName, escoTerm, iscoCode, escoUri, skills } = store.escoIsced;
  const setVetField = (v: string) => store.setEscoIsced({ vetField: v });
  const setIscedCode = (v: string) => store.setEscoIsced({ iscedCode: v });
  const setIscedName = (v: string) => store.setEscoIsced({ iscedName: v });
  const setEscoTerm = (v: string) => store.setEscoIsced({ escoTerm: v });
  const setIscoCode = (v: string) => store.setEscoIsced({ iscoCode: v });
  const setEscoUri = (v: string) => store.setEscoIsced({ escoUri: v });
  const setSkills = (v: string) => store.setEscoIsced({ skills: v });

  // 4. Competence Assessment & Gap State
  const { assessmentAnswers, competenceScore, assessmentResultMsg, assessmentResultType, targetScore, externalScore } = store.competence;
  const setAssessmentAnswers = (fn: any) => {
    store.setCompetence({ assessmentAnswers: typeof fn === 'function' ? fn(store.competence.assessmentAnswers) : fn });
  };
  const setCompetenceScore = (v: any) => store.setCompetence({ competenceScore: v });
  const setAssessmentResultMsg = (v: string) => store.setCompetence({ assessmentResultMsg: v });
  const setAssessmentResultType = (v: any) => store.setCompetence({ assessmentResultType: v });
  const setTargetScore = (v: number) => store.setCompetence({ targetScore: v });
  const setExternalScore = (v: string) => store.setCompetence({ externalScore: v });

  // 5. Decision Engine State
  const { decisionResult } = store.decisionEngine;
  const setDecisionResult = (v: any) => store.setDecisionEngine({ decisionResult: v });

  // 6. Host Matching State
  const { hostName, hostCountry, hostType, hostMetrics, hostScoreResult } = store.hostMatching;
  const setHostName = (v: string) => store.setHostMatching({ hostName: v });
  const setHostCountry = (v: string) => store.setHostMatching({ hostCountry: v });
  const setHostType = (v: any) => store.setHostMatching({ hostType: v });
  const setHostMetrics = (fn: any) => {
    store.setHostMatching({ hostMetrics: typeof fn === 'function' ? fn(store.hostMatching.hostMetrics) : fn });
  };
  const setHostScoreResult = (v: any) => store.setHostMatching({ hostScoreResult: v });

  // 7. Learning Outcomes State
  const { primaryGap, technicalOutcome, transversalOutcome } = store.learningOutcomes;
  const setPrimaryGap = (v: string) => store.setLearningOutcomes({ primaryGap: v });
  const setTechnicalOutcome = (v: string) => store.setLearningOutcomes({ technicalOutcome: v });
  const setTransversalOutcome = (v: string) => store.setLearningOutcomes({ transversalOutcome: v });"""

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + replacement_state + content[end_idx:]

# 3. Add buttons next to tabs
tab_bar_marker = """        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 py-2">"""
          
buttons_html_replacement = """        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
            <div className="grid grid-cols-2 sm:flex flex-wrap gap-1">"""

if tab_bar_marker in content:
    content = content.replace(tab_bar_marker, buttons_html_replacement)
    
tab_bar_end_marker = """                  </div>
                </button>
              );
            })}
          </div>
        </div>"""

tab_bar_end_replacement = """                  </div>
                </button>
              );
            })}
            </div>
            
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => { store.loadDemoData(locale); handleRefreshReport(); }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors shadow-xs"
              >
                ✨ Demo Verisi Yükle
              </button>
              <button
                onClick={() => { store.resetData(); setActiveTab('profile'); }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Sıfırla
              </button>
            </div>
          </div>
        </div>"""

if tab_bar_end_marker in content:
    content = content.replace(tab_bar_end_marker, tab_bar_end_replacement)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Migration script completed.")
