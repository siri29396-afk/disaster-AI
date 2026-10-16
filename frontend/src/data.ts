export type Language = 'English' | 'Telugu' | 'Hindi'

export const disasters = [
  'flood', 'earthquake', 'cyclone', 'landslide', 'tsunami',
  'heatwave', 'wildfire', 'severe-storm', 'general',
] as const

export type DisasterType = typeof disasters[number]

export type Guide = {
  title: string
  before: string[]
  during: string[]
  after: string[]
  source: string
}

export const guides: Record<DisasterType, Guide> = {
  flood: {
    title: 'Flood',
    before: ['Monitor local authority warnings.', 'Protect important documents and prepare essentials.', 'Learn where to find official evacuation instructions.'],
    during: ['Move away from floodwater.', 'Never walk or drive through floodwater.', 'Follow instructions from local authorities.'],
    after: ['Return only when authorities say it is safe.', 'Avoid damaged buildings and electrical equipment.', 'Follow official drinking-water advisories.'],
    source: 'https://www.ready.gov/floods',
  },
  earthquake: {
    title: 'Earthquake',
    before: ['Secure heavy furniture.', 'Identify safer places in each room.', 'Practice Drop, Cover, and Hold On.'],
    during: ['Drop, Cover, and Hold On.', 'Stay away from windows.', 'If outdoors, move away from buildings and power lines.'],
    after: ['Expect aftershocks.', 'Avoid damaged structures.', 'Follow official emergency instructions.'],
    source: 'https://www.ready.gov/earthquakes',
  },
  cyclone: {
    title: 'Cyclone',
    before: ['Monitor official cyclone warnings.', 'Secure loose outdoor objects.', 'Prepare supplies and review official evacuation arrangements.'],
    during: ['Stay in a secure shelter and away from windows.', 'Follow local authority instructions.', 'Do not go outside during a temporary lull.'],
    after: ['Avoid fallen electrical wires.', 'Stay away from damaged buildings.', 'Wait for official clearance before returning.'],
    source: 'https://www.ready.gov/hurricanes',
  },
  landslide: {
    title: 'Landslide',
    before: ['Learn about local slope hazards.', 'Monitor official rainfall warnings.', 'Know how to receive local evacuation instructions.'],
    during: ['Follow official evacuation instructions.', 'Stay away from unstable slopes and affected waterways.', 'Do not enter restricted areas.'],
    after: ['Stay away from the affected area.', 'Watch for additional slope movement.', 'Follow local authority instructions.'],
    source: 'https://www.ready.gov/landslides-debris-flow',
  },
  tsunami: {
    title: 'Tsunami',
    before: ['Learn whether your area has tsunami risk.', 'Know local evacuation procedures and official alert sources.', 'Prepare essential supplies.'],
    during: ['Follow official evacuation instructions immediately.', 'Move away from the coast as directed by authorities.', 'Do not return until officials give the all-clear.'],
    after: ['Stay away from flooded and damaged areas.', 'Expect that more than one wave may occur.', 'Follow official updates before returning.'],
    source: 'https://www.ready.gov/tsunamis',
  },
  heatwave: {
    title: 'Heatwave',
    before: ['Plan how to stay cool and hydrated.', 'Check on people who may need assistance.', 'Learn local heat-health guidance.'],
    during: ['Follow local health authority advice.', 'Limit strenuous activity during the hottest periods.', 'Seek urgent medical help for signs of heat illness.'],
    after: ['Continue checking on household members.', 'Follow local health advisories.', 'Replace used supplies.'],
    source: 'https://www.ready.gov/heat',
  },
  wildfire: {
    title: 'Wildfire',
    before: ['Monitor official wildfire advisories.', 'Prepare essential supplies and important documents.', 'Plan how to receive evacuation notifications.'],
    during: ['Follow official evacuation orders.', 'Avoid smoke exposure where possible.', 'Do not enter restricted fire areas.'],
    after: ['Return only after official clearance.', 'Avoid unstable or damaged structures.', 'Follow local air-quality advisories.'],
    source: 'https://www.ready.gov/wildfires',
  },
  'severe-storm': {
    title: 'Severe storm',
    before: ['Monitor official weather alerts.', 'Secure loose outdoor objects when safe.', 'Prepare a way to receive emergency information.'],
    during: ['Follow official shelter instructions.', 'Stay away from windows during severe conditions.', 'Avoid flooded roads and downed power lines.'],
    after: ['Avoid damaged buildings and power lines.', 'Follow official cleanup and water advisories.', 'Wait for authorities before entering restricted areas.'],
    source: 'https://www.ready.gov/thunderstorms-lightning',
  },
  general: {
    title: 'General preparedness',
    before: ['Make a household communication plan.', 'Prepare supplies for your household needs.', 'Keep copies of important documents accessible.'],
    during: ['Follow official instructions for your location.', 'Use trusted official channels for current information.', 'Contact local emergency services if in immediate danger.'],
    after: ['Return only when authorities say it is safe.', 'Avoid damaged utilities and structures.', 'Check on household members and follow official advisories.'],
    source: 'https://www.ready.gov/plan',
  },
}

