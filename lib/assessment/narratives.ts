// lib/assessment/narratives.ts
import type { Role, AdaptsStage, Energy } from "./questions";
import { EnergyProfile } from "./scoring";

export interface NarrativeInput {
  primary_role: Role;
  secondary_role: Role;
  role_pair_title: string;
  energy_profile: EnergyProfile;
  top_adapts_stages: AdaptsStage[];
  bottom_adapts_stages: AdaptsStage[];
  stage_scores: Record<AdaptsStage, number>;
}
// Add this mapping function
const ROLE_NAME_MAP: Record<string, Role> = {
  Innovator: "Spotter",
  Achiever: "Driver",
  Organizer: "Preparer",
  Builder: "Activator",
  Refiner: "Stabilizer",
  Unifier: "Unifier",
};
const ENERGY_NAME_MAP: Record<string, Energy> = {
  Build: "Drive",
  Polish: "Shape",
  Spark: "Spark",
  Bond: "Bond",
};
export interface Narrative {
  // Cover / executive summary
  executive_summary: string;

  // Role section (like Working Genius)
  role_name: string;
  role_summary: string;
  role_detailed: string;
  role_benefits: string[];
  role_watchouts: string[];

  // Energy section
  energy_name: string;
  energy_summary: string;
  energy_detailed: string;
  energy_benefits: string[];
  energy_watchouts: string[];

  // ADAPTS strengths & growth
  adapts_strengths_summary: string;
  adapts_strengths_detailed: string;
  adapts_growth_summary: string;
  adapts_growth_detailed: string;

  // Pairing section (unique to primary+secondary)
  pairing_name: string;
  pairing_description: string;
  pairing_benefits: string[];
  pairing_watchouts: string[];
  pairing_icon?: string;

  // Team context
  individual_in_team: string;

  // 30-day action plan
  next_30_days: string[];

  // Additional pages (What is Change Genius?, How to apply)
  what_is_change_genius: string;
  how_to_apply_as_individual: string[];
  how_to_apply_as_team: string[];

  // entrepreneurship/business content (unique to individual report)
  entrepreneur_growth_pattern: string;
  revenue_leakage_pattern: string;
  best_business_focus: string;
  offer_feedback: {
    problem: string;
    audience: string;
    outcome: string;
    simplify: string;
    stop: string;
  };
  content_direction: {
    style: string;
    topics: string[];
    pain_points: string[];
    frequency: string;
    cta: string;
  };
  execution_recommendations: string[];
  next_best_move: {
    fix_first: string;
    stop_doing: string;
    start_doing: string;
    monetization_opportunity: string;
  };
}

// ── Entrepreneur content maps ──────────────────────────────────

const ROLE_GROWTH_PATTERN: Record<Role, string> = {
  Spotter:
    "You create value best when you are working at the edges of what is known — spotting emerging opportunities, reframing problems, and generating ideas that others haven't seen yet. Your business grows when your offer is anchored to a real insight, and when you have execution support around you. Revenue slows when you chase too many ideas, position too broadly, or rely on inspiration rather than a repeatable system.",
  Driver:
    "You create value best when you are moving — executing, delivering, and making tangible progress. Your business grows when you have a clear offer, a defined audience, and a consistent sales rhythm. Revenue slows when you are stuck in planning, unclear on your message, or spending energy on work that doesn't directly drive income.",
  Preparer:
    "You create value best when there is structure — a clear process, a defined offer, and a reliable delivery system. Your business grows when you package your knowledge into a repeatable, scalable offer. Revenue slows when you over-prepare without launching, or when your systems are so complex that only you can run them.",
  Unifier:
    "You create value best through relationships — trust, community, and connection. Your business grows through word of mouth, partnerships, and audiences that feel personally served by you. Revenue slows when you avoid direct offers, undercharge out of relationship sensitivity, or fail to convert goodwill into income.",
  Activator:
    "You create value best when you are translating strategy into action — aligning people, resources, and execution toward a clear outcome. Your business grows when your offer solves a specific operational or strategic problem for a defined client. Revenue slows when your positioning is too broad, your offer too complex, or your delivery inconsistent.",
  Stabilizer:
    "You create value best when you are improving and sustaining — optimising systems, refining quality, and creating reliable outcomes. Your business grows when you build offers around consistency, retention, and long-term client results. Revenue slows when you delay launching while perfecting, or when you fail to create systems that generate income without your constant presence.",
};

const STAGE_REVENUE_LEAKAGE: Record<AdaptsStage, string> = {
  "Alert the System":
    "You may be missing early market signals, shifts in customer demand, or emerging competition. Your offer may be positioned around a problem that is no longer urgent for your audience. Invest time in customer observation, competitor analysis, and industry trend monitoring before refining your offer.",
  "Diagnose the Gaps":
    "You may be building offers without deeply understanding the real problem your clients face. Symptoms get addressed, but root causes go untouched — leading to offers that feel generic or fail to convert. Invest in customer interviews, discovery conversations, and problem validation before scaling your offer.",
  "Access Readiness":
    "You may be launching without the structure, pricing clarity, or delivery system your offer requires. Clients say yes but the experience is inconsistent, which slows referrals and repeat business. Invest in offer packaging, onboarding design, and delivery workflows before pushing volume.",
  "Participate Through Dialogue":
    "You may struggle to connect your message with your audience. Trust is low, content doesn't convert, and potential clients don't feel understood. Invest in clearer messaging, audience-specific communication, and relationship-building before scaling paid acquisition.",
  "Transform Through Alignment":
    "You may have the strategy but struggle with consistent execution — selling, following up, delivering, and showing up repeatedly. Revenue is inconsistent because activity is inconsistent. Invest in a weekly sales and content rhythm, and track one revenue-driving action daily.",
  "Scale and Sustain":
    "You may start well but fail to maintain momentum — losing clients, dropping content, or abandoning systems after early success. Revenue spikes but doesn't compound. Invest in retention systems, recurring offer structures, and documented processes that don't depend solely on your energy.",
};

const STAGE_BUSINESS_FOCUS: Record<AdaptsStage, string> = {
  "Alert the System":
    "Spend one hour this week researching what your target client is most worried about right now. Reposition your offer around that specific, current pain point.",
  "Diagnose the Gaps":
    "Conduct three discovery conversations with potential clients this week. Ask only about their problems — not your solution. Use what you hear to sharpen your offer.",
  "Access Readiness":
    "Write out your complete offer delivery process from sale to completion. Identify the one step that is unclear or missing. Fix it before your next sale.",
  "Participate Through Dialogue":
    "Rewrite your core message in one sentence that speaks directly to your client's most painful problem. Test it in content or a direct outreach message this week.",
  "Transform Through Alignment":
    "Commit to one sales or content action every day for the next seven days. Do not break the chain. Consistency this week creates revenue next month.",
  "Scale and Sustain":
    "Identify your most successful client outcome and build a retention or referral offer around it. Create one repeatable system this week that doesn't require your direct involvement.",
};

