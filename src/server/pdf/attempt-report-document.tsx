import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Svg,
  Circle,
  Path,
} from "@react-pdf/renderer";
import { AttemptApiResponse } from "@/types/quiz";

type AttemptReportDocumentProps = {
  attempt: AttemptApiResponse;
};

function formatCategory(category: string) {
  return category
    .toLowerCase()
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

export default function AttemptReportDocument({
  attempt,
}: AttemptReportDocumentProps) {
  const reportTitle = `Quiz Results - ${attempt.participant.name}`;

  const firstPageAnswers = attempt.answers.slice(0, 9);
  const secondPageAnswers = attempt.answers.slice(9);

  return (
    <Document
      title={reportTitle}
      author="Quiz Report App"
      subject={`${attempt.quiz.title} result report`}
    >
      <Page size="A4" style={styles.page}>
        <BrowserHeaderFooter
          title={reportTitle}
          date={formatDateTime(attempt.createdAt)}
        />

        <ScoreSummary attempt={attempt} />
        <Stats attempt={attempt} />
        <CategoryChart attempt={attempt} />

        <QuestionBreakdown answers={firstPageAnswers} startIndex={0} />
      </Page>

      <Page size="A4" style={styles.page}>
        <BrowserHeaderFooter
          title={reportTitle}
          date={formatDateTime(attempt.createdAt)}
        />

        <QuestionBreakdown
          answers={secondPageAnswers}
          startIndex={9}
          hideTitle={secondPageAnswers.length <= 1}
        />

        <Insights insights={attempt.insights} />
      </Page>
    </Document>
  );
}

function BrowserHeaderFooter({ title, date }: { title: string; date: string }) {
  return (
    <>
      <Text fixed style={styles.browserDate}>
        {date}
      </Text>

      <Text fixed style={styles.browserTitle}>
        {title}
      </Text>

      <Text
        fixed
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
      />
    </>
  );
}

function ScoreSummary({ attempt }: AttemptReportDocumentProps) {
  return (
    <View style={styles.hero}>
      <ScoreRadial percentage={attempt.percentage} />

      <View style={styles.heroContent}>
        <Text style={styles.performanceCategory}>
          {formatCategory(attempt.performanceCategory)}
        </Text>

        <Text style={styles.title}>
          {attempt.participant.name} - Quiz Results
        </Text>

        <Text style={styles.subtitle}>
          {attempt.quiz.title} - {attempt.answers.length} questions - Completed{" "}
          {formatDate(attempt.createdAt)}
        </Text>
      </View>
    </View>
  );
}

function ScoreRadial({ percentage }: { percentage: number }) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);
  const endAngle = (safePercentage / 100) * 360;
  const arcPath = describeArc(50, 50, 36, 0, endAngle);

  return (
    <View style={styles.scoreRadialWrapper}>
      <Svg width={96} height={96} viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r="36"
          stroke="#dedbd6"
          strokeWidth="8"
          fill="none"
        />

        {safePercentage > 0 ? (
          <Path
            d={arcPath}
            stroke="#20a67a"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
        ) : null}
      </Svg>

      <View style={styles.scoreRadialText}>
        <Text style={styles.scorePercent}>{safePercentage}%</Text>
        <Text style={styles.scoreLabel}>score</Text>
      </View>
    </View>
  );
}

function Stats({ attempt }: AttemptReportDocumentProps) {
  const correct = attempt.answers.filter((answer) => answer.isCorrect).length;
  const incorrect = attempt.answers.length - correct;

  return (
    <View style={styles.statsGrid}>
      <View style={styles.statBlock}>
        <Text style={styles.statLabel}>Total score</Text>
        <Text style={styles.statValue}>
          {attempt.score} / {attempt.maxScore}
        </Text>
      </View>

      <View style={styles.statBlock}>
        <Text style={styles.statLabel}>Correct</Text>
        <Text style={[styles.statValue, styles.correct]}>
          {correct} / {attempt.answers.length}
        </Text>
      </View>

      <View style={styles.statBlock}>
        <Text style={styles.statLabel}>Incorrect</Text>
        <Text style={[styles.statValue, styles.incorrect]}>
          {incorrect} / {attempt.answers.length}
        </Text>
      </View>
    </View>
  );
}