type TranslatedGuide = Pick<Guide, 'title' | 'before' | 'during' | 'after'>

export const translatedGuides: Record<Exclude<Language, 'English'>, Record<DisasterType, TranslatedGuide>> = {
  Telugu: {
    flood: { title: 'వరద', before: ['అధికారిక వరద హెచ్చరికలను గమనించండి.', 'ముఖ్యమైన పత్రాలను భద్రపరచి అవసరమైన సరుకులు సిద్ధం చేయండి.', 'అధికారిక తరలింపు సూచనలు ఎక్కడ లభిస్తాయో తెలుసుకోండి.'], during: ['వరద నీటికి దూరంగా వెళ్లండి.', 'వరద నీటిలో నడవకండి లేదా వాహనం నడపకండి.', 'స్థానిక అధికారుల సూచనలు పాటించండి.'], after: ['అధికారులు సురక్షితమని చెప్పిన తర్వాతే తిరిగి వెళ్లండి.', 'దెబ్బతిన్న భవనాలు, విద్యుత్ పరికరాలకు దూరంగా ఉండండి.', 'అధికారిక తాగునీటి సూచనలు పాటించండి.'] },
    earthquake: { title: 'భూకంపం', before: ['బరువైన ఫర్నిచర్‌ను బిగించండి.', 'ప్రతి గదిలో సురక్షితమైన ప్రదేశాలను గుర్తించండి.', 'వంగండి, కప్పుకోండి, పట్టుకోండి అనే పద్ధతిని అభ్యసించండి.'], during: ['వంగి, కప్పుకుని, పట్టుకోండి.', 'కిటికీలకు దూరంగా ఉండండి.', 'బయట ఉంటే భవనాలు, విద్యుత్ తీగలకు దూరంగా వెళ్లండి.'], after: ['తదుపరి ప్రకంపనలకు సిద్ధంగా ఉండండి.', 'దెబ్బతిన్న నిర్మాణాల్లోకి వెళ్లకండి.', 'అధికారిక అత్యవసర సూచనలు పాటించండి.'] },
    cyclone: { title: 'తుఫాను', before: ['అధికారిక తుఫాను హెచ్చరికలను గమనించండి.', 'బయట ఉన్న వదులైన వస్తువులను సురక్షితంగా బిగించండి.', 'అవసరమైన సరుకులు సిద్ధం చేసి అధికారిక తరలింపు ఏర్పాట్లు తెలుసుకోండి.'], during: ['సురక్షితమైన ఆశ్రయంలో కిటికీలకు దూరంగా ఉండండి.', 'స్థానిక అధికారుల సూచనలు పాటించండి.', 'తుఫాను మధ్యలో తాత్కాలిక ప్రశాంతత వచ్చినా బయటకు వెళ్లకండి.'], after: ['పడిపోయిన విద్యుత్ తీగలకు దూరంగా ఉండండి.', 'దెబ్బతిన్న భవనాల వద్దకు వెళ్లకండి.', 'అధికారులు అనుమతించిన తర్వాతే తిరిగి వెళ్లండి.'] },
    landslide: { title: 'కొండచరియలు విరిగిపడటం', before: ['స్థానిక వాలు ప్రాంతాల ప్రమాదాల గురించి తెలుసుకోండి.', 'అధికారిక వర్షపాతం హెచ్చరికలను గమనించండి.', 'అధికారిక తరలింపు సూచనలు ఎలా పొందాలో తెలుసుకోండి.'], during: ['అధికారిక తరలింపు సూచనలను వెంటనే పాటించండి.', 'అస్థిరమైన వాలులు, ప్రభావిత జలమార్గాలకు దూరంగా ఉండండి.', 'నిషేధిత ప్రాంతాల్లోకి వెళ్లకండి.'], after: ['ప్రభావిత ప్రాంతానికి దూరంగా ఉండండి.', 'మళ్లీ నేల కదలికలు వచ్చే అవకాశంపై అప్రమత్తంగా ఉండండి.', 'స్థానిక అధికారుల సూచనలు పాటించండి.'] },
    tsunami: { title: 'సునామీ', before: ['మీ ప్రాంతంలో సునామీ ప్రమాదం ఉందో తెలుసుకోండి.', 'స్థానిక తరలింపు విధానాలు, అధికారిక హెచ్చరిక మూలాలు తెలుసుకోండి.', 'అత్యవసర సరుకులు సిద్ధం చేయండి.'], during: ['అధికారిక తరలింపు సూచనలను వెంటనే పాటించండి.', 'అధికారులు సూచించినట్లుగా తీర ప్రాంతం నుంచి దూరంగా వెళ్లండి.', 'అధికారులు అనుమతించే వరకు తిరిగి వెళ్లకండి.'], after: ['ముంపు ప్రాంతాలు, దెబ్బతిన్న ప్రదేశాలకు దూరంగా ఉండండి.', 'ఒకటి కంటే ఎక్కువ అలలు రావచ్చు.', 'తిరిగి వెళ్లే ముందు అధికారిక సమాచారాన్ని అనుసరించండి.'] },
    heatwave: { title: 'వడగాల్పులు', before: ['చల్లగా ఉండటానికి, నీరు తాగడానికి ముందస్తు ప్రణాళిక చేయండి.', 'సహాయం అవసరమైన వారిని సంప్రదించండి.', 'స్థానిక ఆరోగ్య అధికారుల సూచనలు తెలుసుకోండి.'], during: ['స్థానిక ఆరోగ్య అధికారుల సలహా పాటించండి.', 'అత్యంత వేడి సమయంలో శ్రమతో కూడిన పనులు తగ్గించండి.', 'వేడి అనారోగ్య లక్షణాలు ఉంటే వైద్య సహాయం పొందండి.'], after: ['కుటుంబ సభ్యుల పరిస్థితిని గమనిస్తూ ఉండండి.', 'స్థానిక ఆరోగ్య సూచనలు పాటించండి.', 'ఉపయోగించిన సరుకులను తిరిగి సిద్ధం చేయండి.'] },
    wildfire: { title: 'అడవి మంటలు', before: ['అధికారిక అడవి మంటల హెచ్చరికలను గమనించండి.', 'అత్యవసర సరుకులు, ముఖ్యమైన పత్రాలు సిద్ధం చేయండి.', 'తరలింపు సమాచారం ఎలా పొందాలో తెలుసుకోండి.'], during: ['అధికారిక తరలింపు ఆదేశాలు పాటించండి.', 'సాధ్యమైనంతవరకు పొగకు గురికాకుండా ఉండండి.', 'నిషేధిత అగ్ని ప్రాంతాల్లోకి వెళ్లకండి.'], after: ['అధికారులు అనుమతించిన తర్వాతే తిరిగి వెళ్లండి.', 'అస్థిరమైన లేదా దెబ్బతిన్న భవనాలకు దూరంగా ఉండండి.', 'స్థానిక గాలి నాణ్యత సూచనలు పాటించండి.'] },
    'severe-storm': { title: 'తీవ్ర తుఫాను', before: ['అధికారిక వాతావరణ హెచ్చరికలను గమనించండి.', 'సురక్షితంగా ఉన్నప్పుడు బయట వదులైన వస్తువులను బిగించండి.', 'అత్యవసర సమాచారాన్ని పొందే మార్గం సిద్ధం చేసుకోండి.'], during: ['అధికారిక ఆశ్రయ సూచనలు పాటించండి.', 'తీవ్ర పరిస్థితుల్లో కిటికీలకు దూరంగా ఉండండి.', 'ముంపు రహదారులు, తెగిపోయిన విద్యుత్ తీగలకు దూరంగా ఉండండి.'], after: ['దెబ్బతిన్న భవనాలు, విద్యుత్ తీగలకు దూరంగా ఉండండి.', 'అధికారిక శుభ్రత, నీటి సూచనలు పాటించండి.', 'అధికారుల అనుమతి లేకుండా నిషేధిత ప్రాంతాల్లోకి వెళ్లకండి.'] },
    general: { title: 'సాధారణ సన్నద్ధత', before: ['కుటుంబ సమాచార ప్రణాళిక రూపొందించండి.', 'కుటుంబ అవసరాలకు తగిన సరుకులు సిద్ధం చేయండి.', 'ముఖ్యమైన పత్రాల ప్రతులను అందుబాటులో ఉంచండి.'], during: ['మీ ప్రాంతానికి సంబంధించిన అధికారిక సూచనలు పాటించండి.', 'తాజా సమాచారానికి విశ్వసనీయ అధికారిక వనరులను ఉపయోగించండి.', 'తక్షణ ప్రమాదంలో స్థానిక అత్యవసర సేవలను సంప్రదించండి.'], after: ['అధికారులు సురక్షితమని చెప్పిన తర్వాతే తిరిగి వెళ్లండి.', 'దెబ్బతిన్న విద్యుత్, గ్యాస్ సదుపాయాలకు దూరంగా ఉండండి.', 'కుటుంబ సభ్యులను సంప్రదించి అధికారిక సూచనలు పాటించండి.'] },
  },
  Hindi: {
    flood: { title: 'बाढ़', before: ['आधिकारिक बाढ़ चेतावनियों पर नज़र रखें।', 'महत्वपूर्ण दस्तावेज़ सुरक्षित रखें और आवश्यक सामान तैयार करें।', 'जानें कि आधिकारिक निकासी निर्देश कहाँ मिलेंगे।'], during: ['बाढ़ के पानी से दूर रहें।', 'बाढ़ के पानी में न चलें और न वाहन चलाएँ।', 'स्थानीय अधिकारियों के निर्देशों का पालन करें।'], after: ['अधिकारी सुरक्षित बताएँ तभी लौटें।', 'क्षतिग्रस्त इमारतों और बिजली के उपकरणों से दूर रहें।', 'आधिकारिक पेयजल सलाह का पालन करें।'] },
    earthquake: { title: 'भूकंप', before: ['भारी फर्नीचर को सुरक्षित करें।', 'हर कमरे में सुरक्षित स्थान पहचानें।', 'झुकें, ढकें और पकड़े रहें का अभ्यास करें।'], during: ['झुकें, ढकें और पकड़े रहें।', 'खिड़कियों से दूर रहें।', 'बाहर हों तो इमारतों और बिजली की तारों से दूर जाएँ।'], after: ['झटकों के बाद के लिए तैयार रहें।', 'क्षतिग्रस्त इमारतों से दूर रहें।', 'आधिकारिक आपात निर्देशों का पालन करें।'] },
    cyclone: { title: 'चक्रवात', before: ['आधिकारिक चक्रवात चेतावनियों पर नज़र रखें।', 'बाहर की ढीली वस्तुओं को सुरक्षित करें।', 'सामान तैयार रखें और आधिकारिक निकासी व्यवस्था जानें।'], during: ['सुरक्षित आश्रय में खिड़कियों से दूर रहें।', 'स्थानीय अधिकारियों के निर्देश मानें।', 'अस्थायी शांति के दौरान भी बाहर न जाएँ।'], after: ['गिरी हुई बिजली की तारों से दूर रहें।', 'क्षतिग्रस्त इमारतों के पास न जाएँ।', 'अधिकारियों की अनुमति के बाद ही लौटें।'] },
    landslide: { title: 'भूस्खलन', before: ['अपने क्षेत्र के ढलान संबंधी जोखिम जानें।', 'आधिकारिक वर्षा चेतावनियों पर नज़र रखें।', 'जानें कि आधिकारिक निकासी निर्देश कैसे मिलेंगे।'], during: ['आधिकारिक निकासी निर्देशों का तुरंत पालन करें।', 'अस्थिर ढलानों और प्रभावित जलमार्गों से दूर रहें।', 'प्रतिबंधित क्षेत्रों में प्रवेश न करें।'], after: ['प्रभावित क्षेत्र से दूर रहें।', 'आगे की मिट्टी खिसकने की संभावना पर सतर्क रहें।', 'स्थानीय अधिकारियों के निर्देश मानें।'] },
    tsunami: { title: 'सुनामी', before: ['जानें कि आपके क्षेत्र में सुनामी का जोखिम है या नहीं।', 'स्थानीय निकासी प्रक्रिया और आधिकारिक चेतावनी स्रोत जानें।', 'आवश्यक आपूर्ति तैयार रखें।'], during: ['आधिकारिक निकासी निर्देशों का तुरंत पालन करें।', 'अधिकारियों के निर्देशानुसार तट से दूर जाएँ।', 'अधिकारियों की अनुमति से पहले वापस न लौटें।'], after: ['बाढ़ग्रस्त और क्षतिग्रस्त क्षेत्रों से दूर रहें।', 'एक से अधिक लहरें आ सकती हैं।', 'लौटने से पहले आधिकारिक जानकारी की प्रतीक्षा करें।'] },
    heatwave: { title: 'लू', before: ['ठंडा रहने और पानी पीने की योजना बनाएँ।', 'जिन लोगों को सहायता चाहिए उनसे संपर्क करें।', 'स्थानीय स्वास्थ्य अधिकारियों की सलाह जानें।'], during: ['स्थानीय स्वास्थ्य सलाह का पालन करें।', 'सबसे गर्म समय में कठिन गतिविधियाँ सीमित करें।', 'लू के लक्षण हों तो तुरंत चिकित्सकीय सहायता लें।'], after: ['परिवार के लोगों की स्थिति देखते रहें।', 'स्थानीय स्वास्थ्य सलाह का पालन करें।', 'उपयोग की गई आपूर्ति फिर से तैयार करें।'] },
    wildfire: { title: 'जंगल की आग', before: ['आधिकारिक जंगल की आग संबंधी सूचनाएँ देखें।', 'आवश्यक सामान और महत्वपूर्ण दस्तावेज़ तैयार रखें।', 'निकासी सूचनाएँ पाने का तरीका तय करें।'], during: ['आधिकारिक निकासी आदेशों का पालन करें।', 'जहाँ संभव हो धुएँ से बचें।', 'प्रतिबंधित आग वाले क्षेत्रों में न जाएँ।'], after: ['अधिकारियों की अनुमति के बाद ही लौटें।', 'अस्थिर या क्षतिग्रस्त इमारतों से दूर रहें।', 'स्थानीय वायु गुणवत्ता सलाह का पालन करें।'] },
    'severe-storm': { title: 'भीषण तूफ़ान', before: ['आधिकारिक मौसम चेतावनियों पर नज़र रखें।', 'सुरक्षित होने पर बाहर की ढीली वस्तुएँ सुरक्षित करें।', 'आपात जानकारी पाने का तरीका तैयार रखें।'], during: ['आधिकारिक आश्रय निर्देशों का पालन करें।', 'खराब मौसम में खिड़कियों से दूर रहें।', 'जलमग्न सड़कों और गिरी बिजली की तारों से दूर रहें।'], after: ['क्षतिग्रस्त इमारतों और बिजली की तारों से दूर रहें।', 'आधिकारिक सफ़ाई और पानी संबंधी सलाह मानें।', 'अनुमति के बिना प्रतिबंधित क्षेत्रों में न जाएँ।'] },
    general: { title: 'सामान्य तैयारी', before: ['परिवार के लिए संपर्क योजना बनाएँ।', 'परिवार की ज़रूरतों के अनुसार आपूर्ति तैयार रखें।', 'महत्वपूर्ण दस्तावेज़ों की प्रतियाँ सुलभ रखें।'], during: ['अपने क्षेत्र के आधिकारिक निर्देशों का पालन करें।', 'वर्तमान जानकारी के लिए भरोसेमंद आधिकारिक स्रोत देखें।', 'तत्काल खतरे में स्थानीय आपात सेवाओं से संपर्क करें।'], after: ['अधिकारी सुरक्षित बताएँ तभी लौटें।', 'क्षतिग्रस्त बिजली और गैस सुविधाओं से दूर रहें।', 'परिवार से संपर्क करें और आधिकारिक सलाह मानें।'] },
  },
}