const ROLE_OFFER_FEEDBACK: Record<
  Role,
  { problem: string; audience: string; outcome: string; simplify: string; stop: string }
> = {
  Spotter: {
    problem: "A problem that requires fresh thinking, trend awareness, or strategic reframing",
    audience: "Leaders or entrepreneurs who feel stuck in outdated thinking or missing the next opportunity",
    outcome: "A new direction, strategy, or framework that gives them clarity on where to move next",
    simplify: "Remove every deliverable that isn't directly tied to insight or strategic clarity",
    stop: "Selling broad consulting or general advisory without a specific, named outcome",
  },
  Driver: {
    problem: "A problem that requires faster execution, more accountability, or better results",
    audience: "Founders or professionals who know what to do but struggle to do it consistently",
    outcome: "Measurable progress on a specific goal within a defined timeframe",
    simplify: "Remove any deliverable that doesn't directly drive action or accountability",
    stop: "Taking on clients who aren't ready to execute — they will drain your energy",
  },
  Preparer: {
    problem: "A problem that requires better structure, clearer process, or more reliable systems",
    audience: "Entrepreneurs or teams who are doing good work but losing time, money, or clients to disorganisation",
    outcome: "A system, process, or framework they can use repeatedly without reinventing it",
    simplify: "Package your process into a fixed-scope offer rather than open-ended consulting",
    stop: "Custom work that can't be replicated — it limits your revenue ceiling",
  },
  Unifier: {
    problem: "A problem rooted in disconnection — team conflict, low trust, unclear culture, or weak client relationships",
    audience: "Leaders, teams, or communities that want deeper connection, alignment, or trust",
    outcome: "A stronger relationship, culture, or community that people actively choose to stay in",
    simplify: "Remove any deliverable that doesn't directly build connection or trust",
    stop: "Undercharging for relational work — connection is hard to build and highly valuable",
  },
  Activator: {
    problem: "A problem that requires better alignment between strategy and execution",
    audience: "Founders or leaders whose teams are busy but not moving in the right direction",
    outcome: "Clear roles, aligned priorities, and a team that executes with purpose",
    simplify: "Narrow your offer to one specific alignment or activation outcome",
    stop: "Trying to solve both strategic and operational problems in the same engagement",
  },
  Stabilizer: {
    problem: "A problem that requires better systems, higher quality, or more consistent results",
    audience: "Entrepreneurs or teams who are inconsistent, prone to rework, or unable to scale without chaos",
    outcome: "A reliable system, improved process, or measurably better outcome they can sustain",
    simplify: "Launch a done version before the perfect version — your first offer doesn't need to be final",
    stop: "Delaying your offer while you refine it — launch, learn, and improve in the market",
  },
};

const ROLE_CONTENT_DIRECTION: Record<
  Role,
  { style: string; topics: string[]; pain_points: string[]; frequency: string; cta: string }
> = {
  Spotter: {
    style: "Insight-led and forward-looking — share what others haven't seen yet",
    topics: ["Emerging trends in your industry", "Reframes of common assumptions", "Strategic questions worth asking"],
    pain_points: ["Feeling stuck in outdated thinking", "Missing the next opportunity", "Unclear on where the market is moving"],
    frequency: "3x per week — prioritise depth over volume",
    cta: "Book a strategy session or download a framework",
  },
  Driver: {
    style: "Action-oriented and results-focused — share what works and what you've built",
    topics: ["Execution case studies", "Practical action steps", "How you overcame specific obstacles"],
    pain_points: ["Inconsistent execution", "Slow progress", "Getting stuck in planning"],
    frequency: "Daily or 5x per week — volume and consistency are your advantage",
    cta: "Join an accountability programme or book a results audit",
  },
  Preparer: {
    style: "Structured and educational — share frameworks, checklists, and processes",
    topics: ["Step-by-step guides", "Systems and templates", "How to avoid common execution mistakes"],
    pain_points: ["Chaotic workflows", "Repeated mistakes", "Wasted time on disorganised work"],
    frequency: "3x per week — prioritise practical, repeatable content",
    cta: "Download a template or book a systems audit",
  },
  Unifier: {
    style: "Relational and empathetic — share stories, lessons, and human insight",
    topics: ["Community and belonging", "Trust and relationships in business", "Stories of connection and collaboration"],
    pain_points: ["Feeling isolated in business", "Team conflict or low trust", "Disconnected from clients or community"],
    frequency: "3–4x per week — focus on conversation and engagement over broadcast",
    cta: "Join the community or book a trust-building session",
  },
  Activator: {
    style: "Strategic and operational — share how to connect big thinking to daily work",
    topics: ["Aligning strategy to execution", "Role clarity and team focus", "Turning decisions into action"],
    pain_points: ["Strategy that never gets executed", "Teams that are busy but not effective", "Misalignment between vision and reality"],
    frequency: "3x per week — prioritise strategic depth and practical application",
    cta: "Book an alignment session or download a strategic planning tool",
  },
  Stabilizer: {
    style: "Evidence-based and improvement-focused — share what gets better results over time",
    topics: ["Systems for consistency", "How to improve without starting over", "Long-term quality and retention"],
    pain_points: ["Inconsistent results", "Repeated mistakes", "Losing clients after good starts"],
    frequency: "3x per week — prioritise depth and credibility over volume",
    cta: "Book a systems review or download a retention framework",
  },
};