function CategoryChart({ attempt }: AttemptReportDocumentProps) {
  const chartHeight = 104;

  const maxCategoryScore = Math.max(
    ...attempt.categoryBreakdown.map((category) => category.maxScore),
    1,
  );

  const yAxisValues = [
    maxCategoryScore,
    maxCategoryScore * 0.8,
    maxCategoryScore * 0.6,
    maxCategoryScore * 0.4,
    maxCategoryScore * 0.2,
    0,
  ];

  return (
    <View style={styles.chartSection}>
      <Text style={styles.sectionTitle}>SCORE BY CATEGORY</Text>

      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.scoreLegendDot]} />
          <Text style={styles.chartLegendText}>Score</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.maxLegendDot]} />
          <Text style={styles.chartLegendText}>Max possible</Text>
        </View>
      </View>

      <View style={styles.chartArea}>
        <View style={styles.yAxis}>
          {yAxisValues.map((value) => (
            <Text key={value} style={styles.yAxisText}>
              {Math.round(value)}
            </Text>
          ))}
        </View>

        <View style={styles.chartPlot}>
          <View style={styles.chartYAxisLine} />
          <View style={styles.chartBaseline} />

          <View style={styles.barsArea}>
            {attempt.categoryBreakdown.map((category) => {
              const scoreHeight =
                (category.score / maxCategoryScore) * chartHeight;

              const maxHeight =
                (category.maxScore / maxCategoryScore) * chartHeight;

              return (
                <View key={category.category} style={styles.categoryGroup}>
                  <View style={styles.barPair}>
                    <View
                      style={[
                        styles.bar,
                        styles.scoreBar,
                        { height: scoreHeight },
                      ]}
                    />

                    <View
                      style={[styles.bar, styles.maxBar, { height: maxHeight }]}
                    />
                  </View>

                  <Text style={styles.categoryName}>
                    {formatCategory(category.category)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
function QuestionBreakdown({
  answers,
  startIndex,
  hideTitle = false,
}: {
  answers: AttemptApiResponse["answers"];
  startIndex: number;
  hideTitle?: boolean;
}) {
  if (answers.length === 0) return null;

  return (
    <View style={styles.section}>
      {!hideTitle ? (
        <Text style={styles.sectionTitle}>PER-QUESTION BREAKDOWN</Text>
      ) : null}

      <View>
        {answers.map((answer, index) => (
          <View key={answer.questionId} style={styles.questionRow} wrap={false}>
            <Text style={styles.questionNumber}>
              {String(startIndex + index + 1).padStart(2, "0")}
            </Text>

            <Text style={styles.questionText}>{answer.question}</Text>

            <View style={styles.questionRight}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>
                  {formatCategory(answer.category)}
                </Text>
              </View>

              <StatusIcon isCorrect={answer.isCorrect} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function StatusIcon({ isCorrect }: { isCorrect: boolean }) {
  return (
    <View
      style={[
        styles.statusCircle,
        isCorrect ? styles.correctCircle : styles.incorrectCircle,
      ]}
    >
      <Svg width={8} height={8} viewBox="0 0 8 8">
        {isCorrect ? (
          <Path
            d="M1.2 4.1 L3.1 6 L6.8 2"
            stroke="#5f914f"
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <>
            <Path
              d="M2 2 L6 6"
              stroke="#bd4a4a"
              strokeWidth={1.2}
              strokeLinecap="round"
              fill="none"
            />

            <Path
              d="M6 2 L2 6"
              stroke="#bd4a4a"
              strokeWidth={1.2}
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}
      </Svg>
    </View>
  );
}

function Insights({ insights }: { insights: AttemptApiResponse["insights"] }) {
  if (insights.length === 0) return null;

  return (
    <View style={styles.insightsSection}>
      <Text style={styles.insightsTitle}>INSIGHTS</Text>

      {insights.map((insight, index) => (
        <InsightItem
          key={`${insight.title}-${index}`}
          index={index}
          title={insight.title}
          description={insight.description}
        />
      ))}
    </View>
  );
}

function InsightItem({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.insightCard} wrap={false}>
      <View style={styles.insightIconColumn}>
        <InsightIcon index={index} />
      </View>

      <View style={styles.insightContent}>
        <Text style={styles.insightText}>
          <Text style={styles.insightStrong}>{title}. </Text>
          {description}
        </Text>
      </View>
    </View>
  );
}

function InsightIcon({ index }: { index: number }) {
  const color =
    index === 0
      ? "#c47a10"
      : index === 1
        ? "#6b8f1a"
        : index === 2
          ? "#c0303a"
          : "#1f66b3";

  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      {index === 0 ? (
        <>
          {/* trophy */}
          <Path
            d="M8 4h8v4.5c0 2.4-1.6 4.5-4 4.5s-4-2.1-4-4.5V4z"
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M8 6H5v2c0 1.7 1.3 3 3 3"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M16 6h3v2c0 1.7-1.3 3-3 3"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M12 13v4"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Path
            d="M9 20h6"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </>
      ) : index === 1 ? (
        <>
          {/* lightbulb */}
          <Path
            d="M9 18h6"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Path
            d="M10 21h4"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Path
            d="M8 10a4 4 0 1 1 8 0c0 1.5-.7 2.5-1.6 3.4-.7.7-1.1 1.4-1.2 2.6h-2.4c-.1-1.2-.5-1.9-1.2-2.6C8.7 12.5 8 11.5 8 10z"
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M12 2v2"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Path
            d="M4 10H2"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Path
            d="M22 10h-2"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </>
      ) : index === 2 ? (
        <>
          {/* target */}
          <Circle
            cx="12"
            cy="12"
            r="9"
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
          <Circle
            cx="12"
            cy="12"
            r="5"
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
          <Circle cx="12" cy="12" r="1.8" fill={color} />
        </>
      ) : (
        <>
          {/* chart line */}
          <Path
            d="M4 18h16"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Path
            d="M5 14l4-4 3 3 5-6 3 3"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      )}
    </Svg>
  );
}
const styles = StyleSheet.create({
  page: {
    paddingTop: 70,
    paddingHorizontal: 30,
    paddingBottom: 44,
    fontFamily: "Helvetica",
    color: "#303030",
    backgroundColor: "#ffffff",
    fontSize: 10,
  },

  browserDate: {
    position: "absolute",
    top: 12,
    left: 30,
    fontSize: 8,
    color: "#111111",
  },

  browserTitle: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
  },

  pageNumber: {
    position: "absolute",
    bottom: 16,
    right: 30,
    fontSize: 8,
    color: "#111111",
  },

  hero: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 36,
  },

  scoreRadialWrapper: {
    width: 106,
    height: 106,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  scoreRadialText: {
    position: "absolute",
    top: 36,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  scorePercent: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#222222",
  },

  scoreLabel: {
    marginTop: 1,
    fontSize: 8,
    color: "#777777",
  },

  heroContent: {
    marginLeft: 26,
    flex: 1,
  },

  performanceCategory: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#8b735b",
    marginBottom: 8,
  },

  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#222222",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 11,
    color: "#6d6d6d",
  },

  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  statBlock: {
    width: "30%",
  },

  statLabel: {
    fontSize: 10,
    color: "#777777",
    marginBottom: 6,
  },

  statValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#222222",
  },

  correct: {
    color: "#25824f",
  },

  incorrect: {
    color: "#9e3b3b",
  },

  section: {
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: "Helvetica-Bold",
    color: "#4d4d4d",
    marginBottom: 10,
  },

  chartSection: {
    marginBottom: 10,
  },

  chartLegend: {
    flexDirection: "row",
    marginLeft: 16,
    marginBottom: 5,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },

  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },

  scoreLegendDot: {
    backgroundColor: "#20a177",
  },

  maxLegendDot: {
    backgroundColor: "#3d3d3d",
  },

  chartLegendText: {
    fontSize: 8,
    color: "#666666",
  },

  chartArea: {
    height: 144,
    flexDirection: "row",
    marginBottom: 4,
  },

  yAxis: {
    width: 18,
    height: 112,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 6,
  },

  yAxisText: {
    fontSize: 8,
    color: "#8a8a8a",
  },

  chartPlot: {
    flex: 1,
    height: 128,
    position: "relative",
  },

  chartYAxisLine: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 1,
    height: 104,
    backgroundColor: "#e1dfda",
  },

  chartBaseline: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 104,
    height: 1,
    backgroundColor: "#e1dfda",
  },

  barsArea: {
    flex: 1,
    height: 128,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingLeft: 4,
  },

  categoryGroup: {
    width: 72,
    alignItems: "center",
  },

  barPair: {
    height: 104,
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },

  bar: {
    width: 34,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  scoreBar: {
    backgroundColor: "#20a177",
    marginRight: 4,
  },

  maxBar: {
    backgroundColor: "#3d3d3d",
  },

  categoryName: {
    fontSize: 9,
    color: "#7a7a7a",
  },

  questionRow: {
    height: 28,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 6,
    marginBottom: 4,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  questionNumber: {
    width: 26,
    fontSize: 9,
    color: "#555555",
  },

  questionText: {
    flex: 1,
    fontSize: 9.8,
    color: "#222222",
    paddingRight: 8,
  },

  questionRight: {
    width: 108,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  categoryPill: {
    borderWidth: 1,
    borderColor: "#d5d5d5",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    marginRight: 8,
    minWidth: 42,
    alignItems: "center",
  },

  categoryPillText: {
    fontSize: 8,
    color: "#666666",
  },

  statusCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  correctCircle: {
    borderColor: "#79a46b",
  },

  incorrectCircle: {
    borderColor: "#c85c5c",
  },

  insightsSection: {
    marginTop: 14,
  },

  insightsTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#4d4d4d",
    marginBottom: 12,
  },

  insightCard: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: "#ded9d1",
    borderRadius: 8,
    paddingTop: 11,
    paddingBottom: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    flexDirection: "row",
  },

  insightIconColumn: {
    width: 26,
    alignItems: "flex-start",
    paddingTop: 1,
  },

  insightContent: {
    flex: 1,
  },

  insightText: {
    fontSize: 10,
    lineHeight: 1.45,
    color: "#5f5f5f",
  },

  insightStrong: {
    fontFamily: "Helvetica-Bold",
    color: "#1f1f1f",
  },
});
