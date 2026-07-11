import type { MovementPattern } from '../types'

interface Point {
  x: number
  y: number
}

interface Pose {
  head: Point
  // body chain: shoulder -> hip
  torso: [Point, Point]
  // arm chain: shoulder -> elbow -> hand
  arm: [Point, Point, Point]
  // leg chain: hip -> knee -> foot
  leg: [Point, Point, Point]
  equipment?: React.ReactNode
}

const HEAD_R = 6

function Limb({ points }: { points: Point[] }) {
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  return <path d={d} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} />
}

function Joint({ p }: { p: Point }) {
  return <circle cx={p.x} cy={p.y} r={2.4} fill="currentColor" stroke="none" />
}

function Figure({ pose }: { pose: Pose }) {
  return (
    <>
      {pose.equipment}
      <g className="text-[var(--color-ink)]" stroke="currentColor" fill="none">
        <Limb points={pose.torso} />
        <Limb points={pose.arm} />
        <Limb points={pose.leg} />
      </g>
      <circle cx={pose.head.x} cy={pose.head.y} r={HEAD_R} fill="none" stroke="currentColor" strokeWidth={4} />
      <g fill="currentColor">
        <Joint p={pose.arm[1]} />
        <Joint p={pose.arm[2]} />
        <Joint p={pose.leg[1]} />
        <Joint p={pose.leg[2]} />
      </g>
    </>
  )
}

const bench = (x: number, y: number, w: number) => (
  <rect x={x} y={y} width={w} height={5} rx={1.5} fill="var(--color-line)" />
)

const seatBlock = (x: number, y: number) => (
  <rect x={x} y={y} width={12} height={16} rx={2} fill="var(--color-line)" />
)

const cableLine = (x1: number, y1: number, x2: number, y2: number) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-brand)" strokeWidth={1.5} strokeDasharray="3 3" />
)

const floor = <line x1={6} y1={92} x2={94} y2={92} stroke="var(--color-line)" strokeWidth={3} strokeLinecap="round" />