const ROLE_EXECUTION: Record<Role, string[]> = {
  Spotter: [
    "Choose one idea per quarter and execute it fully before starting the next.",
    "Partner with a Driver or Preparer who can carry your ideas into consistent action.",
    "Set a weekly output goal — one piece of content, one offer conversation, one follow-up.",
  ],
  Driver: [
    "Build a weekly sales rhythm — outreach, follow-up, and offer conversations on fixed days.",
    "Track one revenue-driving action daily and review your streak every Friday.",
    "Block two hours each week for strategic thinking — not just execution.",
  ],
  Preparer: [
    "Set a launch date and work backwards — your offer doesn't need to be perfect to be sold.",
    "Create a simple onboarding checklist so delivery is consistent from client one.",
    "Identify one process you can delegate or automate this month.",
  ],
  Unifier: [
    "Create a direct offer this week — a specific service, price, and outcome for a specific person.",
    "Follow up with three past contacts this week without waiting for them to reach out.",
    "Build a simple referral system — ask satisfied clients for one introduction per month.",
  ],
  Activator: [
    "Narrow your current focus to one client type and one offer for the next 90 days.",
    "Create a weekly team or accountability check-in to align action with priorities.",
    "Identify one high-value task you are doing that someone else could do — delegate it.",
  ],
  Stabilizer: [
    "Set a public launch date for your current offer — accountability accelerates completion.",
    "Document your best client result and turn it into a repeatable case study.",
    "Build a monthly review process — assess what worked, what didn't, and what to improve.",
  ],
};

const ROLE_NEXT_MOVE: Record<
  Role,
  { fix_first: string; stop_doing: string; start_doing: string; monetization_opportunity: string }
> = {
  Spotter: {
    fix_first: "Narrow your positioning to one specific problem for one specific audience",
    stop_doing: "Starting new ideas before your current offer has been fully tested and sold",
    start_doing: "Booking one discovery conversation per week to validate your current offer",
    monetization_opportunity: "Package your insight into a paid workshop, advisory session, or strategic framework",
  },
  Driver: {
    fix_first: "Create a weekly sales rhythm and protect it from other work",
    stop_doing: "Waiting for perfect conditions before making offers or following up",
    start_doing: "Tracking one revenue-driving action every day without exception",
    monetization_opportunity: "Create a results-based offer with a clear outcome and timeline — clients pay more for certainty",
  },
  Preparer: {
    fix_first: "Set a launch date for your current offer and commit to it publicly",
    stop_doing: "Adding more structure or features to an offer that hasn't been sold yet",
    start_doing: "Selling your offer before it's complete — validate first, then build",
    monetization_opportunity: "Package your process into a group programme or productised service that can run without you",
  },
  Unifier: {
    fix_first: "Write one clear, direct offer and send it to three people this week",
    stop_doing: "Giving away value through free advice without converting it into a paid engagement",
    start_doing: "Asking every satisfied client for one introduction or referral",
    monetization_opportunity: "Build a community, membership, or cohort offer that monetises your ability to bring people together",
  },
  Activator: {
    fix_first: "Define your one target client and one core offer for the next 90 days",
    stop_doing: "Solving both strategic and operational problems in the same engagement — pick one",
    start_doing: "Creating a weekly alignment check-in with your clients or team to track execution",
    monetization_opportunity: "Offer a 90-day alignment or activation programme with a defined outcome and weekly check-ins",
  },
  Stabilizer: {
    fix_first: "Launch your current offer now — improvement happens in the market, not before it",
    stop_doing: "Refining your offer, content, or systems in private while delaying revenue",
    start_doing: "Documenting your best client result and using it as social proof immediately",
    monetization_opportunity: "Build a retainer or subscription offer around ongoing improvement, quality assurance, or system maintenance",
  },
};

// Detailed role content
const ROLE_CONTENT: Record<
  Role,
  {
    name: string;
    summary: string;
    detailed: string;
    benefits: string[];
    watchouts: string[];
    in_team: string;
  }
