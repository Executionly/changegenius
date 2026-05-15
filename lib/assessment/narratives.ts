/**
 * Change Genius™ — Narratives v3
 *
 * FINAL ROLES (4): Driver, Connector, Architect, Spotter
 * FINAL ENERGIES (4): Achiever, Unifier, Organizer, Innovator
 * FINAL ADAPTS STAGES (6): Alert, Diagnose, Prepare, Align, Transform, Sustain
 *
 * Role → Energy connections (tendencies, not fixed rules):
 *   Driver    → Achiever  | Strong: Transform, Prepare | Growth: Align, Sustain
 *   Connector → Unifier   | Strong: Align, Sustain     | Growth: Transform
 *   Architect → Organizer | Strong: Diagnose, Prepare  | Growth: Transform
 *   Spotter   → Innovator | Strong: Alert, Diagnose    | Growth: Sustain
 */

import type { Role, AdaptsStage, Energy } from "./questions";
import { EnergyProfile } from "./scoring";

export interface NarrativeInput {
  primary_role: Role;
  secondary_role: Role;
  role_pair_title: string;
  energy_profile: EnergyProfile;
  top_adapts_stages: AdaptsStage[];
  bottom_adapts_stages: AdaptsStage[];
  stage_scores?: Record<AdaptsStage, number>;
}

// ── Legacy name maps (for old DB data) ────────────────────────

const ROLE_NAME_MAP: Record<string, Role> = {
  // Legacy 6-role names → new 4-role names
  Spotter: "Spotter",
  Driver: "Driver",
  Architect: "Architect",
  Connector: "Connector",
  Activator: "Driver", // remapped to Driver
  Stabilizer: "Architect", // remapped to Architect
  // Old display names
  Innovator: "Spotter",
  Achiever: "Driver",
  Organizer: "Architect",
  Builder: "Driver",
  Refiner: "Architect",
  Unifier: "Connector",
  Preparer: "Architect",
};

const ENERGY_NAME_MAP: Record<string, Energy> = {
  // Legacy names → current names
  Spark: "Innovator",
  Drive: "Achiever",
  Shape: "Organizer",
  Bond: "Unifier",
  // Current names pass-through
  Innovator: "Innovator",
  Achiever: "Achiever",
  Organizer: "Organizer",
  Unifier: "Unifier",
};

// ── Legacy stage name map (for old DB data) ────────────────────

const STAGE_NAME_MAP: Record<string, AdaptsStage> = {
  "Alert the System": "Alert",
  "Diagnose the Gaps": "Diagnose",
  "Access Readiness": "Prepare",
  "Participate Through Dialogue": "Align",
  "Transform Through Alignment": "Transform",
  "Scale and Sustain": "Sustain",
  // Current names pass-through
  Alert: "Alert",
  Diagnose: "Diagnose",
  Prepare: "Prepare",
  Align: "Align",
  Transform: "Transform",
  Sustain: "Sustain",
};

export function normalizeStageName(stage: string): AdaptsStage {
  return STAGE_NAME_MAP[stage] ?? (stage as AdaptsStage);
}

// ── Narrative interface ────────────────────────────────────────

export interface Narrative {
  executive_summary: string;

  // Primary role
  role_name: string;
  role_summary: string;
  role_detailed: string;
  role_benefits: string[];
  role_watchouts: string[];

  // Secondary role
  secondary_role_name: string;
  secondary_role_summary: string;
  secondary_role_detailed: string;
  secondary_role_benefits: string[];
  secondary_role_watchouts: string[];

  // Energy
  energy_name: string;
  energy_summary: string;
  energy_detailed: string;
  energy_benefits: string[];
  energy_watchouts: string[];

  // ADAPTS
  adapts_strengths_summary: string;
  adapts_strengths_detailed: string;
  adapts_growth_summary: string;
  adapts_growth_detailed: string;

  // Pairing
  pairing_name: string;
  pairing_description: string;
  pairing_benefits: string[];
  pairing_watchouts: string[];

  // Team context
  individual_in_team: string;

  // Action plan
  next_30_days: string[];

  // Application pages
  what_is_change_genius: string;
  how_to_apply_as_individual: string[];
  how_to_apply_as_team: string[];