const POSES: Record<MovementPattern, Pose> = {
  legPress: {
    head: { x: 24, y: 40 },
    torso: [{ x: 24, y: 46 }, { x: 46, y: 58 }],
    arm: [{ x: 24, y: 46 }, { x: 34, y: 56 }, { x: 44, y: 50 }],
    leg: [{ x: 46, y: 58 }, { x: 66, y: 58 }, { x: 86, y: 46 }],
    equipment: (
      <>
        {seatBlock(6, 40)}
        <rect x={80} y={20} width={6} height={40} rx={1.5} fill="var(--color-line)" />
        {floor}
      </>
    ),
  },
  legExtension: {
    head: { x: 26, y: 26 },
    torso: [{ x: 26, y: 32 }, { x: 30, y: 55 }],
    arm: [{ x: 26, y: 32 }, { x: 18, y: 45 }, { x: 14, y: 58 }],
    leg: [{ x: 30, y: 55 }, { x: 52, y: 58 }, { x: 66, y: 44 }],
    equipment: (
      <>
        {seatBlock(20, 55)}
        <line x1={66} y1={44} x2={66} y2={70} stroke="var(--color-line)" strokeWidth={4} strokeLinecap="round" />
        {floor}
      </>
    ),
  },
  legCurl: {
    head: { x: 16, y: 30 },
    torso: [{ x: 16, y: 36 }, { x: 34, y: 40 }],
    arm: [{ x: 16, y: 36 }, { x: 10, y: 46 }, { x: 8, y: 58 }],
    leg: [{ x: 34, y: 40 }, { x: 60, y: 42 }, { x: 74, y: 26 }],
    equipment: (
      <>
        <rect x={6} y={38} width={70} height={6} rx={2} fill="var(--color-line)" />
        <line x1={74} y1={26} x2={74} y2={44} stroke="var(--color-line)" strokeWidth={4} strokeLinecap="round" />
        {floor}
      </>
    ),
  },
  hipThrust: {
    head: { x: 14, y: 62 },
    torso: [{ x: 14, y: 68 }, { x: 46, y: 52 }],
    arm: [{ x: 14, y: 68 }, { x: 10, y: 78 }, { x: 12, y: 88 }],
    leg: [{ x: 46, y: 52 }, { x: 60, y: 74 }, { x: 60, y: 90 }],
    equipment: (
      <>
        {bench(4, 66, 20)}
        {floor}
      </>
    ),
  },
  hipHinge: {
    head: { x: 22, y: 30 },
    torso: [{ x: 22, y: 36 }, { x: 46, y: 60 }],
    arm: [{ x: 22, y: 36 }, { x: 26, y: 52 }, { x: 30, y: 66 }],
    leg: [{ x: 46, y: 60 }, { x: 50, y: 78 }, { x: 52, y: 90 }],
    equipment: <>{floor}</>,
  },
  cablePullThrough: {
    head: { x: 22, y: 30 },
    torso: [{ x: 22, y: 36 }, { x: 46, y: 58 }],
    arm: [{ x: 22, y: 36 }, { x: 18, y: 52 }, { x: 16, y: 70 }],
    leg: [{ x: 46, y: 58 }, { x: 50, y: 76 }, { x: 52, y: 90 }],
    equipment: (
      <>
        {cableLine(16, 70, 16, 92)}
        {floor}
      </>
    ),
  },
  adduction: {
    head: { x: 50, y: 22 },
    torso: [{ x: 50, y: 28 }, { x: 50, y: 52 }],
    arm: [{ x: 50, y: 28 }, { x: 38, y: 40 }, { x: 34, y: 52 }],
    leg: [{ x: 50, y: 52 }, { x: 62, y: 60 }, { x: 66, y: 80 }],
    equipment: (
      <>
        {seatBlock(44, 52)}
        <line x1={38} y1={70} x2={62} y2={70} stroke="var(--color-brand)" strokeWidth={3} strokeLinecap="round" />
        {floor}
      </>
    ),
  },
  abduction: {
    head: { x: 50, y: 22 },
    torso: [{ x: 50, y: 28 }, { x: 50, y: 52 }],
    arm: [{ x: 50, y: 28 }, { x: 62, y: 40 }, { x: 66, y: 52 }],
    leg: [{ x: 50, y: 52 }, { x: 38, y: 60 }, { x: 30, y: 78 }],
    equipment: (
      <>
        {seatBlock(44, 52)}
        <line x1={30} y1={68} x2={70} y2={68} stroke="var(--color-brand)" strokeWidth={3} strokeLinecap="round" />
        {floor}
      </>
    ),
  },
  chestPress: {
    head: { x: 18, y: 28 },
    torso: [{ x: 18, y: 34 }, { x: 22, y: 58 }],
    arm: [{ x: 18, y: 34 }, { x: 40, y: 32 }, { x: 62, y: 30 }],
    leg: [{ x: 22, y: 58 }, { x: 30, y: 76 }, { x: 30, y: 90 }],
    equipment: (
      <>
        <rect x={6} y={30} width={12} height={32} rx={2} fill="var(--color-line)" />
        {floor}
      </>
    ),
  },
  row: {
    head: { x: 20, y: 30 },
    torso: [{ x: 20, y: 36 }, { x: 26, y: 58 }],
    arm: [{ x: 20, y: 36 }, { x: 42, y: 40 }, { x: 62, y: 42 }],
    leg: [{ x: 26, y: 58 }, { x: 32, y: 76 }, { x: 32, y: 90 }],
    equipment: (
      <>
        {seatBlock(20, 58)}
        {cableLine(62, 42, 82, 42)}
        {floor}
      </>
    ),
  },
  latPulldown: {
    head: { x: 22, y: 34 },
    torso: [{ x: 22, y: 40 }, { x: 26, y: 62 }],
    arm: [{ x: 22, y: 40 }, { x: 34, y: 24 }, { x: 44, y: 16 }],
    leg: [{ x: 26, y: 62 }, { x: 32, y: 80 }, { x: 32, y: 90 }],
    equipment: (
      <>
        {seatBlock(20, 62)}
        {cableLine(44, 16, 44, 8)}
        <line x1={20} y1={16} x2={70} y2={16} stroke="var(--color-line)" strokeWidth={3} strokeLinecap="round" />
        {floor}
      </>
    ),
  },
  shoulderPress: {
    head: { x: 20, y: 34 },
    torso: [{ x: 20, y: 40 }, { x: 24, y: 62 }],
    arm: [{ x: 20, y: 40 }, { x: 24, y: 20 }, { x: 24, y: 8 }],
    leg: [{ x: 24, y: 62 }, { x: 30, y: 80 }, { x: 30, y: 90 }],
    equipment: (
      <>
        {seatBlock(18, 62)}
        {floor}
      </>
    ),
  },
  lateralRaise: {
    head: { x: 20, y: 30 },
    torso: [{ x: 20, y: 36 }, { x: 24, y: 60 }],
    arm: [{ x: 20, y: 36 }, { x: 42, y: 32 }, { x: 58, y: 26 }],
    leg: [{ x: 24, y: 60 }, { x: 30, y: 78 }, { x: 30, y: 90 }],
    equipment: <>{floor}</>,
  },
  bicepCurl: {
    head: { x: 20, y: 30 },
    torso: [{ x: 20, y: 36 }, { x: 24, y: 60 }],
    arm: [{ x: 20, y: 36 }, { x: 26, y: 50 }, { x: 20, y: 44 }],
    leg: [{ x: 24, y: 60 }, { x: 30, y: 78 }, { x: 30, y: 90 }],
    equipment: <>{floor}</>,
  },
  tricepPushdown: {
    head: { x: 20, y: 26 },
    torso: [{ x: 20, y: 32 }, { x: 24, y: 56 }],
    arm: [{ x: 20, y: 32 }, { x: 26, y: 48 }, { x: 28, y: 66 }],
    leg: [{ x: 24, y: 56 }, { x: 30, y: 76 }, { x: 30, y: 90 }],
    equipment: (
      <>
        {cableLine(28, 66, 28, 14)}
        {floor}
      </>
    ),
  },
  plank: {
    head: { x: 16, y: 60 },
    torso: [{ x: 16, y: 60 }, { x: 60, y: 56 }],
    arm: [{ x: 16, y: 60 }, { x: 18, y: 74 }, { x: 20, y: 84 }],
    leg: [{ x: 60, y: 56 }, { x: 78, y: 70 }, { x: 90, y: 82 }],
    equipment: <>{floor}</>,
  },
  deadBug: {
    head: { x: 14, y: 62 },
    torso: [{ x: 14, y: 62 }, { x: 46, y: 62 }],
    arm: [{ x: 20, y: 62 }, { x: 26, y: 44 }, { x: 30, y: 28 }],
    leg: [{ x: 46, y: 62 }, { x: 56, y: 44 }, { x: 70, y: 30 }],
    equipment: <>{floor}</>,
  },
  gluteKickback: {
    head: { x: 20, y: 26 },
    torso: [{ x: 20, y: 32 }, { x: 30, y: 54 }],
    arm: [{ x: 20, y: 32 }, { x: 12, y: 44 }, { x: 8, y: 56 }],
    leg: [{ x: 30, y: 54 }, { x: 52, y: 58 }, { x: 74, y: 46 }],
    equipment: (
      <>
        {cableLine(74, 46, 90, 46)}
        {floor}
      </>
    ),
  },
  calfRaise: {
    head: { x: 30, y: 22 },
    torso: [{ x: 30, y: 28 }, { x: 32, y: 56 }],
    arm: [{ x: 30, y: 28 }, { x: 26, y: 42 }, { x: 22, y: 56 }],
    leg: [{ x: 32, y: 56 }, { x: 36, y: 74 }, { x: 40, y: 88 }],
    equipment: <>{floor}</>,
  },
}