> = {
  Spotter: {
    name: "Spotter",
    summary:
      "You sense change before it arrives. Your strongest contribution is disrupting the status quo with fresh thinking and forward‑looking ideas.",
    detailed:
      "The Genius of Innovation is about seeing possibilities where others see problems. People with this gift derive real joy and energy from exploring emerging trends, questioning assumptions, and generating original ideas. They are naturally skilled at identifying what could be different or better, often before anyone else notices. Innovation is frequently an internal, reflective process – but its impact is unmistakable. The benefits of this genius include helping organizations avoid stagnation, sparking creativity in others, and ensuring that change initiatives begin with a strong, visionary foundation.",
    benefits: [
      "Identifies emerging opportunities before they become obvious",
      "Challenges outdated assumptions and processes",
      "Generates creative solutions to complex problems",
      "Inspires others to think beyond current constraints",
    ],
    watchouts: [
      "May move on to the next idea before implementation is complete",
      "Can become impatient with detailed planning and execution",
      "Risk of being perceived as unrealistic or impractical",
    ],
    in_team:
      "In a team context, you are the early warning system and idea generator. Teams need you most at the start of change – when the status quo needs challenging and new direction is required. Watch for the tendency to move on before implementation is complete.",
  },
  Driver: {
    name: "Driver",
    summary:
      "You drive initiatives forward. Your strongest contribution is converting intention into momentum. When progress stalls, you restart it.",
    detailed:
      "The Genius of Achievement is about turning ideas into action. People with this gift derive real joy and energy from setting ambitious goals, making steady progress, and crossing tasks off their list. They are not easily deterred by obstacles and often find creative ways to keep teams moving. Achievement is highly observable – you can see it in the urgency they bring to meetings, the milestones they hit, and the energy they infuse into flagging initiatives.",
    benefits: [
      "Maintains momentum when energy flags",
      "Converts abstract ideas into concrete action steps",
      "Creates accountability and drives results",
      "Keeps teams focused on deadlines and deliverables",
    ],
    watchouts: [
      "May rush past important conversations in favour of action",
      "Can create pressure that overwhelms some team members",
      "Risk of burnout if constantly driving without rest",
    ],
    in_team:
      "In a team context, you are the engine. Teams need you when momentum is at risk or deadlines are being missed. Your urgency is valuable – but ensure your pace doesn't leave key voices behind.",
  },
  Preparer: {
    name: "Preparer",
    summary:
      "You create the structure that makes change possible. Your strongest contribution is ensuring that good ideas don't collapse in execution.",
    detailed:
      "The Genius of Organization involves bringing order to complexity. People with this gift derive real joy and energy from planning, structuring, and coordinating resources. They are naturally skilled at breaking down large initiatives into manageable steps, identifying dependencies, and creating systems that help teams operate efficiently. While less glamorous than ideation, organization is what prevents chaos and ensures that ambitious ideas have a realistic path to implementation.",
    benefits: [
      "Translates vision into actionable plans",
      "Identifies resource gaps and dependencies early",
      "Creates systems that improve team efficiency",
      "Reduces risk of execution failure",
    ],
    watchouts: [
      "May prioritise process over adaptability",
      "Can become frustrated with ambiguity or last‑minute changes",
      "Risk of over‑planning and delaying action",
    ],
    in_team:
      "In a team context, you are the architect of execution. Teams need you to translate ambition into workable plans. Your structure prevents chaos – but ensure the plan stays flexible enough to adapt.",
  },
  Unifier: {
    name: "Unifier",
    summary:
      "You build the trust that change requires. Your strongest contribution is keeping people connected during disruption.",
    detailed:
      "The Genius of Unification is about creating psychological safety and fostering collaboration. People with this gift derive real joy and energy from bringing people together, resolving conflict, and ensuring that everyone feels heard. They are naturally skilled at reading emotional undercurrents and facilitating difficult conversations. Unifiers are often the glue that holds teams together during stressful transformations.",
    benefits: [
      "Builds trust and psychological safety",
      "Surfaces hidden concerns before they become problems",
      "Facilitates difficult conversations with empathy",
      "Creates a culture where people feel valued",
    ],
    watchouts: [
      "May avoid necessary conflict to preserve harmony",
      "Can struggle to make unpopular decisions",
      "Risk of being perceived as less decisive",
    ],
    in_team:
      "In a team context, you are the social glue. Teams need you when trust is low, conflict is rising, or alignment is breaking down. Your gift for connection is powerful – ensure decisions still get made.",
  },
  Activator: {
    name: "Activator",
    summary:
      "You connect strategy to execution. Your strongest contribution is ensuring that decisions translate into operational reality.",
    detailed:
      "The Genius of Building involves bridging the gap between high‑level strategy and day‑to‑day operations. People with this gift derive real joy and energy from aligning resources, defining roles, and ensuring that everyone understands how their work contributes to the bigger picture. They are naturally skilled at translating abstract goals into concrete actions. Builders are the linchpin that prevents strategic drift.",
    benefits: [
      "Aligns team work with organisational priorities",
      "Clarifies roles and responsibilities",
      "Ensures decisions are translated into action",
      "Prevents misalignment between strategy and execution",
    ],
    watchouts: [
      "May become bogged down in operational details",
      "Can struggle with purely strategic or purely tactical work",
      "Risk of being pulled in too many directions",
    ],
    in_team:
      "In a team context, you are the bridge between thinking and doing. Teams need you to connect strategy to action. Your ability to align work to purpose prevents drift – ensure you challenge direction when needed.",
  },
  Stabilizer: {
    name: "Stabilizer",
    summary:
      "You make change last. Your strongest contribution is continuous improvement – learning from what happened and strengthening what works.",
    detailed:
      "The Genius of Refinement is about sustaining and improving systems over time. People with this gift derive real joy and energy from analysing outcomes, capturing lessons learned, and making incremental improvements. They are naturally skilled at identifying what’s working, what’s not, and what could be better. Refiners ensure that change initiatives don’t just succeed once but become embedded in the organisation’s DNA.",
    benefits: [
      "Captures and institutionalises learning",
      "Prevents repeated mistakes",
      "Continuously improves processes and outcomes",
      "Builds sustainable systems for long‑term success",
    ],
    watchouts: [
      "May prioritise perfection over progress",
      "Can be seen as overly critical or focused on the past",
      "Risk of slowing momentum with excessive analysis",
    ],
    in_team:
      "In a team context, you are the memory and quality engine. Teams need you after initiatives to capture learning and prevent repetition of mistakes. Your focus on improvement is invaluable – ensure it doesn't slow necessary momentum.",
  },
};

// Energy content
const ENERGY_CONTENT: Record<
  Energy,
  {
    name: string;
    summary: string;
    detailed: string;
    benefits: string[];
    watchouts: string[];
  }
> = {
  Spark: {
    name: "Spark",
    summary:
      "Your primary energy is Spark – the energy of initiation, creativity, and disruption. You bring excitement and possibility to change.",
    detailed:
      "Spark energy is about generating heat and light at the beginning of a change journey. People with Spark energy are most alive when something new is being born – a strategy, a project, a movement. They excel at creating urgency, painting compelling visions, and rallying people around a fresh direction. However, Spark energy naturally diminishes as the work becomes more routine. Leaders with Spark energy need partners who can carry the flame forward after the initial ignition.",
    benefits: [
      "Creates urgency and excitement around change",
      "Generates innovative ideas and fresh perspectives",
      "Inspires others to join the journey",
      "Breaks through complacency and inertia",
    ],
    watchouts: [
      "May lose interest once the initial excitement fades",
      "Can move on before implementation is complete",
      "Risk of burning out without sustained support",
    ],
  },
  Drive: {
    name: "Drive",
    summary:
      "Your primary energy is Build – the energy of construction, progress, and momentum. You bring drive and discipline to change.",
    detailed:
      "Build energy is about turning vision into reality. People with Build energy are most alive when tangible progress is being made – checking off tasks, hitting milestones, and moving initiatives forward. They excel at converting plans into action, overcoming obstacles, and maintaining momentum. Build energy is essential during the middle stages of change, when the initial excitement has faded but results are not yet visible. Leaders with Build energy need partners who can help them see the bigger picture and avoid burnout.",
    benefits: [
      "Drives consistent progress toward goals",
      "Overcomes obstacles and resistance",
      "Maintains momentum when energy flags",
      "Converts plans into tangible results",
    ],
    watchouts: [
      "May rush past important reflection or course correction",
      "Can create pressure that overwhelms others",
      "Risk of burnout from constant forward motion",
    ],
  },
  Shape: {
    name: "Shape",
    summary:
      "Your primary energy is Shape – the energy of refinement, quality, and precision. You bring rigor and improvement to change.",
    detailed:
      "Shape energy is about making good things great. People with Shape energy are most alive when systems can be made better – optimising processes, catching errors, and elevating quality. They excel at the final stages of change, when the focus shifts from deployment to refinement. Shape energy ensures that initiatives don’t just work, but work well. Leaders with Shape energy need partners who can help them balance perfectionism with progress.",
    benefits: [
      "Elevates quality and attention to detail",
      "Identifies and corrects errors before they become problems",
      "Continuously improves systems and processes",
      "Ensures lasting excellence beyond initial implementation",
    ],
    watchouts: [
      "May delay completion in pursuit of perfection",
      "Can be seen as overly critical",
      "Risk of slowing momentum with excessive refinement",
    ],
  },
  Bond: {
    name: "Bond",
    summary:
      "Your primary energy is Bond – the energy of connection, trust, and collaboration. You bring relational intelligence to change.",
    detailed:
      "Bond energy is about keeping people connected during disruption. People with Bond energy are most alive when teams are unified – facilitating dialogue, building trust, and resolving conflict. They excel at the human side of change, ensuring that no one is left behind. Bond energy is essential when alignment is breaking down or resistance is rising. Leaders with Bond energy need partners who can help them make tough decisions and maintain momentum.",
    benefits: [
      "Builds trust and psychological safety",
      "Surfaces and resolves conflict early",
      "Keeps teams connected during disruption",
      "Creates a culture of collaboration and support",
    ],
    watchouts: [
      "May avoid necessary conflict to preserve harmony",
      "Can struggle with tough decisions or trade‑offs",
      "Risk of being perceived as less decisive",
    ],
  },
};

