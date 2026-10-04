import Link from "next/link";
import { colors } from "@/styles/colors";
import { commonStyles } from "@/styles/common";
import { markidim } from "@/data/markidim";
import DanceSearch from "@/components/DanceSearch";
import { dances } from "@/data/dances";

export default function DancesPage() {
  return (
    <main style={commonStyles.page}>
      <div style={commonStyles.container}>
        <div style={commonStyles.pageHeader}>
          <h1 style={styles.title}>Dances</h1>

          <Link href="/submit?type=dance" style={commonStyles.button}>
            Add New Dance
          </Link>
        </div>
        <DanceSearch dances={dances} markidim={markidim} />{" "}
      </div>
    </main>
  );
}

const styles = {
  list: {
    display: "grid",
    gap: "24px",
  },
  hebrew: {
    fontSize: "20px",
    marginBottom: "20px",
  },
};