const PATTERN_LABELS: Record<MovementPattern, string> = {
  legPress: 'Leg press',
  legExtension: 'Leg extension',
  legCurl: 'Leg curl',
  hipThrust: 'Hip thrust',
  hipHinge: 'Hip hinge',
  adduction: 'Hip adduction',
  abduction: 'Hip abduction',
  chestPress: 'Chest press',
  row: 'Seated row',
  latPulldown: 'Lat pulldown',
  shoulderPress: 'Shoulder press',
  lateralRaise: 'Lateral raise',
  bicepCurl: 'Bicep curl',
  tricepPushdown: 'Triceps pushdown',
  plank: 'Plank hold',
  deadBug: 'Dead bug',
  cablePullThrough: 'Cable pull-through',
  gluteKickback: 'Glute kickback',
  calfRaise: 'Calf raise',
}

export function ExerciseIllustration({
  pattern,
  className,
}: {
  pattern: MovementPattern
  className?: string
}) {
  const pose = POSES[pattern]
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={`${PATTERN_LABELS[pattern]} illustration`}
    >
      <rect x={0} y={0} width={100} height={100} rx={16} fill="var(--color-brand-soft)" />
      <g className="text-[var(--color-brand-dark)]" color="var(--color-brand-dark)">
        <Figure pose={pose} />
      </g>
    </svg>
  )
}