// ADAPTS stage detailed content
const STAGE_CONTENT: Record<
  AdaptsStage,
  { strengths: string; growth: string }
> = {
  "Alert the System": {
    strengths:
      "You are naturally strong at sensing disruption early. You read signals others miss and create the urgency that opens organizations to change. This strength helps your team avoid being caught off‑guard by market shifts, competitive threats, or internal decay.",
    growth:
      'Sensing disruption early is an area for development. You may benefit from deliberately seeking weak signals, challenging current assumptions, and spending time with people outside your immediate function. Consider setting up a regular "environmental scan" practice to catch what you might otherwise miss.',
  },
  "Diagnose the Gaps": {
    strengths:
      "You are naturally strong at framing the real problem. You ask the harder questions and ensure organizations address root causes rather than symptoms. This strength prevents wasted effort on solving the wrong issues.",
    growth:
      'Root cause analysis is an area for development. You may benefit from slowing down before solutions are selected, building diagnostic habits, and asking "why" more often before "how". Consider using structured problem‑solving frameworks like the 5 Whys or fishbone diagrams.',
  },
  "Access Readiness": {
    strengths:
      "You are naturally strong at preparing for change. You assess capability, capacity, and confidence before launch – reducing the risk of failed implementation. This strength ensures your team has what it needs to succeed.",
    growth:
      "Preparation discipline is an area for development. You may benefit from building explicit readiness checks before major initiatives and ensuring capability gaps are identified before launch. Consider creating a simple readiness scorecard for each new project.",
  },
  "Participate Through Dialogue": {
    strengths:
      "You are naturally strong at building shared understanding. You surface hidden concerns and create the conversations that transform resistance into alignment. This strength prevents silent failures and builds buy‑in.",
    growth:
      'Facilitated dialogue is an area for development. You may benefit from creating more structured space for dissenting voices, and building stronger habits around listening before deciding. Consider using techniques like "pre‑mortems" or "silent brainstorming".',
  },
  "Transform Through Alignment": {
    strengths:
      "You are naturally strong at executing change. You convert agreement into action and keep teams coordinated through complex transformation. This strength ensures that strategy translates into results.",
    growth:
      "Execution alignment is an area for development. You may benefit from more explicit connection between strategy and operational work, and tighter coordination mechanisms during implementation. Consider using project management tools to visualise dependencies.",
  },
  "Scale and Sustain": {
    strengths:
      "You are naturally strong at making change last. You embed new behaviors, build sustaining systems, and ensure transformation survives beyond the initial push. This strength creates lasting impact.",
    growth:
      'Sustainability discipline is an area for development. You may benefit from building explicit review processes after initiatives, and creating systems that institutionalize new behaviors. Consider establishing regular "retrospectives" and documenting lessons learned.',
  },
};

// Pairing content (primary + secondary)
const PAIRING_CONTENT: Record<
  string,
  {
    name: string;
    description: string;
    benefits: string[];
    watchouts: string[];
    icon?: string;
  }