  // Entrepreneur application
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

// ── Role content ───────────────────────────────────────────────

const ROLE_CONTENT: Record<
  Role,
  {
    name: string;
    summary: string;
    detailed: string;
    benefits: string[];
    watchouts: string[];
    in_team: string;
    delegation_insight: string;
    report_language: string;
  }
> = {
  Driver: {
    name: "Driver",
    summary:
      "You move execution forward. Your strongest contribution is converting intention into momentum — when progress stalls, you restart it.",
    detailed:
      "The Driver contribution pattern is about turning plans into measurable results. People with this pattern naturally push progress, create accountability, and drive outcomes. They are energized by completing goals, seeing momentum build, and crossing milestones off the list. Drivers are not easily deterred by obstacles and often find ways to keep teams moving when energy flags. Their urgency is visible — in the pace they bring to work, the results they produce, and the standards they hold themselves and others to.",
    benefits: [
      "Maintains momentum when team energy drops",
      "Converts plans into concrete, measurable action",
      "Creates accountability and drives results",
      "Pushes through resistance to keep initiatives moving",
    ],
    watchouts: [
      "May move faster than team alignment allows",
      "Can create pressure that overwhelms others",
      "Risk of prioritizing speed over sustainable pace",
      "May skip important dialogue in favour of action",
    ],
    in_team:
      "In a team context, you are the engine. Teams need you most when momentum is at risk or deadlines are being missed. Your urgency is valuable — but ensure your pace doesn't leave key voices behind. Partner with Connectors to maintain trust while driving results.",
    delegation_insight:
      "Drivers often benefit from partnering with people who strengthen communication, relationship management, consistency, and long-term maintenance. This helps prevent burnout, team disconnection, and leadership bottlenecks.",
    report_language:
      "You naturally contribute through execution, momentum, and measurable progress. You often perform strongly in transformation-focused environments where movement and results are required. However, strengthening alignment and long-term sustainability may improve your effectiveness and reduce leadership overload.",
  },
  Connector: {
    name: "Connector",
    summary:
      "You build the trust that execution requires. Your strongest contribution is keeping people aligned, engaged, and moving together during disruption.",
    detailed:
      "The Connector contribution pattern is about creating the relational foundation that makes change sustainable. People with this pattern naturally strengthen trust, improve communication, and ensure that no one is left behind during transformation. They are skilled at reading emotional undercurrents, facilitating difficult conversations, and building the psychological safety that high-performance teams require. Connectors are the glue that holds teams together when pressure rises.",
    benefits: [
      "Builds trust and psychological safety across teams",
      "Surfaces hidden concerns before they derail initiatives",
      "Facilitates difficult conversations with empathy and clarity",
      "Creates a culture where people feel valued and heard",
    ],
    watchouts: [
      "May avoid necessary conflict to preserve harmony",
      "Can struggle with direct accountability and tough decisions",
      "Risk of prioritizing relationships over operational urgency",
      "May struggle with pressure-heavy execution environments",
    ],
    in_team:
      "In a team context, you are the social and relational anchor. Teams need you when trust is low, conflict is rising, or alignment is breaking down. Your gift for connection is powerful — ensure decisions still get made and accountability is maintained. Partner with Drivers to balance trust with execution.",
    delegation_insight:
      "Connectors often benefit from partnering with people who strengthen execution speed, accountability, operational urgency, and measurable follow-through. This helps prevent slow decision-making and delayed execution.",
    report_language:
      "You naturally contribute by strengthening trust, communication, and collaboration. You often perform strongly in environments where alignment, relationships, and healthy team culture are essential. However, strengthening execution urgency and accountability may improve operational effectiveness.",
  },
  Architect: {
    name: "Architect",
    summary:
      "You create the structure that makes execution possible. Your strongest contribution is ensuring that good ideas have a clear, scalable path to implementation.",
    detailed:
      "The Architect contribution pattern is about bringing order to complexity. People with this pattern naturally design systems, build frameworks, and create the organizational clarity that execution requires. They are skilled at breaking large initiatives into manageable steps, identifying dependencies, and designing processes that help teams operate efficiently. Architects prevent the chaos that derails well-intentioned change initiatives — their structure is what turns ambitious ideas into repeatable, scalable outcomes.",
    benefits: [
      "Translates vision into actionable, structured plans",
      "Identifies gaps and dependencies before they cause failure",
      "Creates systems that improve team efficiency and scalability",
      "Reduces execution risk through clear frameworks and processes",
    ],
    watchouts: [
      "May over-plan and delay action while refining systems",
      "Can become frustrated with ambiguity or last-minute changes",
      "Risk of perfectionism blocking timely execution",
      "May prioritize process over adaptability",
    ],
    in_team:
      "In a team context, you are the architect of execution. Teams need you to translate ambition into workable plans and scalable systems. Your structure prevents chaos — but ensure the plan stays flexible enough to adapt. Partner with Drivers to move from planning into action.",
    delegation_insight:
      "Architects often benefit from partnering with people who strengthen execution speed, momentum, and rapid implementation. This helps prevent stalled execution, perfectionism, and delayed launches.",
    report_language:
      "You naturally contribute through structure, systems, and organized thinking. You often perform strongly in environments requiring operational clarity and scalable execution. However, balancing planning with faster implementation may improve execution momentum.",
  },
  Spotter: {
    name: "Spotter",
    summary:
      "You see what others miss. Your strongest contribution is identifying emerging opportunities, risks, and patterns before they become obvious to everyone else.",
    detailed:
      "The Spotter contribution pattern is about seeing the edges of change before it arrives. People with this pattern naturally observe trends, challenge assumptions, and reframe problems in ways that open new possibilities. They are skilled at connecting signals across domains to identify what could shift — and what that shift will mean. Spotters give organizations the strategic foresight to prepare for disruption rather than react to it. Their insight is often the catalyst that initiates meaningful change.",
    benefits: [
      "Identifies emerging opportunities before they become obvious",
      "Challenges outdated assumptions and surfaces blind spots",
      "Generates strategic insights that reframe complex problems",
      "Creates the awareness that helps teams prepare for change",
    ],
    watchouts: [
      "May generate more ideas than can be executed",
      "Can become impatient with operational detail and repetition",
      "Risk of moving to the next insight before current work is complete",
      "May struggle with long-term operational consistency",
    ],
    in_team:
      "In a team context, you are the early warning system and strategic radar. Teams need you most at the start of change — when assumptions need challenging and new direction is required. Watch for the tendency to move on before implementation is complete. Partner with Architects and Drivers to turn insight into action.",
    delegation_insight:
      "Spotters often benefit from partnering with people who strengthen operational consistency, maintenance, process management, and long-term follow-through. This helps prevent unfinished execution and scattered focus.",
    report_language:
      "You naturally contribute through insight, awareness, and strategic thinking. You often perform strongly in environments requiring innovation, problem solving, and future-focused thinking. However, strengthening operational consistency and long-term execution may improve sustainable results.",
  },
};

// ── Energy content ─────────────────────────────────────────────

const ENERGY_CONTENT: Record<
  Energy,
  {
    name: string;
    summary: string;
    detailed: string;
    benefits: string[];
    watchouts: string[];
    strong_adapts: AdaptsStage[];
    delegation_needs: string[];
  }
> = {
  Achiever: {
    name: "Achiever",
    summary:
      "Your primary energy is Achiever — the energy of progress, results, and measurable momentum. You are most alive when things are moving and goals are being reached.",
    detailed:
      "Achiever energy is about turning intention into completion. People with Achiever energy are energized by progress, execution, and the satisfaction of reaching targets. They feel most focused when there is clear momentum, visible results, and consistent forward movement. Achiever energy is essential during the execution and transformation phases of change — when the initial excitement has faded and real delivery is required. Leaders with Achiever energy need partners who help them pace sustainably and maintain relational alignment.",
    benefits: [
      "Drives consistent progress toward goals",
      "Creates urgency and maintains execution momentum",
      "Produces measurable, visible results",
      "Overcomes obstacles with determination and focus",
    ],
    watchouts: [
      "May rush past important reflection or course correction",
      "Can create pressure that overwhelms team members",
      "Risk of burnout from constant forward motion",
      "May underinvest in relationship maintenance",
    ],
    strong_adapts: ["Transform", "Sustain"],
    delegation_needs: [
      "Relationship management",
      "Emotional alignment",
      "Communication pacing",
    ],
  },
  Unifier: {
    name: "Unifier",
    summary:
      "Your primary energy is Unifier — the energy of people, trust, and shared success. You are most alive when teams are connected and working toward something meaningful together.",
    detailed:
      "Unifier energy is about keeping people connected during disruption. People with Unifier energy are energized by collaboration, trust-building, and the satisfaction of seeing others succeed. They feel most focused when teams are aligned, relationships are strong, and everyone has a voice. Unifier energy is essential during the alignment and sustaining phases of change — when human connection determines whether transformation sticks. Leaders with Unifier energy need partners who help them maintain execution urgency and accountability.",
    benefits: [
      "Builds psychological safety and relational trust",
      "Surfaces and resolves conflict before it escalates",
      "Creates cultures of collaboration and inclusion",
      "Maintains team cohesion during pressure and disruption",
    ],
    watchouts: [
      "May avoid necessary conflict to preserve harmony",
      "Can struggle with difficult accountability conversations",
      "Risk of prioritizing consensus over operational speed",
      "May be perceived as less decisive under pressure",
    ],
    strong_adapts: ["Align", "Sustain"],
    delegation_needs: [
      "Difficult accountability",
      "Operational urgency",
      "Execution pressure",
    ],
  },
  Organizer: {
    name: "Organizer",
    summary:
      "Your primary energy is Organizer — the energy of structure, clarity, and operational precision. You are most alive when complexity is being turned into order.",
    detailed:
      "Organizer energy is about creating systems that work reliably. People with Organizer energy are energized by designing processes, improving workflows, and building the operational clarity that allows execution to scale. They feel most focused when there is structure, clear direction, and a logical path from intention to outcome. Organizer energy is essential during the preparation and planning phases of change — when structure prevents chaos and ensures that good ideas have a realistic implementation path. Leaders with Organizer energy need partners who help them balance planning with speed.",
    benefits: [
      "Creates operational clarity and scalable systems",
      "Identifies inefficiencies and improves workflows",
      "Reduces execution risk through careful preparation",
      "Ensures processes are reliable and repeatable",
    ],
    watchouts: [
      "May delay completion in pursuit of the perfect system",
      "Can be perceived as overly focused on process over outcomes",
      "Risk of slowing momentum with excessive planning",
      "May struggle with ambiguity or rapid pivots",
    ],
    strong_adapts: ["Prepare", "Sustain"],
    delegation_needs: [
      "Creative experimentation",
      "Fast activation",
      "Spontaneous decision-making",
    ],
  },
  Innovator: {
    name: "Innovator",
    summary:
      "Your primary energy is Innovator — the energy of ideas, possibilities, and strategic insight. You are most alive when new thinking is being born and problems are being reframed.",
    detailed:
      "Innovator energy is about generating the ideas that open new possibilities. People with Innovator energy are energized by creative thinking, strategic reframing, and the exploration of what could be different or better. They feel most focused when there is space for original thought, intellectual challenge, and the freedom to question current assumptions. Innovator energy is essential during the alerting and diagnosing phases of change — when fresh thinking is needed to see what others have missed. Leaders with Innovator energy need partners who help them move from insight to consistent execution.",
    benefits: [
      "Generates original ideas and strategic insights",
      "Challenges assumptions and surfaces new possibilities",
      "Reframes complex problems in revealing ways",
      "Creates the intellectual energy that drives innovation",
    ],
    watchouts: [
      "May generate more ideas than can be executed",
      "Can lose interest once the initial creative challenge is resolved",
      "Risk of moving on before implementation is complete",
      "May struggle with repetitive operational demands",
    ],
    strong_adapts: ["Alert", "Diagnose"],
    delegation_needs: [
      "Operational consistency",
      "Long-term maintenance",
      "Repetitive execution",
      "Systematic follow-through",
    ],
  },
};

// ── ADAPTS stage content ───────────────────────────────────────

const STAGE_CONTENT: Record<
  AdaptsStage,
  { strengths: string; growth: string }
> = {
  Alert: {
    strengths:
      "You are naturally strong at sensing disruption early. You read signals others miss and create the urgency that opens organizations to change. This strength helps your team avoid being caught off-guard by market shifts, competitive threats, or internal decay.",
    growth:
      "Sensing disruption early is an area for development. You may benefit from deliberately seeking weak signals, challenging current assumptions, and spending time with people outside your immediate function. Consider setting up a regular environmental scan practice to catch what you might otherwise miss.",
  },
  Diagnose: {
    strengths:
      "You are naturally strong at framing the real problem. You ask the harder questions and ensure organizations address root causes rather than symptoms. This strength prevents wasted effort on solving the wrong issues.",
    growth:
      'Root cause analysis is an area for development. You may benefit from slowing down before solutions are selected, building diagnostic habits, and asking "why" more often before "how". Consider using structured problem-solving frameworks like the 5 Whys or fishbone diagrams.',
  },
  Prepare: {
    strengths:
      "You are naturally strong at preparing for change. You assess capability, capacity, and confidence before launch — reducing the risk of failed implementation. This strength ensures your team has what it needs to succeed.",
    growth:
      "Preparation discipline is an area for development. You may benefit from building explicit readiness checks before major initiatives and ensuring capability gaps are identified before launch. Consider creating a simple readiness scorecard for each new project.",
  },
  Align: {
    strengths:
      "You are naturally strong at building shared understanding. You surface hidden concerns and create the conversations that transform resistance into alignment. This strength prevents silent failures and builds buy-in.",
    growth:
      "Facilitated alignment is an area for development. You may benefit from creating more structured space for dissenting voices and building stronger habits around listening before deciding. Consider using techniques like pre-mortems or structured dialogue sessions.",
  },
  Transform: {
    strengths:
      "You are naturally strong at executing change. You convert agreement into action and keep teams coordinated through complex transformation. This strength ensures that strategy translates into results.",
    growth:
      "Execution and transformation is an area for development. You may benefit from more explicit connection between strategy and operational work, and tighter coordination mechanisms during implementation. Consider using project management tools to visualize dependencies and track momentum.",
  },
  Sustain: {
    strengths:
      "You are naturally strong at making change last. You embed new behaviors, build sustaining systems, and ensure transformation survives beyond the initial push. This strength creates lasting impact.",
    growth:
      "Sustainability discipline is an area for development. You may benefit from building explicit review processes after initiatives and creating systems that institutionalize new behaviors. Consider establishing regular retrospectives and documenting lessons learned.",
  },
};

// ── Pairing content ────────────────────────────────────────────

const PAIRING_CONTENT: Record<
  string,
  { name: string; description: string; benefits: string[]; watchouts: string[] }
> = {
  // Driver combinations
  "Driver+Connector": {
    name: "The People-Driven Leader",
    description:
      "A compelling combination of results and relationships. You not only drive progress — you bring people with you. You excel at achieving ambitious goals while building the trust and engagement that makes results sustainable.",
    benefits: [
      "Balances task focus with relational intelligence",
      "Creates accountability alongside psychological safety",
      "Inspires teams to achieve more together",
    ],
    watchouts: [
      "May struggle with tough performance conversations",
      "Risk of prioritizing harmony over necessary hard truths",
      "Can spread focus too thin across results and relationships",
    ],
  },
  "Driver+Architect": {
    name: "The Execution Specialist",
    description:
      "A formidable combination of drive and structure. You not only push for results — you design the path to get there. You excel at turning plans into completed projects with precision and pace.",
    benefits: [
      "Exceptional at delivering complex initiatives",
      "Combines urgency with methodical execution",
      "Creates accountability and operational clarity",
    ],
    watchouts: [
      "May prioritize speed over adaptability",
      "Risk of becoming rigid when change is needed mid-execution",
      "Can create pressure that others find difficult to sustain",
    ],
  },
  "Driver+Spotter": {
    name: "The Momentum Builder",
    description:
      "A dynamic combination of action and insight. You not only drive progress — you know when to pivot. You excel at keeping initiatives moving while remaining alert to better approaches.",
    benefits: [
      "Maintains momentum while staying strategically aware",
      "Balances execution urgency with future-focused thinking",
      "Creates energy and forward motion around new directions",
    ],
    watchouts: [
      "May change direction more frequently than teams can absorb",
      "Risk of losing sustained focus on long-term goals",
      "Can frustrate team members seeking operational stability",
    ],
  },
  // Connector combinations
  "Connector+Driver": {
    name: "The Relationship Driver",
    description:
      "A powerful combination of connection and momentum. You not only build trust — you get things done. You excel at achieving results while keeping teams engaged, aligned, and moving forward.",
    benefits: [
      "Balances relationship depth with execution discipline",
      "Creates accountability within a culture of trust",
      "Inspires teams through both connection and results",
    ],
    watchouts: [
      "May struggle with tough performance conversations",
      "Risk of prioritizing harmony over accountability",
      "Can spread focus across too many relational priorities",
    ],
  },
  "Connector+Architect": {
    name: "The Collaborative Architect",
    description:
      "A rare combination of human connection and structural discipline. You not only bring people together — you create the systems that help them work better together. You excel at designing collaborative processes that build trust rather than bureaucracy.",
    benefits: [
      "Designs people-centered systems and processes",
      "Balances operational efficiency with human empathy",
      "Builds trust through reliable, clear structures",
    ],
    watchouts: [
      "May over-engineer simple processes",
      "Risk of being seen as process-heavy",
      "Can struggle with rapid, unstructured change",
    ],
  },
  "Connector+Spotter": {
    name: "The Empathetic Visionary",
    description:
      "A compelling combination of relational intelligence and strategic foresight. You not only bring people together — you help them see where they could go. You excel at creating change that people genuinely want to be part of.",
    benefits: [
      "Builds buy-in for bold and forward-looking directions",
      "Creates change that people embrace rather than resist",
      "Balances strategic ambition with human empathy",
    ],
    watchouts: [
      "May struggle with operational execution details",
      "Risk of prioritizing vision and harmony over hard decisions",
      "Can be seen as idealistic when clarity and speed are needed",
    ],
  },
  // Architect combinations
  "Architect+Driver": {
    name: "The Delivery Architect",
    description:
      "A formidable combination of planning precision and execution drive. You not only design the path — you walk it. You excel at delivering complex initiatives with both structural rigor and operational pace.",
    benefits: [
      "Exceptional at planning and completing complex projects",
      "Combines methodical structure with execution urgency",
      "Creates clarity and accountability throughout delivery",
    ],
    watchouts: [
      "May prioritize process discipline over team relationships",
      "Risk of rigidity when adaptation is required",
      "Can create relentless delivery pressure that exhausts teams",
    ],
  },
  "Architect+Connector": {
    name: "The Systems Connector",
    description:
      "A powerful combination of structural thinking and relational intelligence. You not only design systems — you ensure people can thrive within them. You excel at creating frameworks that build connection rather than complexity.",
    benefits: [
      "Creates people-centered operational systems",
      "Balances efficiency with empathy and inclusion",
      "Builds trust through clear, well-designed processes",
    ],
    watchouts: [
      "May over-engineer systems in pursuit of inclusion",
      "Risk of slowing execution with excessive process design",
      "Can struggle with tough operational trade-offs",
    ],
  },
  "Architect+Spotter": {
    name: "The Structured Strategist",
    description:
      "A rare combination of structural discipline and strategic insight. You not only create systems — you know when to redesign them. You excel at building frameworks that enable innovation rather than constraining it.",
    benefits: [
      "Creates flexible systems that adapt as strategy evolves",
      "Balances structural clarity with forward-looking thinking",
      "Prevents operational chaos without stifling creativity",
    ],
    watchouts: [
      "May over-complicate systems when simplicity is better",
      "Risk of analysis paralysis when both structure and insight compete",
      "Can struggle with purely instinct-driven or unstructured work",
    ],
  },
  // Spotter combinations
  "Spotter+Driver": {
    name: "The Visionary Driver",
    description:
      "A powerful combination of strategic foresight and relentless execution. You not only see where things need to go — you drive to get there. You excel at launching initiatives from a place of genuine insight and pushing them through to completion.",
    benefits: [
      "Exceptional at turning strategic insight into operational results",
      "Creates urgency and momentum around well-founded new directions",
      "Inspires others while maintaining execution accountability",
    ],
    watchouts: [
      "May move faster than others can understand or absorb",
      "Risk of burnout from combining constant insight generation with execution demand",
      "Can struggle with mid-course refinement and iteration",
    ],
  },
  "Spotter+Connector": {
    name: "The Visionary Connector",
    description:
      "A compelling combination of future-focused thinking and relational depth. You not only see what could be — you bring people along on the journey. You excel at creating change that people feel connected to and genuinely want.",
    benefits: [
      "Builds buy-in for bold directions through trust and vision",
      "Creates change that people embrace from the start",
      "Balances strategic ambition with deep human empathy",
    ],
    watchouts: [
      "May prioritize vision and harmony over execution accountability",
      "Risk of being seen as idealistic when operational detail is needed",
      "Can struggle with the structured, repetitive work of implementation",
    ],
  },
  "Spotter+Architect": {
    name: "The Strategic Architect",
    description:
      "A rare combination of creative foresight and structural discipline. You not only imagine what could be — you design the blueprint to get there. You excel at translating strategic insight into actionable, scalable plans.",
    benefits: [
      "Bridges strategic imagination and operational structure",
      "Creates both the vision and the execution framework",
      "Prevents good ideas from collapsing in implementation",
    ],
    watchouts: [
      "May over-engineer before testing ideas in practice",
      "Risk of attachment to the plan rather than the outcome",
      "Can fall into analysis paralysis when both insight and structure compete",
    ],
  },
};

// ── Entrepreneur content maps ──────────────────────────────────

const ROLE_GROWTH_PATTERN: Record<Role, string> = {
  Driver:
    "You create value best when you are moving — executing, delivering, and making tangible progress. Your business grows when you have a clear offer, a defined audience, and a consistent sales rhythm. Revenue slows when you are stuck in planning, unclear on your message, or spending energy on work that doesn't directly drive income.",
  Connector:
    "You create value best through relationships — trust, community, and connection. Your business grows through word of mouth, partnerships, and audiences that feel personally served by you. Revenue slows when you avoid direct offers, undercharge out of relationship sensitivity, or fail to convert goodwill into income.",
  Architect:
    "You create value best when there is structure — a clear process, a defined offer, and a reliable delivery system. Your business grows when you package your knowledge into a repeatable, scalable offer. Revenue slows when you over-prepare without launching, or when your systems are so complex that only you can run them.",
  Spotter:
    "You create value best when you are working at the edges of what is known — spotting emerging opportunities, reframing problems, and generating ideas that others haven't seen yet. Your business grows when your offer is anchored to a real insight and when you have execution support around you. Revenue slows when you chase too many ideas, position too broadly, or rely on inspiration rather than a repeatable system.",
};

const STAGE_REVENUE_LEAKAGE: Record<AdaptsStage, string> = {
  Alert:
    "You may be missing early market signals, shifts in customer demand, or emerging competition. Your offer may be positioned around a problem that is no longer urgent for your audience. Invest time in customer observation, competitor analysis, and industry trend monitoring before refining your offer.",
  Diagnose:
    "You may be building offers without deeply understanding the real problem your clients face. Symptoms get addressed but root causes go untouched — leading to offers that feel generic or fail to convert. Invest in customer interviews, discovery conversations, and problem validation before scaling your offer.",
  Prepare:
    "You may be launching without the structure, pricing clarity, or delivery system your offer requires. Clients say yes but the experience is inconsistent, which slows referrals and repeat business. Invest in offer packaging, onboarding design, and delivery workflows before pushing volume.",
  Align:
    "You may struggle to connect your message with your audience. Trust is low, content doesn't convert, and potential clients don't feel understood. Invest in clearer messaging, audience-specific communication, and relationship-building before scaling paid acquisition.",
  Transform:
    "You may have the strategy but struggle with consistent execution — selling, following up, delivering, and showing up repeatedly. Revenue is inconsistent because activity is inconsistent. Invest in a weekly sales and content rhythm, and track one revenue-driving action daily.",
  Sustain:
    "You may start well but fail to maintain momentum — losing clients, dropping content, or abandoning systems after early success. Revenue spikes but doesn't compound. Invest in retention systems, recurring offer structures, and documented processes that don't depend solely on your energy.",
};

const STAGE_BUSINESS_FOCUS: Record<AdaptsStage, string> = {
  Alert:
    "Spend one hour this week researching what your target client is most worried about right now. Reposition your offer around that specific, current pain point.",
  Diagnose:
    "Conduct three discovery conversations with potential clients this week. Ask only about their problems — not your solution. Use what you hear to sharpen your offer.",
  Prepare:
    "Write out your complete offer delivery process from sale to completion. Identify the one step that is unclear or missing. Fix it before your next sale.",
  Align:
    "Rewrite your core message in one sentence that speaks directly to your client's most painful problem. Test it in content or a direct outreach message this week.",
  Transform:
    "Commit to one sales or content action every day for the next seven days. Do not break the chain. Consistency this week creates revenue next month.",
  Sustain:
    "Identify your most successful client outcome and build a retention or referral offer around it. Create one repeatable system this week that doesn't require your direct involvement.",
};

const ROLE_OFFER_FEEDBACK: Record<
  Role,
  {
    problem: string;
    audience: string;
    outcome: string;
    simplify: string;
    stop: string;
  }
> = {
  Driver: {
    problem:
      "A problem that requires faster execution, more accountability, or better measurable results",
    audience:
      "Founders or professionals who know what to do but struggle to do it consistently",
    outcome:
      "Measurable progress on a specific goal within a defined timeframe",
    simplify:
      "Remove any deliverable that doesn't directly drive action or accountability",
    stop: "Taking on clients who aren't ready to execute — they will drain your energy",
  },
  Connector: {
    problem:
      "A problem rooted in disconnection — team conflict, low trust, unclear culture, or weak client relationships",
    audience:
      "Leaders, teams, or communities that want deeper connection, alignment, or trust",
    outcome:
      "A stronger relationship, culture, or community that people actively choose to stay in",
    simplify:
      "Remove any deliverable that doesn't directly build connection or trust",
    stop: "Undercharging for relational work — connection is hard to build and highly valuable",
  },
  Architect: {
    problem:
      "A problem that requires better structure, clearer process, or more reliable and scalable systems",
    audience:
      "Entrepreneurs or teams doing good work but losing time and clients to disorganization",
    outcome:
      "A system, process, or framework they can use repeatedly without reinventing it",
    simplify:
      "Package your process into a fixed-scope offer rather than open-ended consulting",
    stop: "Custom work that can't be replicated — it limits your revenue ceiling",
  },
  Spotter: {
    problem:
      "A problem that requires fresh thinking, trend awareness, or strategic reframing",
    audience:
      "Leaders or entrepreneurs who feel stuck in outdated thinking or missing the next opportunity",
    outcome:
      "A new direction, strategy, or framework that gives them clarity on where to move next",
    simplify:
      "Remove every deliverable that isn't directly tied to insight or strategic clarity",
    stop: "Selling broad consulting or general advisory without a specific, named outcome",
  },
};

const ROLE_CONTENT_DIRECTION: Record<
  Role,
  {
    style: string;
    topics: string[];
    pain_points: string[];
    frequency: string;
    cta: string;
  }
> = {
  Driver: {
    style:
      "Action-oriented and results-focused — share what works and what you have built",
    topics: [
      "Execution case studies",
      "Practical action steps",
      "How you overcame specific obstacles",
    ],
    pain_points: [
      "Inconsistent execution",
      "Slow progress",
      "Getting stuck in planning",
    ],
    frequency:
      "Daily or 5x per week — volume and consistency are your advantage",
    cta: "Join an accountability programme or book a results audit",
  },
  Connector: {
    style:
      "Relational and empathetic — share stories, lessons, and human insight",
    topics: [
      "Community and belonging",
      "Trust and relationships in business",
      "Stories of connection and collaboration",
    ],
    pain_points: [
      "Feeling isolated in business",
      "Team conflict or low trust",
      "Disconnected from clients or community",
    ],
    frequency:
      "3–4x per week — focus on conversation and engagement over broadcast",
    cta: "Join the community or book a trust-building session",
  },
  Architect: {
    style:
      "Structured and educational — share frameworks, checklists, and processes",
    topics: [
      "Step-by-step guides",
      "Systems and templates",
      "How to avoid common execution mistakes",
    ],
    pain_points: [
      "Chaotic workflows",
      "Repeated mistakes",
      "Wasted time on disorganized work",
    ],
    frequency: "3x per week — prioritise practical, repeatable content",
    cta: "Download a template or book a systems audit",
  },
  Spotter: {
    style:
      "Insight-led and forward-looking — share what others haven't seen yet",
    topics: [
      "Emerging trends in your industry",
      "Reframes of common assumptions",
      "Strategic questions worth asking",
    ],
    pain_points: [
      "Feeling stuck in outdated thinking",
      "Missing the next opportunity",
      "Unclear on where the market is moving",
    ],
    frequency: "3x per week — prioritise depth and insight over volume",
    cta: "Book a strategy session or download a strategic framework",
  },
};

const ROLE_EXECUTION: Record<Role, string[]> = {
  Driver: [
    "Build a weekly sales rhythm — outreach, follow-up, and offer conversations on fixed days.",
    "Track one revenue-driving action daily and review your streak every Friday.",
    "Block two hours each week for strategic thinking — not just execution.",
  ],
  Connector: [
    "Create a direct offer this week — a specific service, price, and outcome for a specific person.",
    "Follow up with three past contacts this week without waiting for them to reach out.",
    "Build a simple referral system — ask satisfied clients for one introduction per month.",
  ],
  Architect: [
    "Set a launch date and work backwards — your offer doesn't need to be perfect to be sold.",
    "Create a simple onboarding checklist so delivery is consistent from client one.",
    "Identify one process you can delegate or automate this month.",
  ],
  Spotter: [
    "Choose one idea per quarter and execute it fully before starting the next.",
    "Partner with a Driver or Architect who can carry your ideas into consistent action.",
    "Set a weekly output goal — one piece of content, one offer conversation, one follow-up.",
  ],
};

const ROLE_NEXT_MOVE: Record<
  Role,
  {
    fix_first: string;
    stop_doing: string;
    start_doing: string;
    monetization_opportunity: string;
  }
> = {
  Driver: {
    fix_first: "Create a weekly sales rhythm and protect it from other work",
    stop_doing:
      "Waiting for perfect conditions before making offers or following up",
    start_doing:
      "Tracking one revenue-driving action every day without exception",
    monetization_opportunity:
      "Create a results-based offer with a clear outcome and timeline — clients pay more for certainty",
  },
  Connector: {
    fix_first:
      "Write one clear, direct offer and send it to three people this week",
    stop_doing:
      "Giving away value through free advice without converting it into a paid engagement",
    start_doing:
      "Asking every satisfied client for one introduction or referral",
    monetization_opportunity:
      "Build a community, membership, or cohort offer that monetises your ability to bring people together",
  },
  Architect: {
    fix_first:
      "Set a launch date for your current offer and commit to it publicly",
    stop_doing:
      "Adding more structure or features to an offer that hasn't been sold yet",
    start_doing:
      "Selling your offer before it's complete — validate first, then build",
    monetization_opportunity:
      "Package your process into a group programme or productised service that can run without you",
  },
  Spotter: {
    fix_first:
      "Narrow your positioning to one specific problem for one specific audience",
    stop_doing:
      "Starting new ideas before your current offer has been fully tested and sold",
    start_doing:
      "Booking one discovery conversation per week to validate your current offer",
    monetization_opportunity:
      "Package your insight into a paid workshop, advisory session, or strategic framework",
  },
};

// ── Pairing key helper ─────────────────────────────────────────

function getPairingKey(primary: Role, secondary: Role): string {
  const direct = `${primary}+${secondary}`;
  const reverse = `${secondary}+${primary}`;
  if (PAIRING_CONTENT[direct]) return direct;
  if (PAIRING_CONTENT[reverse]) return reverse;
  return direct;
}

// ── Main buildNarrative ────────────────────────────────────────

export function buildNarrative(input: NarrativeInput): Narrative {
  const { role_pair_title, top_adapts_stages, bottom_adapts_stages } = input;

  // Normalize roles (handle legacy names from DB)
  const primary_role = (ROLE_NAME_MAP[input.primary_role] ||
    input.primary_role) as Role;
  const secondary_role = (ROLE_NAME_MAP[input.secondary_role] ||
    input.secondary_role) as Role;

  // Normalize energy
  const mappedDominant = (ENERGY_NAME_MAP[input.energy_profile.dominant] ||
    input.energy_profile.dominant) as Energy;
  const mappedEnergyProfile = {
    ...input.energy_profile,
    dominant: mappedDominant,
  };

  // Normalize stage names (handle legacy long names from DB)
  const normalizedTop = top_adapts_stages.map(normalizeStageName);
  const normalizedBottom = bottom_adapts_stages.map(normalizeStageName);

  const primaryRole = ROLE_CONTENT[primary_role] || ROLE_CONTENT["Driver"];
  const secondaryRole =
    ROLE_CONTENT[secondary_role] || ROLE_CONTENT["Connector"];
  const energy =
    ENERGY_CONTENT[mappedEnergyProfile.dominant] || ENERGY_CONTENT["Achiever"];

  const pairingKey = getPairingKey(primary_role, secondary_role);
  const pairing = PAIRING_CONTENT[pairingKey] || {
    name: role_pair_title,
    description: `A unique combination of ${primary_role} and ${secondary_role} strengths. You bring both ${primaryRole.summary.toLowerCase()} and the complementary strengths of your adaptive role.`,
    benefits: [
      "Balances multiple contribution styles",
      "Adaptable to different team contexts",
      "Brings a unique problem-solving approach",
    ],
    watchouts: [
      "May experience tension between contribution styles",
      "Can be pulled in conflicting directions",
      "Risk of over-extending across both roles",
    ],
  };

  const topStage = normalizedTop[0];
  const secondStage = normalizedTop[1];
  const bottomStage = normalizedBottom[0];
  const secondBottom = normalizedBottom[1];

  const stageStrengths = STAGE_CONTENT[topStage]?.strengths || "";
  const secondStageStrength = secondStage
    ? STAGE_CONTENT[secondStage]?.strengths
    : "";
  const stageGrowth = STAGE_CONTENT[bottomStage]?.growth || "";
  const secondStageGrowth = secondBottom
    ? STAGE_CONTENT[secondBottom]?.growth
    : "";

  // Entrepreneur fields
  const weakest = bottomStage;

  return {
    executive_summary: `Your Change Genius™ profile reveals that you are a ${role_pair_title} — a ${primary_role} with a strong ${secondary_role} dimension. ${primaryRole.summary} Your ${secondary_role} adaptive strength adds ${secondaryRole.summary.split(".")[0].toLowerCase()}.`,

    // Primary role
    role_name: primaryRole.name,
    role_summary: primaryRole.summary,
    role_detailed: primaryRole.detailed,
    role_benefits: primaryRole.benefits,
    role_watchouts: primaryRole.watchouts,

    // Secondary role — full content, not a weak fallback
    secondary_role_name: secondaryRole.name,
    secondary_role_summary: secondaryRole.summary,
    secondary_role_detailed: secondaryRole.detailed,
    secondary_role_benefits: secondaryRole.benefits,
    secondary_role_watchouts: secondaryRole.watchouts,

    // Energy
    energy_name: energy.name,
    energy_summary: energy.summary,
    energy_detailed: energy.detailed,
    energy_benefits: energy.benefits,
    energy_watchouts: energy.watchouts,

    // ADAPTS
    adapts_strengths_summary: `Your strongest ADAPTS™ stages are ${topStage}${secondStage ? ` and ${secondStage}` : ""}.`,
    adapts_strengths_detailed: `${stageStrengths}${secondStageStrength ? ` You are also strong in the ${secondStage} stage. ${secondStageStrength}` : ""}`,
    adapts_growth_summary: `Your development areas are ${bottomStage}${secondBottom ? ` and ${secondBottom}` : ""}.`,
    adapts_growth_detailed: `${stageGrowth}${secondStageGrowth ? ` The ${secondBottom} stage is also an area to develop. ${secondStageGrowth}` : ""}`,

    // Pairing
    pairing_name: pairing.name,
    pairing_description: pairing.description,
    pairing_benefits: pairing.benefits,
    pairing_watchouts: pairing.watchouts,

    individual_in_team: primaryRole.in_team,

    // 30-day plan
    next_30_days: [
      `Identify one initiative you are currently involved in and deliberately apply your ${primary_role} strengths to move it forward.`,
      `Share your Change Genius™ profile with a colleague or team member — begin a conversation about how your strengths complement each other.`,
      `For the next week, notice when you are working in your ${bottomStage} growth area. Before diving in, identify whether a partner with that strength could support you.`,
      `Schedule a 30-minute reflection session at the end of the month to review where you have used your genius most effectively — and where you have felt drained.`,
    ],

    what_is_change_genius: `Change Genius™ is the first assessment-based framework that reveals how leaders and teams drive transformation. Built on three connected systems — your Role Profile, Productivity Energy, and ADAPTS™ stages — it gives every leader and organization a shared language for contribution, energy, and execution. Most change initiatives fail not because of strategy, but because leaders don't understand how they contribute, what energizes them, or where execution breaks down. Change Genius™ maps who you are in the system, what your team needs, and where momentum is being lost.`,

    how_to_apply_as_individual: [
      "Review your results and identify one change in your current role that would allow you to spend more time in your primary genius.",
      "Share your profile with your manager and discuss how to better align your responsibilities with your contribution strengths.",
      "Use the 30-day action plan to build habits that reinforce your genius and address your development areas.",
      "Invite your team to take the assessment so you can build a Team Change Map™ together.",
    ],

    how_to_apply_as_team: [
      "Have every team member take the Change Genius™ assessment and share their results in a team session.",
      "Create a Team Change Map™ that visualizes everyone's primary roles, energies, and ADAPTS™ strengths.",
      "Identify gaps in your team's coverage — which ADAPTS™ stages are weak and which roles are missing?",
      "Realign responsibilities to better match each person's contribution strength and energy.",
      "Use the Weekly Change Pulse™ to track team momentum and alignment over time.",
    ],

    // Entrepreneur
    entrepreneur_growth_pattern: ROLE_GROWTH_PATTERN[primary_role],
    revenue_leakage_pattern: STAGE_REVENUE_LEAKAGE[weakest],
    best_business_focus: STAGE_BUSINESS_FOCUS[weakest],
    offer_feedback: ROLE_OFFER_FEEDBACK[primary_role],
    content_direction: ROLE_CONTENT_DIRECTION[primary_role],
    execution_recommendations: ROLE_EXECUTION[primary_role],
    next_best_move: ROLE_NEXT_MOVE[primary_role],
  };
}