export const checklistDefaults = [
  { id: 'water', label: 'Drinking water', category: 'Essentials', quantity: 'Household-sized supply' },
  { id: 'food', label: 'Nonperishable food', category: 'Essentials', quantity: 'Household-sized supply' },
  { id: 'first-aid', label: 'First-aid supplies', category: 'Health', quantity: '1 kit' },
  { id: 'medicine', label: 'Essential prescribed medicines', category: 'Health', quantity: 'As needed' },
  { id: 'light', label: 'Flashlight and spare batteries', category: 'Tools', quantity: '1 set' },
  { id: 'power', label: 'Charged power bank', category: 'Communication', quantity: '1 or more' },
  { id: 'documents', label: 'Copies of important documents', category: 'Documents', quantity: 'Household set' },
  { id: 'hygiene', label: 'Personal hygiene supplies', category: 'Essentials', quantity: 'Household-sized supply' },
  { id: 'radio', label: 'Battery-powered or hand-crank radio', category: 'Communication', quantity: '1' },
  { id: 'whistle', label: 'Whistle', category: 'Tools', quantity: '1 per person' },
]

export const assessmentQuestions = [
  { id: 'supplies', label: 'Do you have essential emergency supplies for your household?' },
  { id: 'communication', label: 'Does your household have a plan for contacting one another?' },
  { id: 'meeting_place', label: 'Have you chosen a meeting place if household members are separated?' },
  { id: 'documents', label: 'Are important documents stored so you can access them if needed?' },
  { id: 'evacuation', label: 'Do you know where local authorities publish evacuation instructions?' },
  { id: 'contacts', label: 'Do you have important emergency contacts saved somewhere accessible?' },
  { id: 'medications', label: 'Have you planned for essential medicines and accessibility needs?' },
  { id: 'household_needs', label: 'Does your plan account for children, older adults, or pets?' },
] as const