> = {
  "Spotter+Driver": {
    name: "The Visionary Driver",
    description:
      "A powerful combination of big-picture thinking and relentless execution. You not only see where the world needs to go – you have the drive to get there. You excel at launching new initiatives and pushing them through obstacles.",
    benefits: [
      "Exceptional at turning ideas into reality",
      "Creates urgency and momentum around new directions",
      "Inspires others while holding them accountable",
    ],
    watchouts: [
      "May move too fast for others to keep up",
      "Can struggle with mid-course refinement",
      "Risk of burnout from constant high intensity",
    ],
  },
  "Spotter+Preparer": {
    name: "The Strategic Architect",
    description:
      "A rare combination of creative vision and structural discipline. You not only imagine what could be – you design the blueprint to get there. You excel at translating abstract ideas into actionable plans.",
    benefits: [
      "Bridges the gap between imagination and execution",
      "Creates both vision and structure",
      "Prevents chaos while enabling innovation",
    ],
    watchouts: [
      "May over-engineer before testing ideas",
      "Can become attached to plans rather than outcomes",
      "Risk of analysis paralysis",
    ],
  },
  "Spotter+Unifier": {
    name: "The Empathetic Visionary",
    description:
      "A compelling combination of future-thinking and people-centeredness. You not only see where the world needs to go – you bring people along on the journey. You excel at creating change that people actually want.",
    benefits: [
      "Builds buy-in while painting compelling visions",
      "Creates change that people embrace, not resist",
      "Balances ambition with empathy",
    ],
    watchouts: [
      "May prioritise harmony over hard decisions",
      "Can struggle with execution details",
      "Risk of being seen as overly idealistic",
    ],
  },
  "Spotter+Activator": {
    name: "The Bridge Builder",
    description:
      "A powerful combination of creativity and pragmatism. You not only imagine new possibilities – you connect them to operational reality. You excel at turning strategic insights into practical actions.",
    benefits: [
      "Translates vision into executable strategy",
      "Aligns innovation with organisational capabilities",
      "Prevents ideas from dying in PowerPoint",
    ],
    watchouts: [
      "May spread focus too thin across many initiatives",
      "Can struggle with purely tactical work",
      "Risk of burnout from constant bridging",
    ],
  },
  "Spotter+Stabilizer": {
    name: "The Continuous Stabilizer",
    description:
      "A unique combination of creation and improvement. You not only generate new ideas – you make them better over time. You excel at iterating toward excellence while never losing sight of the next breakthrough.",
    benefits: [
      "Combines breakthrough thinking with continuous improvement",
      'Never settles for "good enough"',
      "Creates both novelty and refinement",
    ],
    watchouts: [
      'May struggle to declare anything "finished"',
      "Can over-iterate before launching",
      "Risk of perfectionism blocking progress",
    ],
  },
  "Driver+Spotter": {
    name: "The Momentum Builder",
    description:
      "A dynamic combination of action and imagination. You not only drive progress – you know when to pivot. You excel at keeping initiatives moving while remaining open to better approaches.",
    benefits: [
      "Maintains momentum while staying flexible",
      "Balances execution with exploration",
      "Creates urgency without rigidity",
    ],
    watchouts: [
      "May change direction too frequently",
      "Can frustrate teams seeking stability",
      "Risk of losing focus on long-term goals",
    ],
  },
  "Driver+Preparer": {
    name: "The Execution Specialist",
    description:
      "A formidable combination of drive and discipline. You not only push for results – you structure the path to get there. You excel at turning plans into completed projects on time and on budget.",
    benefits: [
      "Exceptional at delivering complex initiatives",
      "Combines urgency with methodology",
      "Creates accountability and clarity",
    ],
    watchouts: [
      "May prioritise speed over quality",
      "Can become rigid when adaptation is needed",
      "Risk of burnout from constant pressure",
    ],
  },
  "Driver+Unifier": {
    name: "The People-Driven Leader",
    description:
      "A compelling combination of results and relationships. You not only drive progress – you bring people with you. You excel at achieving ambitious goals while building trust and engagement.",
    benefits: [
      "Balances task and relationship focus",
      "Creates accountability with psychological safety",
      "Inspires teams to achieve more together",
    ],
    watchouts: [
      "May struggle with tough performance conversations",
      "Can prioritise harmony over hard truths",
      "Risk of spreading focus too thin",
    ],
  },
  "Driver+Activator": {
    name: "The Strategic Executor",
    description:
      "A powerful combination of drive and alignment. You not only push for results – you ensure those results matter. You excel at connecting day-to-day action to strategic intent.",
    benefits: [
      "Aligns execution with organisational strategy",
      "Prevents busy-work and misdirection",
      "Creates momentum with purpose",
    ],
    watchouts: [
      "May struggle with purely tactical work",
      "Can become frustrated when strategy is unclear",
      "Risk of over-indexing on alignment at expense of speed",
    ],
  },
  "Driver+Stabilizer": {
    name: "The Performance Optimizer",
    description:
      "A unique combination of drive and improvement. You not only push for results – you make those results better over time. You excel at achieving goals while continuously raising the bar.",
    benefits: [
      "Combines urgency with quality",
      "Never settles for mediocrity",
      "Creates momentum and excellence",
    ],
    watchouts: [
      "May struggle to celebrate success",
      "Can create pressure for constant improvement",
      "Risk of burnout from never being satisfied",
    ],
  },
  "Preparer+Spotter": {
    name: "The Structured Strategist",
    description:
      "A rare combination of discipline and creativity. You not only create structure – you know when to break it. You excel at building systems that enable, not constrain, innovation.",
    benefits: [
      "Creates flexible structures that adapt",
      "Balances planning with possibility",
      "Prevents chaos without stifling creativity",
    ],
    watchouts: [
      "May over-complicate simple problems",
      "Can struggle with purely unstructured work",
      "Risk of analysis paralysis",
    ],
  },
  "Preparer+Driver": {
    name: "The Delivery Architect",
    description:
      "A formidable combination of planning and execution. You not only design the path – you walk it. You excel at delivering complex initiatives with precision and pace.",
    benefits: [
      "Exceptional at project delivery",
      "Combines methodology with urgency",
      "Creates clarity and accountability",
    ],
    watchouts: [
      "May prioritise process over people",
      "Can become rigid when change is needed",
      "Risk of burnout from constant delivery pressure",
    ],
  },
  "Preparer+Unifier": {
    name: "The Systems Unifier",
    description:
      "A powerful combination of structure and connection. You not only design systems – you ensure people can thrive within them. You excel at creating processes that build trust, not bureaucracy.",
    benefits: [
      "Designs people-centered systems",
      "Balances efficiency with empathy",
      "Creates structures that enable collaboration",
    ],
    watchouts: [
      "May over-engineer simple processes",
      "Can struggle with tough trade-offs",
      "Risk of being seen as process-heavy",
    ],
  },
  "Preparer+Activator": {
    name: "The Master Planner",
    description:
      "A rare combination of structure and alignment. You not only plan – you ensure plans connect to reality. You excel at creating roadmaps that actually get followed.",
    benefits: [
      "Creates actionable, aligned plans",
      "Bridges strategy and execution",
      "Prevents planning that never becomes action",
    ],
    watchouts: [
      "May struggle with ambiguity or rapid change",
      "Can become attached to plans over outcomes",
      "Risk of over-planning at expense of speed",
    ],
  },
  "Preparer+Stabilizer": {
    name: "The Precision Operator",
    description:
      "A unique combination of structure and improvement. You not only create order – you make that order better over time. You excel at building systems that continuously improve.",
    benefits: [
      "Creates self-improving systems",
      "Combines planning with iteration",
      "Prevents stagnation and decay",
    ],
    watchouts: [
      "May struggle with one-off projects",
      "Can over-engineer temporary solutions",
      "Risk of perfectionism blocking progress",
    ],
  },
  "Unifier+Spotter": {
    name: "The Empathetic Visionary",
    description:
      "A compelling combination of connection and creativity. You not only bring people together – you imagine where they could go. You excel at creating change that people actually want.",
    benefits: [
      "Builds buy-in for bold visions",
      "Creates change people embrace",
      "Balances ambition with empathy",
    ],
    watchouts: [
      "May struggle with execution details",
      "Can prioritise harmony over hard decisions",
      "Risk of being seen as overly idealistic",
    ],
  },
  "Unifier+Driver": {
    name: "The Relationship Driver",
    description:
      "A powerful combination of connection and momentum. You not only build trust – you get things done. You excel at achieving results while keeping teams engaged.",
    benefits: [
      "Balances task and relationship",
      "Creates accountability with psychological safety",
      "Inspires teams to achieve more together",
    ],
    watchouts: [
      "May struggle with tough performance conversations",
      "Can prioritise harmony over hard truths",
      "Risk of spreading focus too thin",
    ],
  },
  "Unifier+Preparer": {
    name: "The Collaborative Preparer",
    description:
      "A rare combination of connection and structure. You not only bring people together – you create systems that help them work better together. You excel at designing collaborative processes.",
    benefits: [
      "Creates people-centered systems",
      "Balances efficiency with empathy",
      "Builds trust through reliable processes",
    ],
    watchouts: [
      "May over-engineer simple processes",
      "Can struggle with tough trade-offs",
      "Risk of being seen as process-heavy",
    ],
  },
  "Unifier+Activator": {
    name: "The Trust Builder",
    description:
      "A powerful combination of connection and alignment. You not only build relationships – you ensure those relationships serve a purpose. You excel at creating aligned, trusting teams.",
    benefits: [
      "Aligns people around shared purpose",
      "Builds trust and strategic clarity",
      "Creates teams that collaborate effectively",
    ],
    watchouts: [
      "May struggle with purely strategic or purely relational work",
      "Can prioritise harmony over alignment",
      "Risk of being pulled in too many directions",
    ],
  },
  "Unifier+Stabilizer": {
    name: "The Inclusive Improver",
    description:
      "A unique combination of connection and improvement. You not only bring people together – you make things better for everyone. You excel at creating inclusive systems that continuously improve.",
    benefits: [
      "Creates equitable, improving systems",
      "Balances empathy with excellence",
      "Builds cultures of psychological safety and learning",
    ],
    watchouts: [
      "May struggle with tough prioritisation",
      "Can over-emphasise consensus at expense of speed",
      "Risk of burnout from constant people-focused improvement",
    ],
  },
  "Activator+Spotter": {
    name: "The Bridge Builder",
    description:
      "A powerful combination of alignment and creativity. You not only connect strategy to action – you know when strategy needs to change. You excel at translating vision into reality while staying adaptable.",
    benefits: [
      "Bridges strategy and execution dynamically",
      "Aligns innovation with operational reality",
      "Prevents strategic drift while enabling adaptation",
    ],
    watchouts: [
      "May spread focus too thin",
      "Can struggle with purely tactical or purely strategic work",
      "Risk of burnout from constant bridging",
    ],
  },
  "Activator+Driver": {
    name: "The Strategic Activator",
    description:
      "A formidable combination of alignment and drive. You not only connect strategy to action – you get it done. You excel at turning strategic intent into completed results.",
    benefits: [
      "Aligns execution with strategy",
      "Creates momentum with purpose",
      "Prevents busy-work and misdirection",
    ],
    watchouts: [
      "May struggle with purely tactical work",
      "Can become frustrated when strategy is unclear",
      "Risk of over-indexing on alignment at expense of speed",
    ],
  },
  "Activator+Preparer": {
    name: "The Systems Architect",
    description:
      "A rare combination of alignment and structure. You not only connect strategy to action – you design the systems that make it happen. You excel at creating aligned, executable plans.",
    benefits: [
      "Creates actionable, aligned roadmaps",
      "Bridges strategy, structure, and execution",
      "Prevents planning that never becomes action",
    ],
    watchouts: [
      "May over-engineer simple problems",
      "Can struggle with ambiguity or rapid change",
      "Risk of over-planning at expense of speed",
    ],
  },
  "Activator+Unifier": {
    name: "The Alignment Champion",
    description:
      "A powerful combination of alignment and connection. You not only connect work to purpose – you bring people along. You excel at creating aligned, trusting teams that execute effectively.",
    benefits: [
      "Aligns people and work around shared purpose",
      "Builds trust and strategic clarity",
      "Creates teams that collaborate and deliver",
    ],
    watchouts: [
      "May struggle with purely strategic or purely relational work",
      "Can prioritise harmony over alignment",
      "Risk of being pulled in too many directions",
    ],
  },
  "Activator+Stabilizer": {
    name: "The Operational Excellence Leader",
    description:
      "A unique combination of alignment and improvement. You not only connect work to strategy – you make that connection better over time. You excel at creating aligned, continuously improving systems.",
    benefits: [
      "Creates self-improving, aligned systems",
      "Combines strategic clarity with operational excellence",
      "Prevents drift and decay",
    ],
    watchouts: [
      "May struggle with one-off initiatives",
      "Can over-engineer temporary solutions",
      "Risk of perfectionism blocking progress",
    ],
  },
  "Stabilizer+Spotter": {
    name: "The Continuous Stabilizer",
    description:
      "A unique combination of improvement and creativity. You not only make things better – you know when to start fresh. You excel at iterating toward excellence while remaining open to breakthrough ideas.",
    benefits: [
      "Combines iteration with innovation",
      'Never settles for "good enough"',
      "Creates both refinement and renewal",
    ],
    watchouts: [
      'May struggle to declare anything "finished"',
      "Can over-iterate before launching",
      "Risk of perfectionism blocking progress",
    ],
  },
  "Stabilizer+Driver": {
    name: "The Performance Optimizer",
    description:
      "A powerful combination of improvement and drive. You not only raise the bar – you push to reach it. You excel at achieving ambitious goals while continuously raising standards.",
    benefits: [
      "Combines urgency with quality",
      "Never settles for mediocrity",
      "Creates momentum and excellence",
    ],
    watchouts: [
      "May struggle to celebrate success",
      "Can create pressure for constant improvement",
      "Risk of burnout from never being satisfied",
    ],
  },
  "Stabilizer+Preparer": {
    name: "The Systems Perfectionist",
    description:
      "A rare combination of improvement and structure. You not only make things better – you systematise that improvement. You excel at building self-improving systems.",
    benefits: [
      "Creates self-improving, reliable systems",
      "Combines process discipline with iteration",
      "Prevents stagnation and decay",
    ],
    watchouts: [
      "May over-engineer simple processes",
      "Can struggle with one-off or unpredictable work",
      "Risk of perfectionism blocking progress",
    ],
  },
  "Stabilizer+Unifier": {
    name: "The Culture Steward",
    description:
      "A powerful combination of improvement and connection. You not only make things better – you make them better for everyone. You excel at creating inclusive, continuously improving cultures.",
    benefits: [
      "Creates equitable, improving systems",
      "Balances empathy with excellence",
      "Builds cultures of psychological safety and learning",
    ],
    watchouts: [
      "May struggle with tough prioritisation",
      "Can over-emphasise consensus at expense of speed",
      "Risk of burnout from constant people-focused improvement",
    ],
  },
  "Stabilizer+Activator": {
    name: "The Sustainable Change Leader",
    description:
      "A unique combination of improvement and alignment. You not only make things better – you ensure those improvements stick. You excel at creating aligned, self-improving systems that deliver lasting impact.",
    benefits: [
      "Creates sustainable, improving systems",
      "Combines strategic alignment with operational excellence",
      "Prevents drift, decay, and misalignment",
    ],
    watchouts: [
      "May struggle with one-off initiatives",
      "Can over-engineer temporary solutions",
      "Risk of perfectionism blocking progress",
    ],
  },
};
// Helper to get pairing key (primary+secondary order doesn't matter for lookup)
function getPairingKey(primary: Role, secondary: Role): string {
  // Try both orders
  const direct = `${primary}+${secondary}`;
  const reverse = `${secondary}+${primary}`;
  if (PAIRING_CONTENT[direct]) return direct;
  if (PAIRING_CONTENT[reverse]) return reverse;
  return direct; // fallback
}

export function buildNarrative(input: NarrativeInput): Narrative {
  const {
    energy_profile,
    role_pair_title,
    top_adapts_stages,
    bottom_adapts_stages,
  } = input;
  // Map old role names to new ones
  const primary_role = ROLE_NAME_MAP[input.primary_role] || input.primary_role;
  const secondary_role =
    ROLE_NAME_MAP[input.secondary_role] || input.secondary_role;
  // Map old energy names to new ones
  const mappedDominant =
    ENERGY_NAME_MAP[input.energy_profile.dominant] ||
    input.energy_profile.dominant;

  // Create a new energy_profile with mapped dominant energy
  const mappedEnergyProfile = {
    ...input.energy_profile,
    dominant: mappedDominant,
  };
  const role = ROLE_CONTENT[primary_role];
  const energy = ENERGY_CONTENT[mappedEnergyProfile.dominant];
  const pairingKey = getPairingKey(primary_role, secondary_role);
  const pairing = PAIRING_CONTENT[pairingKey] || {
    name: role_pair_title,
    description: `A unique combination of ${primary_role} and ${secondary_role} energies. You bring both ${role.summary.toLowerCase()} and the complementary strengths of your secondary role.`,
    benefits: [
      "Balances multiple perspectives",
      "Adaptable to different situations",
      "Brings unique problem‑solving approach",
    ],
    watchouts: [
      "May struggle with role clarity",
      "Can be pulled in conflicting directions",
      "Risk of over‑extending",
    ],
  };

  const topStage = top_adapts_stages[0];
  const secondStage = top_adapts_stages[1];
  const bottomStage = bottom_adapts_stages[0];
  const secondBottom = bottom_adapts_stages[1];

  const stageStrengths = STAGE_CONTENT[topStage]?.strengths || "";
  const secondStageStrength = secondStage
    ? STAGE_CONTENT[secondStage]?.strengths
    : "";
  const stageGrowth = STAGE_CONTENT[bottomStage]?.growth || "";
  const secondStageGrowth = secondBottom
    ? STAGE_CONTENT[secondBottom]?.growth
    : "";
  
  // ── Entrepreneur Application ───────────────────────────────
  const weakestStage  = bottom_adapts_stages[0];
  const strongestStage = top_adapts_stages[0];

  const entrepreneur_growth_pattern = ROLE_GROWTH_PATTERN[primary_role];
  const revenue_leakage_pattern     = STAGE_REVENUE_LEAKAGE[weakestStage];
  const best_business_focus         = STAGE_BUSINESS_FOCUS[weakestStage];
  const offer_feedback              = ROLE_OFFER_FEEDBACK[primary_role];
  const content_direction           = ROLE_CONTENT_DIRECTION[primary_role];
  const execution_recommendations   = ROLE_EXECUTION[primary_role];
  const next_best_move              = ROLE_NEXT_MOVE[primary_role];

  return {
    executive_summary: `Your Change Genius™ profile reveals that you are a ${role_pair_title} — a ${primary_role} with a strong ${secondary_role} dimension. ${role.summary} Your ${secondary_role} secondary role adds ${ROLE_CONTENT[secondary_role]?.summary.split(".")[0].toLowerCase() || "additional strengths"} to your change leadership approach.`,

    role_name: role.name,
    role_summary: role.summary,
    role_detailed: role.detailed,
    role_benefits: role.benefits,
    role_watchouts: role.watchouts,

    energy_name: energy.name,
    energy_summary: energy.summary,
    energy_detailed: energy.detailed,
    energy_benefits: energy.benefits,
    energy_watchouts: energy.watchouts,

    adapts_strengths_summary: `Your strongest ADAPTS stages are ${topStage}${secondStage ? ` and ${secondStage}` : ""}.`,
    adapts_strengths_detailed: `${stageStrengths} ${secondStageStrength ? `You are also strong in the ${secondStage} stage. ${secondStageStrength}` : ""}`,
    adapts_growth_summary: `Your development areas are ${bottomStage}${secondBottom ? ` and ${secondBottom}` : ""}.`,
    adapts_growth_detailed: `${stageGrowth} ${secondStageGrowth ? `The ${secondBottom} stage is also an area to develop. ${secondStageGrowth}` : ""}`,

    pairing_name: pairing.name,
    pairing_description: pairing.description,
    pairing_benefits: pairing.benefits,
    pairing_watchouts: pairing.watchouts,

    individual_in_team: role.in_team,

    entrepreneur_growth_pattern,
    revenue_leakage_pattern,
    best_business_focus,
    offer_feedback,
    content_direction,
    execution_recommendations,
    next_best_move,

    next_30_days: [
      `Identify one change initiative you're currently involved in and deliberately apply your ${primary_role} strengths to move it forward.`,
      `Share your Change Genius™ profile with a colleague or team member and ask them to share theirs – begin a conversation about how you can complement each other.`,
      `For the next week, notice when you're working in your ${bottomStage} growth area. Before diving in, see if someone with that strength can support you.`,
      `Schedule a 30‑minute reflection session at the end of the month to review where you've used your genius most effectively – and where you've felt drained.`,
    ],

    what_is_change_genius: `Change Genius™ is the first assessment‑based framework that reveals how leaders and teams drive transformation. Built on the ADAPTS model – six stages from sensing disruption to scaling impact – it gives every leader and organization a shared language for change. Most change initiatives fail not because of strategy, but because leaders don't understand their own change behavior, or their team's. Change Genius™ maps who you are in the system, what your team needs, and where momentum is being lost.`,

    how_to_apply_as_individual: [
      "Review your results and identify one change in your current role that would allow you to spend more time in your genius.",
      "Share your profile with your manager and discuss how to adjust your responsibilities to better align with your strengths.",
      "Use the 30‑day action plan below to build habits that reinforce your genius.",
      "Invite your team to take the assessment so you can build a Team Change Map™ together.",
    ],

    how_to_apply_as_team: [
      "Have every team member take the Change Genius™ assessment and share their results in a team session.",
      "Create a Team Change Map™ that visualises everyone’s primary roles and ADAPTS strengths.",
      "Identify gaps in your team’s role coverage – which Change Genius™ roles are missing?",
      "Reassign responsibilities to better align with each person’s genius.",
      "Use the Weekly Change Pulse™ to track team momentum and alignment over time.",
    ],
  };
}
